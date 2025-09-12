export interface TemplateComponent {
  id: string;
  type: 'text' | 'section' | 'experience' | 'education' | 'skills' | 'header' | 'spacer';
  props: Record<string, any>;
  children?: TemplateComponent[];
  styles?: Record<string, any>;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  components: TemplateComponent[];
  globalStyles: Record<string, any>;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number';
  value: any;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
  collapsible?: boolean;
  collapsed?: boolean;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
    honors?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    startDate: string;
    endDate: string;
  }>;
}

