import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Resume, RoleTarget, EnhancementLevel } from '../types/resume';
import { 
  createResume as createFirestoreResume, 
  updateResume as updateFirestoreResume,
  deleteResume as deleteFirestoreResume,
  getUserResumes,
  getResume as getFirestoreResume
} from '../lib/firestore';
import { useFirebase } from '../contexts/FirebaseContext';

interface ResumeStore {
  // Resume data
  resume: Resume;
  resumes: Resume[];
  
  // UI state
  selectedSection: string | null;
  aiEnhancementOptions: {
    targetRole: RoleTarget;
    enhancementLevel: EnhancementLevel;
    enableQuantification: boolean;
    enableKeywords: boolean;
    preserveFacts: boolean;
  };
  showGapFill: boolean;
  showKeywordOptimizer: boolean;
  showExportDialog: boolean;
  showSettings: boolean;
  
  // Actions
  updateHeader: (updates: Partial<Resume['header']>) => void;
  updateEducation: (updates: Partial<Resume['education'][0]>, index: number) => void;
  addEducation: () => void;
  removeEducation: (index: number) => void;
  updateExperience: (updates: Partial<Resume['experience'][0]>, index: number) => void;
  addExperience: () => void;
  removeExperience: (index: number) => void;
  updateExperienceBullet: (expIndex: number, bulletIndex: number, updates: Partial<Resume['experience'][0]['bullets'][0]>) => void;
  addExperienceBullet: (expIndex: number) => void;
  removeExperienceBullet: (expIndex: number, bulletIndex: number) => void;
  updateLeadership: (updates: Partial<Resume['leadership'][0]>, index: number) => void;
  addLeadership: () => void;
  removeLeadership: (index: number) => void;
  updateProject: (updates: Partial<Resume['projects'][0]>, index: number) => void;
  addProject: () => void;
  removeProject: (index: number) => void;
  updateSkills: (updates: Partial<Resume['skills']>) => void;
  addActivity: (activity: string) => void;
  removeActivity: (index: number) => void;
  addInterest: (interest: string) => void;
  removeInterest: (index: number) => void;
  updateCertification: (updates: Partial<Resume['certifications'][0]>, index: number) => void;
  addCertification: () => void;
  removeCertification: (index: number) => void;
  updateDeal: (updates: Partial<Resume['deals'][0]>, index: number) => void;
  addDeal: () => void;
  removeDeal: (index: number) => void;
  updateRoleTarget: (role: RoleTarget) => void;
  
  // UI actions
  setSelectedSection: (section: string | null) => void;
  setAIEnhancementOptions: (options: Partial<ResumeStore['aiEnhancementOptions']>) => void;
  setShowGapFill: (show: boolean) => void;
  setShowKeywordOptimizer: (show: boolean) => void;
  setShowExportDialog: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  
  // Firebase actions
  saveResume: () => Promise<string | null>;
  loadResume: (resumeId: string) => Promise<void>;
  loadUserResumes: () => Promise<void>;
  deleteResume: (resumeId: string) => Promise<void>;
  duplicateResume: (resumeId: string) => Promise<string | null>;
  
  // Reset
  resetResume: () => void;
  loadSampleResume: () => void;
}

// Sample resume data as specified in requirements
const sampleResume: Resume = {
  id: 'sample-1',
  meta: {
    templateId: 'finance-docx-locked',
    roleTarget: 'Investment Banking Analyst',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  header: {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    location: 'Vancouver, BC',
    linkedin: 'linkedin.com/in/johndoe',
  },
  education: [
    {
      school: 'University of British Columbia',
      degree: 'Bachelor of Commerce',
      major: 'Finance',
      graduationYear: '2026',
      gpa: '3.8/4.0',
      location: 'Vancouver, BC',
      awards: ["Dean's Honour List"],
      coursework: ['Economics', 'Accounting', 'Finance', 'Business Management'],
      competitions: ['Case Competition Winner'],
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'RBC Capital Markets',
      title: 'Investment Banking Summer Analyst',
      location: 'Toronto, ON',
      startDate: 'May 2024',
      endDate: 'Aug 2024',
      groupName: 'Technology & Consumer',
      summary: 'Supported live M&A and financing transactions across technology and consumer sectors, preparing pitch materials and valuation models',
      bullets: [
        {
          id: 'bullet-1',
          text: 'Led team efforts to analyze $450M software acquisition by creating comprehensive DCF and comparable company models; resulted in 7% valuation accuracy and successful client presentation',
          enhancementLevel: 'Keep as-is',
          originalText: 'Led team efforts to analyze $450M software acquisition by creating comprehensive DCF and comparable company models; resulted in 7% valuation accuracy and successful client presentation',
        },
        {
          id: 'bullet-2',
          text: 'Analyzed options available for $200M consumer retail divestiture and recommended optimal buyer strategy based on time and resource considerations; implementation led to successful marketing of asset',
          enhancementLevel: 'Keep as-is',
          originalText: 'Analyzed options available for $200M consumer retail divestiture and recommended optimal buyer strategy based on time and resource considerations; implementation led to successful marketing of asset',
        },
        {
          id: 'bullet-3',
          text: 'Developed strategy for marketing to new prospective clients through innovative pitch book design; resulted in increased awareness and capital commitments',
          enhancementLevel: 'Keep as-is',
          originalText: 'Developed strategy for marketing to new prospective clients through innovative pitch book design; resulted in increased awareness and capital commitments',
        },
      ],
      selectedProjects: [
        {
          name: 'Software Acquisition',
          action: 'Led team to build DCF and comps',
          result: 'which resulted in 7% valuation accuracy and successful client presentation',
        },
        {
          name: 'Consumer Retail Divestiture',
          action: 'Analyzed buyer options and recommended strategy',
          result: 'which made project viable and resulted in successful asset marketing',
        },
        {
          name: 'Client Marketing Strategy',
          action: 'Created innovative pitch book design',
          result: 'which led to increased client awareness and capital commitments',
        },
      ],
    },
    {
      id: 'exp-2',
      company: 'PwC',
      title: 'Deals Intern, Valuations',
      location: 'Vancouver, BC',
      startDate: 'Jan 2024',
      endDate: 'Apr 2024',
      groupName: 'Deals',
      summary: 'Conducted valuations for mid-market clients using precedent transactions, multiples, and DCF; summarized results in fairness opinion reports',
      bullets: [
        {
          id: 'bullet-4',
          text: 'Led team efforts to conduct comprehensive valuations by creating dynamic Excel models; resulted in improved efficiency and accurate client deliverables',
          enhancementLevel: 'Keep as-is',
          originalText: 'Led team efforts to conduct comprehensive valuations by creating dynamic Excel models; resulted in improved efficiency and accurate client deliverables',
        },
        {
          id: 'bullet-5',
          text: 'Analyzed valuation methodologies and concluded that DCF approach was most appropriate for technology clients; resulted in company proceeding with project and successful client outcomes',
          enhancementLevel: 'Keep as-is',
          originalText: 'Analyzed valuation methodologies and concluded that DCF approach was most appropriate for technology clients; resulted in company proceeding with project and successful client outcomes',
        },
      ],
      selectedProjects: [],
    },
  ],
  leadership: [
    {
      id: 'lead-1',
      organization: 'UBC Finance Club',
      role: 'Vice President, Case Competitions',
      location: 'Vancouver, BC',
      startDate: 'Sept 2023',
      endDate: 'Present',
      bullets: [
        {
          id: 'bullet-6',
          text: 'Led team efforts to organize annual finance case competition by creating promotional campaigns and managing logistics; resulted in 120+ participants and Big 4 firm sponsorships',
          enhancementLevel: 'Keep as-is',
          originalText: 'Led team efforts to organize annual finance case competition by creating promotional campaigns and managing logistics; resulted in 120+ participants and Big 4 firm sponsorships',
        },
        {
          id: 'bullet-7',
          text: 'Recruited over 50 members to club with promotional campaign',
          enhancementLevel: 'Keep as-is',
          originalText: 'Recruited over 50 members to club with promotional campaign',
        },
        {
          id: 'bullet-8',
          text: 'Organized conferences, speaker events and community events',
          enhancementLevel: 'Keep as-is',
          originalText: 'Organized conferences, speaker events and community events',
        },
      ],
    },
  ],
  projects: [],
  skills: {
    technical: ['Excel (Advanced)', 'PowerPoint', 'Financial Modeling (DCF, LBO, Comps)'],
    financeTools: ['Bloomberg Terminal', 'Capital IQ'],
    languages: ['English'],
    programming: ['Python (Pandas, NumPy)'],
  },
  certifications: [],
  deals: [],
  activities: ['CFA Research Challenge (2024)', 'Volunteer — Junior Achievement financial literacy programs'],
  interests: ['Long-distance running, contemporary art, chess'],
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      resume: sampleResume,
      resumes: [],
      
      // UI state
      selectedSection: null,
      aiEnhancementOptions: {
        targetRole: 'Investment Banking Analyst',
        enhancementLevel: 'Conservative',
        enableQuantification: true,
        enableKeywords: true,
        preserveFacts: true,
      },
      showGapFill: false,
      showKeywordOptimizer: false,
      showExportDialog: false,
      showSettings: false,

      // Resume update actions
      updateHeader: (updates) => set((state) => ({
        resume: {
          ...state.resume,
          header: { ...state.resume.header, ...updates },
        },
      })),

      updateEducation: (updates, index) => set((state) => ({
        resume: {
          ...state.resume,
          education: state.resume.education.map((edu, i) =>
            i === index ? { ...edu, ...updates } : edu
          ),
        },
      })),

      addEducation: () => set((state) => ({
        resume: {
          ...state.resume,
          education: [
            ...state.resume.education,
            {
              school: '',
              degree: '',
              major: '',
              graduationYear: '',
              gpa: '',
              location: '',
              awards: [],
              coursework: [],
              competitions: [],
            },
          ],
        },
      })),

      removeEducation: (index) => set((state) => ({
        resume: {
          ...state.resume,
          education: state.resume.education.filter((_, i) => i !== index),
        },
      })),

      updateExperience: (updates, index) => set((state) => ({
        resume: {
          ...state.resume,
          experience: state.resume.experience.map((exp, i) =>
            i === index ? { ...exp, ...updates } : exp
          ),
        },
      })),

      addExperience: () => set((state) => ({
        resume: {
          ...state.resume,
          experience: [
            ...state.resume.experience,
            {
              id: `exp-${Date.now()}`,
              company: '',
              title: '',
              location: '',
              startDate: '',
              endDate: '',
              groupName: '',
              summary: '',
              bullets: [],
              selectedProjects: [],
            },
          ],
        },
      })),

      removeExperience: (index) => set((state) => ({
        resume: {
          ...state.resume,
          experience: state.resume.experience.filter((_, i) => i !== index),
        },
      })),

      updateExperienceBullet: (expIndex, bulletIndex, updates) => set((state) => ({
        resume: {
          ...state.resume,
          experience: state.resume.experience.map((exp, i) =>
            i === expIndex
              ? {
                  ...exp,
                  bullets: exp.bullets.map((bullet, j) =>
                    j === bulletIndex ? { ...bullet, ...updates } : bullet
                  ),
                }
              : exp
          ),
        },
      })),

      addExperienceBullet: (expIndex) => set((state) => ({
        resume: {
          ...state.resume,
          experience: state.resume.experience.map((exp, i) =>
            i === expIndex
              ? {
                  ...exp,
                  bullets: [
                    ...exp.bullets,
                    {
                      id: `bullet-${Date.now()}`,
                      text: '',
                      enhancementLevel: 'Keep as-is',
                    },
                  ],
                }
              : exp
          ),
        },
      })),

      removeExperienceBullet: (expIndex, bulletIndex) => set((state) => ({
        resume: {
          ...state.resume,
          experience: state.resume.experience.map((exp, i) =>
            i === expIndex
              ? {
                  ...exp,
                  bullets: exp.bullets.filter((_, j) => j !== bulletIndex),
                }
              : exp
          ),
        },
      })),

      updateLeadership: (updates, index) => set((state) => ({
        resume: {
          ...state.resume,
          leadership: state.resume.leadership.map((lead, i) =>
            i === index ? { ...lead, ...updates } : lead
          ),
        },
      })),

      addLeadership: () => set((state) => ({
        resume: {
          ...state.resume,
          leadership: [
            ...state.resume.leadership,
            {
              id: `lead-${Date.now()}`,
              organization: '',
              role: '',
              location: '',
              startDate: '',
              endDate: '',
              bullets: [],
            },
          ],
        },
      })),

      removeLeadership: (index) => set((state) => ({
        resume: {
          ...state.resume,
          leadership: state.resume.leadership.filter((_, i) => i !== index),
        },
      })),

      updateProject: (updates, index) => set((state) => ({
        resume: {
          ...state.resume,
          projects: state.resume.projects.map((proj, i) =>
            i === index ? { ...proj, ...updates } : proj
          ),
        },
      })),

      addProject: () => set((state) => ({
        resume: {
          ...state.resume,
          projects: [
            ...state.resume.projects,
            {
              id: `proj-${Date.now()}`,
              name: '',
              startDate: '',
              endDate: '',
              bullets: [],
            },
          ],
        },
      })),

      removeProject: (index) => set((state) => ({
        resume: {
          ...state.resume,
          projects: state.resume.projects.filter((_, i) => i !== index),
        },
      })),

      updateSkills: (updates) => set((state) => ({
        resume: {
          ...state.resume,
          skills: { ...state.resume.skills, ...updates },
        },
      })),

      addActivity: (activity) => set((state) => ({
        resume: {
          ...state.resume,
          activities: [...state.resume.activities, activity],
        },
      })),

      removeActivity: (index) => set((state) => ({
        resume: {
          ...state.resume,
          activities: state.resume.activities.filter((_, i) => i !== index),
        },
      })),

      addInterest: (interest) => set((state) => ({
        resume: {
          ...state.resume,
          interests: [...state.resume.interests, interest],
        },
      })),

      removeInterest: (index) => set((state) => ({
        resume: {
          ...state.resume,
          interests: state.resume.interests.filter((_, i) => i !== index),
        },
      })),

      updateCertification: (updates, index) => set((state) => ({
        resume: {
          ...state.resume,
          certifications: state.resume.certifications.map((cert, i) =>
            i === index ? { ...cert, ...updates } : cert
          ),
        },
      })),

      addCertification: () => set((state) => ({
        resume: {
          ...state.resume,
          certifications: [
            ...state.resume.certifications,
            {
              id: `cert-${Date.now()}`,
              name: '',
              issuer: '',
              date: '',
            },
          ],
        },
      })),

      removeCertification: (index) => set((state) => ({
        resume: {
          ...state.resume,
          certifications: state.resume.certifications.filter((_, i) => i !== index),
        },
      })),

      updateDeal: (updates, index) => set((state) => ({
        resume: {
          ...state.resume,
          deals: state.resume.deals.map((deal, i) =>
            i === index ? { ...deal, ...updates } : deal
          ),
        },
      })),

      addDeal: () => set((state) => ({
        resume: {
          ...state.resume,
          deals: [
            ...state.resume.deals,
            {
              id: `deal-${Date.now()}`,
              type: '',
              size: '',
              role: '',
              tasks: [],
              outcome: '',
            },
          ],
        },
      })),

      removeDeal: (index) => set((state) => ({
        resume: {
          ...state.resume,
          deals: state.resume.deals.filter((_, i) => i !== index),
        },
      })),

      updateRoleTarget: (role) => set((state) => ({
        resume: {
          ...state.resume,
          meta: { ...state.resume.meta, roleTarget: role },
        },
        aiEnhancementOptions: {
          ...state.aiEnhancementOptions,
          targetRole: role,
        },
      })),

      // UI actions
      setSelectedSection: (section) => set({ selectedSection: section }),
      setAIEnhancementOptions: (options) => set((state) => ({
        aiEnhancementOptions: { ...state.aiEnhancementOptions, ...options },
      })),
      setShowGapFill: (show) => set({ showGapFill: show }),
      setShowKeywordOptimizer: (show) => set({ showKeywordOptimizer: show }),
      setShowExportDialog: (show) => set({ showExportDialog: show }),
      setShowSettings: (show) => set({ showSettings: show }),

      // Firebase actions
      saveResume: async () => {
        try {
          const { resume } = get();
          const { currentUser } = useFirebase();
          
          if (!currentUser) {
            throw new Error('User not authenticated');
          }

          if (resume.id === 'sample-1') {
            // Create new resume
            const newId = await createFirestoreResume(resume, currentUser.uid);
            set((state) => ({
              resume: { ...state.resume, id: newId },
              resumes: [...state.resumes, { ...state.resume, id: newId }]
            }));
            return newId;
          } else {
            // Update existing resume
            await updateFirestoreResume(resume.id, resume);
            set((state) => ({
              resumes: state.resumes.map(r => r.id === resume.id ? resume : r)
            }));
            return resume.id;
          }
        } catch (error) {
          console.error('Error saving resume:', error);
          return null;
        }
      },

      // AI Integration
      updateResumeFromAI: (parsedData: any, enhancedData: any) => {
        set((state) => ({
          resume: {
            ...state.resume,
            header: parsedData.header || state.resume.header,
            education: parsedData.education || state.resume.education,
            experience: parsedData.experience || state.resume.experience,
            leadership: parsedData.leadership || state.resume.leadership,
            projects: parsedData.projects || state.resume.projects,
            skills: parsedData.skills || state.resume.skills,
            activities: parsedData.activities || state.resume.activities,
            interests: parsedData.interests || state.resume.interests,
            certifications: parsedData.certifications || state.resume.certifications,
            deals: parsedData.deals || state.resume.deals,
            meta: {
              ...state.resume.meta,
              updatedAt: new Date(),
            }
          }
        }));
      },

      loadResume: async (resumeId: string) => {
        try {
          const resume = await getFirestoreResume(resumeId);
          if (resume) {
            set({ resume });
          }
        } catch (error) {
          console.error('Error loading resume:', error);
        }
      },

      loadUserResumes: async () => {
        try {
          const { currentUser } = useFirebase();
          if (currentUser) {
            const resumes = await getUserResumes(currentUser.uid);
            set({ resumes });
          }
        } catch (error) {
          console.error('Error loading user resumes:', error);
        }
      },

      deleteResume: async (resumeId: string) => {
        try {
          await deleteFirestoreResume(resumeId);
          set((state) => ({
            resumes: state.resumes.filter(r => r.id !== resumeId),
            resume: resumeId === state.resume.id ? sampleResume : state.resume
          }));
        } catch (error) {
          console.error('Error deleting resume:', error);
        }
      },

      duplicateResume: async (resumeId: string) => {
        try {
          const { currentUser } = useFirebase();
          if (!currentUser) {
            throw new Error('User not authenticated');
          }

          const newId = await duplicateResume(resumeId, currentUser.uid);
          if (newId) {
            await get().loadUserResumes();
            return newId;
          }
          return null;
        } catch (error) {
          console.error('Error duplicating resume:', error);
          return null;
        }
      },

      // Reset actions
      resetResume: () => set({ resume: sampleResume }),
      loadSampleResume: () => set({ resume: sampleResume }),
    }),
    {
      name: 'resume-storage',
      partialize: (state) => ({
        resume: state.resume,
        aiEnhancementOptions: state.aiEnhancementOptions,
      }),
    }
  )
);
