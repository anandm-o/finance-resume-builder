import { ParsedResume } from '../types/resume';

export interface AIEnhancement {
  enhancedBullets: string[];
  suggestedProjects: string[];
  suggestedSkills: string[];
  suggestedDeals: string[];
  gapAnalysis: string[];
}

export class ResumeAI {
  /**
   * Parse uploaded resume and extract structured information
   */
  static async parseResume(resumeText: string, targetRole: string): Promise<ParsedResume> {
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse resume');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error parsing resume with AI:', error);
      throw new Error('Failed to parse resume. Please try again or enter information manually.');
    }
  }

  /**
   * Enhance existing resume content with AI suggestions
   */
  static async enhanceResume(resume: any, targetRole: string): Promise<AIEnhancement> {
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to enhance resume');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error enhancing resume with AI:', error);
      throw new Error('Failed to enhance resume. Please try again.');
    }
  }

  /**
   * Generate specific bullet points from user notes
   */
  static async generateBulletPoints(notes: string, context: string, targetRole: string): Promise<string[]> {
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate bullet points');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error generating bullet points with AI:', error);
      throw new Error('Failed to generate bullet points. Please try again.');
    }
  }

  /**
   * Analyze resume for ATS optimization
   */
  static async analyzeATS(resume: any, targetRole: string): Promise<{
    score: number;
    suggestions: string[];
    missingKeywords: string[];
  }> {
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze ATS optimization');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error analyzing ATS with AI:', error);
      throw new Error('Failed to analyze ATS optimization. Please try again.');
    }
  }
}
