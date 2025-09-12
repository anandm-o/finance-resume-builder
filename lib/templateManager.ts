import { TemplateComponent, ResumeTemplate } from '../types/template';

export class TemplateManager {
  private static templates: ResumeTemplate[] = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean, modern design with blue accents',
      globalStyles: {
        page: {
          padding: 40,
        },
        header: {
          borderBottomColor: '#2563eb',
          borderBottomWidth: 3,
        },
        sectionTitle: {
          color: '#1e40af',
          borderBottomColor: '#e5e7eb',
          borderBottomWidth: 1,
          paddingBottom: 4,
        },
      },
      components: [
        {
          id: 'header',
          type: 'header',
          props: {},
        },
        {
          id: 'summary',
          type: 'section',
          props: {
            title: 'Professional Summary',
            dataKey: 'summary',
          },
          children: [
            {
              id: 'summary-text',
              type: 'text',
              props: {
                content: '{{summary}}',
                styleKey: 'description',
              },
            },
          ],
        },
        {
          id: 'experience',
          type: 'section',
          props: {
            title: 'Professional Experience',
            dataKey: 'experience',
          },
          children: [
            {
              id: 'experience-list',
              type: 'experience',
              props: {},
            },
          ],
        },
        {
          id: 'education',
          type: 'section',
          props: {
            title: 'Education',
            dataKey: 'education',
          },
          children: [
            {
              id: 'education-list',
              type: 'education',
              props: {},
            },
          ],
        },
        {
          id: 'skills',
          type: 'section',
          props: {
            title: 'Technical Skills',
            dataKey: 'skills',
          },
          children: [
            {
              id: 'skills-list',
              type: 'skills',
              props: {},
            },
          ],
        },
      ],
    },
    {
      id: 'classic',
      name: 'Classic Traditional',
      description: 'Traditional format with conservative styling',
      globalStyles: {
        page: {
          padding: 30,
        },
        header: {
          borderBottomColor: '#000000',
          borderBottomWidth: 2,
        },
        sectionTitle: {
          color: '#000000',
          fontSize: 12,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        name: {
          fontSize: 20,
          color: '#000000',
        },
      },
      components: [
        {
          id: 'header',
          type: 'header',
          props: {},
        },
        {
          id: 'summary',
          type: 'section',
          props: {
            title: 'Summary',
            dataKey: 'summary',
          },
          children: [
            {
              id: 'summary-text',
              type: 'text',
              props: {
                content: '{{summary}}',
                styleKey: 'description',
              },
            },
          ],
        },
        {
          id: 'experience',
          type: 'section',
          props: {
            title: 'Work Experience',
            dataKey: 'experience',
          },
          children: [
            {
              id: 'experience-list',
              type: 'experience',
              props: {},
            },
          ],
        },
        {
          id: 'education',
          type: 'section',
          props: {
            title: 'Education',
            dataKey: 'education',
          },
          children: [
            {
              id: 'education-list',
              type: 'education',
              props: {},
            },
          ],
        },
        {
          id: 'skills',
          type: 'section',
          props: {
            title: 'Skills',
            dataKey: 'skills',
          },
          children: [
            {
              id: 'skills-list',
              type: 'skills',
              props: {},
            },
          ],
        },
      ],
    },
    {
      id: 'creative',
      name: 'Creative Modern',
      description: 'Bold, creative design with modern typography',
      globalStyles: {
        page: {
          padding: 35,
          backgroundColor: '#f8fafc',
        },
        header: {
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: 20,
          marginBottom: 20,
          borderRadius: 8,
        },
        name: {
          color: '#ffffff',
          fontSize: 28,
          fontWeight: 'bold',
        },
        contact: {
          color: '#cbd5e1',
        },
        sectionTitle: {
          color: '#1e293b',
          backgroundColor: '#e2e8f0',
          padding: 8,
          borderRadius: 4,
          marginBottom: 12,
        },
        experienceItem: {
          backgroundColor: '#ffffff',
          padding: 15,
          borderRadius: 6,
          marginBottom: 15,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
      components: [
        {
          id: 'header',
          type: 'header',
          props: {},
        },
        {
          id: 'summary',
          type: 'section',
          props: {
            title: 'About Me',
            dataKey: 'summary',
          },
          children: [
            {
              id: 'summary-text',
              type: 'text',
              props: {
                content: '{{summary}}',
                styleKey: 'description',
              },
            },
          ],
        },
        {
          id: 'experience',
          type: 'section',
          props: {
            title: 'Professional Journey',
            dataKey: 'experience',
          },
          children: [
            {
              id: 'experience-list',
              type: 'experience',
              props: {},
            },
          ],
        },
        {
          id: 'education',
          type: 'section',
          props: {
            title: 'Academic Background',
            dataKey: 'education',
          },
          children: [
            {
              id: 'education-list',
              type: 'education',
              props: {},
            },
          ],
        },
        {
          id: 'skills',
          type: 'section',
          props: {
            title: 'Core Competencies',
            dataKey: 'skills',
          },
          children: [
            {
              id: 'skills-list',
              type: 'skills',
              props: {},
            },
          ],
        },
      ],
    },
  ];

  static getTemplates(): ResumeTemplate[] {
    return this.templates;
  }

  static getTemplate(id: string): ResumeTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  static addTemplate(template: ResumeTemplate): void {
    this.templates.push(template);
  }

  static updateTemplate(id: string, updatedTemplate: ResumeTemplate): void {
    const index = this.templates.findIndex(template => template.id === id);
    if (index !== -1) {
      this.templates[index] = updatedTemplate;
    }
  }

  static deleteTemplate(id: string): void {
    this.templates = this.templates.filter(template => template.id !== id);
  }

  static getDefaultTemplate(): ResumeTemplate {
    return this.templates[0]; // Return the first template as default
  }
}

