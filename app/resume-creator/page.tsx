'use client';

import React from 'react';
import ResumeFormCreator from '../../components/ResumeFormCreator';
import { ResumeData } from '../../types/template';
import { PDFExporter } from '../../lib/pdfExporter';

export default function ResumeCreatorPage() {
  const handleExport = async (resumeData: ResumeData) => {
    try {
      const filename = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
      await PDFExporter.downloadResume(resumeData, filename);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ResumeFormCreator onExport={handleExport} />
    </div>
  );
}

