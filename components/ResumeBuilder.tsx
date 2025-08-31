'use client';

import { useState } from 'react';
import { ArrowLeft, Download, Settings, Eye, EyeOff } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import ExportDialog from './ExportDialog';
import SettingsPanel from './SettingsPanel';
import GapFillPanel from './GapFillPanel';
import KeywordOptimizer from './KeywordOptimizer';

export default function ResumeBuilder() {
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGapFill, setShowGapFill] = useState(false);
  const [showKeywordOptimizer, setShowKeywordOptimizer] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  
  const { selectedSection, setSelectedSection } = useResumeStore();

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-finance-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-finance-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="btn-outline flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>
              
              <div className="h-6 w-px bg-finance-200" />
              
              <h1 className="text-xl font-semibold text-finance-900">
                Finance Resume Builder
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowKeywordOptimizer(!showKeywordOptimizer)}
                className="btn-outline"
              >
                Keyword Optimizer
              </button>
              
              <button
                onClick={() => setShowGapFill(!showGapFill)}
                className="btn-outline"
              >
                Gap Fill
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn-outline"
              >
                <Settings className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn-outline"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              
              <button
                onClick={() => setShowExport(true)}
                className="btn-primary flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Left Pane - Form */}
          <div className="flex-1">
            <ResumeForm />
          </div>

          {/* Right Pane - Preview */}
          {showPreview && (
            <div className="w-[8.5in] flex-shrink-0">
              <div className="sticky top-6">
                <ResumePreview />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Panels */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
      
      {showGapFill && (
        <GapFillPanel onClose={() => setShowGapFill(false)} />
      )}
      
      {showKeywordOptimizer && (
        <KeywordOptimizer onClose={() => setShowKeywordOptimizer(false)} />
      )}

      {/* Export Dialog */}
      {showExport && (
        <ExportDialog onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}
