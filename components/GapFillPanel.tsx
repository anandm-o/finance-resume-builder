'use client';

import { useState } from 'react';
import { X, Plus, CheckCircle, AlertCircle, Target, Briefcase, Trophy, Code } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';

interface GapFillPanelProps {
  onClose: () => void;
}

interface GapFillSuggestion {
  id: string;
  type: 'transaction' | 'project' | 'leadership' | 'skill';
  title: string;
  description: string;
  suggested: boolean;
  userConfirmed: boolean;
  category: string;
  examples: string[];
}

export default function GapFillPanel({ onClose }: GapFillPanelProps) {
  const { resume } = useResumeStore();
  const [suggestions, setSuggestions] = useState<GapFillSuggestion[]>([
    {
      id: '1',
      type: 'transaction',
      title: 'M&A Transaction Experience',
      description: 'Add experience with mergers, acquisitions, or divestitures',
      suggested: true,
      userConfirmed: false,
      category: 'Deals',
      examples: [
        'Built DCF model for $500M acquisition',
        'Prepared buyer list for divestiture',
        'Assisted due diligence process'
      ]
    },
    {
      id: '2',
      type: 'project',
      title: 'Financial Modeling Projects',
      description: 'Include 3-statement models, LBO analysis, or valuation models',
      suggested: true,
      userConfirmed: false,
      category: 'Projects',
      examples: [
        '3-statement financial model',
        'LBO sensitivity analysis',
        'Comparable company analysis'
      ]
    },
    {
      id: '3',
      type: 'leadership',
      title: 'Finance Club Leadership',
      description: 'Add leadership roles in finance-related organizations',
      suggested: true,
      userConfirmed: false,
      category: 'Leadership',
      examples: [
        'Investment Club President',
        'Case Competition Organizer',
        'Mentorship Program Lead'
      ]
    },
    {
      id: '4',
      type: 'skill',
      title: 'Technical Skills',
      description: 'Include programming, financial tools, and certifications',
      suggested: true,
      userConfirmed: false,
      category: 'Skills',
      examples: [
        'Python for financial analysis',
        'Bloomberg Terminal',
        'CFA Level I candidate'
      ]
    }
  ]);

  const handleToggleSuggestion = (id: string) => {
    setSuggestions(prev => 
      prev.map(s => s.id === id ? { ...s, userConfirmed: !s.userConfirmed } : s)
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <Briefcase className="h-5 w-5 text-primary-500" />;
      case 'project':
        return <Code className="h-5 w-5 text-success-500" />;
      case 'leadership':
        return <Trophy className="h-5 w-5 text-warning-500" />;
      case 'skill':
        return <Target className="h-5 w-5 text-finance-500" />;
      default:
        return <Target className="h-5 w-5 text-finance-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transaction':
        return 'bg-primary-50 border-primary-200 text-primary-700';
      case 'project':
        return 'bg-success-50 border-success-200 text-success-700';
      case 'leadership':
        return 'bg-warning-50 border-warning-200 text-warning-700';
      case 'skill':
        return 'bg-finance-50 border-finance-200 text-finance-700';
      default:
        return 'bg-finance-50 border-finance-200 text-finance-700';
    }
  };

  const confirmedSuggestions = suggestions.filter(s => s.userConfirmed);
  const pendingSuggestions = suggestions.filter(s => !s.userConfirmed);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-finance-200">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-finance-900">Gap Fill Suggestions</h2>
          </div>
          <button
            onClick={onClose}
            className="text-finance-400 hover:text-finance-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-finance-800 mb-2">
              Enhance Your Resume
            </h3>
            <p className="text-finance-600">
              Based on your target role and current content, we've identified areas where you can 
              add finance-specific elements to make your resume more competitive.
            </p>
          </div>

          {/* Confirmed Suggestions */}
          {confirmedSuggestions.length > 0 && (
            <div className="mb-8">
              <h4 className="font-medium text-finance-800 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success-500" />
                Selected for Addition ({confirmedSuggestions.length})
              </h4>
              
              <div className="space-y-3">
                {confirmedSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-4 border-2 rounded-lg ${getTypeColor(suggestion.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(suggestion.type)}
                        <div className="flex-1">
                          <h5 className="font-medium mb-1">{suggestion.title}</h5>
                          <p className="text-sm mb-3">{suggestion.description}</p>
                          
                          <div className="space-y-2">
                            <h6 className="text-xs font-medium uppercase tracking-wide">Examples:</h6>
                            <div className="flex flex-wrap gap-2">
                              {suggestion.examples.map((example, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-white bg-opacity-70 rounded text-xs"
                                >
                                  {example}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleToggleSuggestion(suggestion.id)}
                        className="text-sm text-finance-600 hover:text-finance-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Suggestions */}
          <div>
            <h4 className="font-medium text-finance-800 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning-500" />
              Available Suggestions ({pendingSuggestions.length})
            </h4>
            
            <div className="space-y-3">
              {pendingSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`p-4 border-2 rounded-lg ${getTypeColor(suggestion.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(suggestion.type)}
                      <div className="flex-1">
                        <h5 className="font-medium mb-1">{suggestion.title}</h5>
                        <p className="text-sm mb-3">{suggestion.description}</p>
                        
                        <div className="space-y-2">
                          <h6 className="text-xs font-medium uppercase tracking-wide">Examples:</h6>
                          <div className="flex flex-wrap gap-2">
                            {suggestion.examples.map((example, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-white bg-opacity-70 rounded text-xs"
                              >
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleToggleSuggestion(suggestion.id)}
                      className="btn-outline px-3 py-1 text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-finance-200 mt-8">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Here you would implement the logic to add the confirmed suggestions
                // to the resume sections
                onClose();
              }}
              className="btn-primary flex-1"
              disabled={confirmedSuggestions.length === 0}
            >
              Add Selected Items ({confirmedSuggestions.length})
            </button>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-finance-50 rounded-lg">
            <h4 className="font-medium text-finance-800 mb-2">💡 Tips for Adding Content</h4>
            <ul className="text-sm text-finance-600 space-y-1">
              <li>• Focus on quantifiable achievements and specific outcomes</li>
              <li>• Use finance-specific action verbs (modeled, valued, analyzed, etc.)</li>
              <li>• Include relevant technical skills and tools</li>
              <li>• Add leadership experience from finance clubs or competitions</li>
              <li>• Consider adding relevant coursework or certifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
