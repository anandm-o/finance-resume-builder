'use client';

import { useState } from 'react';
import { X, Zap, Shield, Eye, EyeOff, Settings as SettingsIcon } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { EnhancementLevel } from '../types/resume';

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { aiEnhancementOptions, setAIEnhancementOptions } = useResumeStore();
  const [privacySettings, setPrivacySettings] = useState({
    retainData: false,
    analytics: false,
    aiTraining: false
  });

  const handleEnhancementChange = (field: string, value: any) => {
    setAIEnhancementOptions({ [field]: value });
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-finance-200">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-finance-600" />
            <h2 className="text-xl font-semibold text-finance-900">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-finance-400 hover:text-finance-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* AI Enhancement Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary-500" />
              <h3 className="text-lg font-medium text-finance-800">AI Enhancement Settings</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-finance-700 mb-2">
                  Default Enhancement Level
                </label>
                <select
                  value={aiEnhancementOptions.enhancementLevel}
                  onChange={(e) => handleEnhancementChange('enhancementLevel', e.target.value)}
                  className="input-field"
                >
                  <option value="Conservative">Conservative</option>
                  <option value="Standard">Standard</option>
                  <option value="Enhance">Enhance</option>
                </select>
                <p className="text-xs text-finance-500 mt-1">
                  Sets the default enhancement level for new bullet points
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-finance-700 mb-2">
                  Target Role
                </label>
                <select
                  value={aiEnhancementOptions.roleTarget}
                  onChange={(e) => handleEnhancementChange('roleTarget', e.target.value)}
                  className="input-field"
                >
                  <option value="Investment Banking Analyst">Investment Banking Analyst</option>
                  <option value="Asset Management / Equity Research">Asset Management / Equity Research</option>
                  <option value="Corporate Finance / FP&A">Corporate Finance / FP&A</option>
                  <option value="Private Equity">Private Equity</option>
                  <option value="General Finance">General Finance</option>
                </select>
                <p className="text-xs text-finance-500 mt-1">
                  Influences keyword suggestions and enhancement style
                </p>
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={aiEnhancementOptions.includeQuantification}
                  onChange={(e) => handleEnhancementChange('includeQuantification', e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <span className="text-sm font-medium text-finance-700">Include quantification suggestions</span>
                  <p className="text-xs text-finance-500">AI will suggest metrics and numbers for bullet points</p>
                </div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={aiEnhancementOptions.includeKeywords}
                  onChange={(e) => handleEnhancementChange('includeKeywords', e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <span className="text-sm font-medium text-finance-700">Include keyword suggestions</span>
                  <p className="text-xs text-finance-500">AI will suggest role-specific keywords and phrases</p>
                </div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={aiEnhancementOptions.preserveOriginalFacts}
                  onChange={(e) => handleEnhancementChange('preserveOriginalFacts', e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <span className="text-sm font-medium text-finance-700">Preserve original facts</span>
                  <p className="text-xs text-finance-500">AI will not change company names, dates, or specific details</p>
                </div>
              </label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-success-500" />
              <h3 className="text-lg font-medium text-finance-800">Privacy & Data Settings</h3>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacySettings.retainData}
                  onChange={(e) => handlePrivacyChange('retainData', e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <span className="text-sm font-medium text-finance-700">Retain my data after session</span>
                  <p className="text-xs text-finance-500">Your resume data will be saved for future editing</p>
                </div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacySettings.analytics}
                  onChange={(e) => handlePrivacyChange('analytics', e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <span className="text-sm font-medium text-finance-700">Allow usage analytics</span>
                  <p className="text-xs text-finance-500">Help us improve the tool (no personal data collected)</p>
                </div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacySettings.aiTraining}
                  onChange={(e) => handlePrivacyChange('aiTraining', e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <span className="text-sm font-medium text-finance-700">Allow AI model training</span>
                  <p className="text-xs text-finance-500">Your anonymized data may be used to improve AI models</p>
                </div>
              </label>
            </div>
            
            <div className="mt-4 p-4 bg-finance-50 rounded-lg">
              <h4 className="font-medium text-finance-800 mb-2">Privacy Commitment</h4>
              <p className="text-sm text-finance-600">
                We are committed to protecting your privacy. By default, we do not retain any personal data 
                unless you explicitly opt-in. All data processing happens locally when possible, and any 
                server-side processing is done with strict privacy controls.
              </p>
            </div>
          </div>

          {/* Template Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-warning-500" />
              <h3 className="text-lg font-medium text-finance-800">Template Settings</h3>
            </div>
            
            <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-warning-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-warning-800 mb-2">Template Locked</h4>
                  <p className="text-sm text-warning-700 mb-3">
                    The finance template structure and styling are locked to ensure ATS compatibility 
                    and consistent formatting across all resumes.
                  </p>
                  <p className="text-sm text-warning-700">
                    <strong>Note:</strong> This ensures your resume maintains professional standards 
                    and passes through Applicant Tracking Systems effectively.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-finance-200">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Save settings logic would go here
                onClose();
              }}
              className="btn-primary flex-1"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
