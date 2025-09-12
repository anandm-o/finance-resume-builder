import { pdf } from '@react-pdf/renderer';
import { TemplateFactory } from './templateFactory';
import { ResumeData } from '../types/template';

export class PDFExporter {
  static async exportResume(
    resumeData: ResumeData, 
    template?: any[], 
    globalStyles?: Record<string, any>
  ): Promise<Blob> {
    const templateToUse = template || TemplateFactory.getDefaultTemplate();
    const document = TemplateFactory.createResumeDocument(
      templateToUse,
      resumeData,
      globalStyles || {}
    );
    
    const blob = await pdf(document).toBlob();
    return blob;
  }

  static async downloadResume(
    resumeData: ResumeData,
    filename: string = 'resume.pdf',
    template?: any[],
    globalStyles?: Record<string, any>
  ): Promise<void> {
    try {
      const blob = await this.exportResume(resumeData, template, globalStyles);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw new Error('Failed to download PDF');
    }
  }

  static async getResumeAsDataURL(
    resumeData: ResumeData,
    template?: any[],
    globalStyles?: Record<string, any>
  ): Promise<string> {
    try {
      const blob = await this.exportResume(resumeData, template, globalStyles);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error generating data URL:', error);
      throw new Error('Failed to generate PDF data URL');
    }
  }

  static async printResume(
    resumeData: ResumeData,
    template?: any[],
    globalStyles?: Record<string, any>
  ): Promise<void> {
    try {
      const blob = await this.exportResume(resumeData, template, globalStyles);
      const url = URL.createObjectURL(blob);
      
      // Open in new window for printing
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
      
      // Cleanup after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error('Error printing PDF:', error);
      throw new Error('Failed to print PDF');
    }
  }
}

