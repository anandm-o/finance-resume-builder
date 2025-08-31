export type RoleTarget = 
  | 'Investment Banking Analyst'
  | 'Asset Management / Equity Research'
  | 'Corporate Finance / FP&A'
  | 'Private Equity'
  | 'General Finance';

export type EnhancementLevel = 'Enhance' | 'Conservative' | 'Keep as-is';

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  graduationYear: string;
  gpa?: string;
  location: string;
  awards?: string[];
  coursework?: string[];
  competitions?: string[];
}

export interface ExperienceBullet {
  id: string;
  text: string;
  enhancementLevel: EnhancementLevel;
  originalText?: string;
  aiSuggestions?: {
    aggressive: string;
    standard: string;
    conservative: string;
  };
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  groupName?: string;
  summary?: string;
  bullets: ExperienceBullet[];
  selectedProjects?: {
    name: string;
    action: string;
    result: string;
  }[];
}

export interface Leadership {
  id: string;
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: ExperienceBullet[];
}

export interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  bullets: ExperienceBullet[];
}

export interface Skills {
  technical: string[];
  financeTools: string[];
  languages: string[];
  programming?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Deal {
  type: string;
  size: string;
  role: string;
  tasks: string[];
  outcome: string;
}

export interface Resume {
  id: string;
  meta: {
    templateId: 'finance-docx-locked';
    roleTarget: RoleTarget;
    createdAt: Date;
    updatedAt: Date;
  };
  header: ContactInfo;
  education: Education[];
  experience: Experience[];
  leadership: Leadership[];
  projects: Project[];
  skills: Skills;
  certifications: Certification[];
  deals: Deal[];
  activities: string[];
  interests: string[];
}

export interface AIEnhancementOptions {
  roleTarget: RoleTarget;
  enhancementLevel: EnhancementLevel;
  includeQuantification: boolean;
  includeKeywords: boolean;
  preserveOriginalFacts: boolean;
}

export interface KeywordMatch {
  keyword: string;
  matchScore: number;
  category: 'technical' | 'finance' | 'leadership' | 'quantification';
}

export interface GapFillSuggestion {
  type: 'transaction' | 'project' | 'leadership' | 'skill';
  title: string;
  description: string;
  suggested: boolean;
  userConfirmed: boolean;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  sections: string[];
  locked: boolean;
  styles: {
    font: string;
    fontSize: number;
    margins: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    lineSpacing: number;
  };
}

export interface ParsedResume {
  header: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
  };
  education: Education[];
  experience: Experience[];
  leadership: Leadership[];
  projects: Project[];
  skills: Skills;
  activities: string[];
  interests: string[];
  certifications: Certification[];
  deals: Deal[];
}
