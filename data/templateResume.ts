import { Resume } from '../types/resume';

export const templateResume: Resume = {
  id: 'template-1',
  meta: {
    templateId: 'finance-docx-locked',
    roleTarget: 'Investment Banking Analyst',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  header: {
    name: '[Name]',
    email: '[Email Address]',
    phone: '[Phone Number]',
    location: '',
    linkedin: '[LinkedIn Link]',
  },
  education: [
    {
      school: '[University Name]',
      degree: 'Bachelor of [Arts/Science] in [Major]',
      major: '[Major]',
      graduationYear: 'Class of [Graduation Year]',
      gpa: '[xx] / 4.0; SAT: [xx] [If you\'re outside the US, list grades under your system here instead]',
      location: '[City], [Province/State/Country]',
      awards: ['[xx]'],
      coursework: ['Economics / Accounting / Finance classes, anything business-related'],
      competitions: ['Economics / Accounting / Finance classes, anything business-related'],
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: '[Company Name]',
      title: '[Position Title]',
      location: '[City], [Province/State/Country]',
      startDate: '[Start Date]',
      endDate: '[End Date]',
      groupName: '',
      summary: '',
      bullets: [
        {
          id: 'bullet-1',
          text: '[Summary sentence stating what you did and the overall results of your work]',
          enhancementLevel: 'Keep as-is',
          originalText: '[Summary sentence stating what you did and the overall results of your work]',
        },
        {
          id: 'bullet-2',
          text: 'Selected [Client / Project / Transaction] Experience:',
          enhancementLevel: 'Keep as-is',
          originalText: 'Selected [Client / Project / Transaction] Experience:',
        },
      ],
      selectedProjects: [
        {
          name: '[Project #1]',
          action: '[Led team to do xx, which resulted in more efficiency / time or money saved / higher sales]',
          result: '',
        },
        {
          name: '[Project #2]',
          action: '[Analyzed xx and concluded that key factor was xx, which made project viable / not viable; resulted in company proceeding with project]',
          result: '',
        },
        {
          name: '[Project #3]',
          action: '[Created xx new method for doing xx; led to increased efficiency / sales]',
          result: '',
        },
      ],
    },
    {
      id: 'exp-2',
      company: '[Company Name]',
      title: '[Position Title]',
      location: '[City], [Province/State/Country]',
      startDate: '[Start Date]',
      endDate: '[End Date]',
      groupName: '',
      summary: '',
      bullets: [
        {
          id: 'bullet-3',
          text: '[Summary sentence stating what you did and the overall results of your work]',
          enhancementLevel: 'Keep as-is',
          originalText: '[Summary sentence stating what you did and the overall results of your work]',
        },
        {
          id: 'bullet-4',
          text: '[Led team\'s efforts to do xx by creating/managing xx; resulted in increased sales / profits / cost savings]',
          enhancementLevel: 'Keep as-is',
          originalText: '[Led team\'s efforts to do xx by creating/managing xx; resulted in increased sales / profits / cost savings]',
        },
        {
          id: 'bullet-5',
          text: '[Analyzed options available for xx and recommended xx based on time and resource considerations; implementation led to successful marketing of xx]',
          enhancementLevel: 'Keep as-is',
          originalText: '[Analyzed options available for xx and recommended xx based on time and resource considerations; implementation led to successful marketing of xx]',
        },
        {
          id: 'bullet-6',
          text: '[Developed strategy for marketing to new prospective clients / fund-raising / promoting brand; resulted in increased awareness / capital commitments]',
          enhancementLevel: 'Keep as-is',
          originalText: '[Developed strategy for marketing to new prospective clients / fund-raising / promoting brand; resulted in increased awareness / capital commitments]',
        },
      ],
    },
  ],
  extraCurricular: [
    {
      id: 'extra-1',
      organization: '[Student Club Name]',
      role: '[Position Title]',
      location: '[City], [Province/State/Country]',
      startDate: '[Start Date]',
      endDate: '[End Date]',
      bullets: [
        '[Summary sentence stating what you did and the overall results of your work]',
        '[Recruited over xx members to club with promotional campaign]',
        '[Organized conferences, speaker events and community events]',
      ],
    },
  ],
  skills: {
    technical: ['[Languages – Fluent/Conversational Proficiency]'],
    financeTools: ['[Programming languages]'],
    languages: ['[Certifications]'],
    programming: [],
  },
  activities: ['Student Clubs, Volunteer Work, Independent Activities'],
  interests: ['Keep this to 1-2 lines and be specific, hobbies and interests; do not go overboard'],
  leadership: [],
  projects: [],
};
