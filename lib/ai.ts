import { ParsedResume } from '../types/resume';

export class ResumeAI {
  static async parseResume(resumeText: string, targetRole: string = 'Finance Analyst'): Promise<ParsedResume> {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'parseResume',
          data: resumeText,
          targetRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request with AI');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error parsing resume with AI:', error);
      throw new Error('Failed to parse resume. Please try again or enter information manually.');
    }
  }

  static async enhanceResume(resume: ParsedResume, targetRole: string = 'Finance Analyst'): Promise<any> {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'enhanceResume',
          data: resume,
          targetRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request with AI');
      }

      return await response.json();
    } catch (error) {
      console.error('Error enhancing resume with AI:', error);
      throw new Error('Failed to enhance resume. Please try again.');
    }
  }

  static async generateBulletPoints(notes: string, context: string, targetRole: string = 'Finance Analyst'): Promise<string[]> {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateBulletPoints',
          data: { notes, context },
          targetRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request with AI');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating bullet points with AI:', error);
      throw new Error('Failed to generate bullet points. Please try again.');
    }
  }

  static async analyzeATS(resume: ParsedResume, targetRole: string = 'Finance Analyst'): Promise<any> {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyzeATS',
          data: resume,
          targetRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request with AI');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing ATS with AI:', error);
      throw new Error('Failed to analyze ATS. Please try again.');
    }
  }
}