'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Edit3, Star, Zap, Shield } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { EnhancementLevel } from '../types/resume';
import HeaderSection from './form/HeaderSection';
import EducationSection from './form/EducationSection';
import ExperienceSection from './form/ExperienceSection';
import LeadershipSection from './form/LeadershipSection';
import ProjectsSection from './form/ProjectsSection';
import SkillsSection from './form/SkillsSection';
import CertificationsSection from './form/CertificationsSection';

export default function ResumeForm() {
  const { 
    resume, 
    selectedSection, 
    setSelectedSection,
    aiEnhancementOptions,
    setAIEnhancementOptions 
  } = useResumeStore();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'education', 'experience'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const sections = [
    { id: 'header', title: 'Header & Contact', icon: '👤' },
    { id: 'education', title: 'Education', icon: '🎓' },
    { id: 'experience', title: 'Employment Experience', icon: '💼' },
    { id: 'leadership', title: 'Extra-Curricular Experience', icon: '🌟' },
    { id: 'projects', title: 'Projects', icon: '📊' },
    { id: 'skills', title: 'Skills & Activities', icon: '🛠️' },
    { id: 'certifications', title: 'Certifications', icon: '🏆' },
  ];

  return (
    <div className="space-y-6">
      {/* AI Enhancement Options */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-header flex items-center">
            <Zap className="h-5 w-5 text-primary-500 mr-2" />
            AI Enhancement Settings
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-finance-700 mb-2">
              Target Role
            </label>
            <select
              value={aiEnhancementOptions.roleTarget}
              onChange={(e) => setAIEnhancementOptions({ 
                roleTarget: e.target.value as any 
              })}
              className="input-field"
            >
              <option value="Investment Banking Analyst">Investment Banking Analyst</option>
              <option value="Asset Management / Equity Research">Asset Management / Equity Research</option>
              <option value="Corporate Finance / FP&A">Corporate Finance / FP&A</option>
              <option value="Private Equity">Private Equity</option>
              <option value="General Finance">General Finance</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-finance-700 mb-2">
              Enhancement Level
            </label>
            <select
              value={aiEnhancementOptions.enhancementLevel}
              onChange={(e) => setAIEnhancementOptions({ 
                enhancementLevel: e.target.value as EnhancementLevel 
              })}
              className="input-field"
            >
              <option value="Conservative">Conservative</option>
              <option value="Standard">Standard</option>
              <option value="Enhance">Enhance</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={aiEnhancementOptions.includeQuantification}
              onChange={(e) => setAIEnhancementOptions({ 
                includeQuantification: e.target.checked 
              })}
              className="mr-2"
            />
            <span className="text-sm text-finance-700">Include quantification</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={aiEnhancementOptions.includeKeywords}
              onChange={(e) => setAIEnhancementOptions({ 
                includeKeywords: e.target.checked 
              })}
              className="mr-2"
            />
            <span className="text-sm text-finance-700">Include keywords</span>
          </label>
        </div>
      </div>

      {/* Form Sections */}
      {sections.map((section) => (
        <div key={section.id} className="card">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-finance-50 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{section.icon}</span>
              <h3 className="text-lg font-semibold text-finance-800">
                {section.title}
              </h3>
            </div>
            {expandedSections.has(section.id) ? (
              <ChevronDown className="h-5 w-5 text-finance-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-finance-500" />
            )}
          </button>
          
          {expandedSections.has(section.id) && (
            <div className="px-6 pb-6 border-t border-finance-100">
              {section.id === 'header' && <HeaderSection />}
              {section.id === 'education' && <EducationSection />}
              {section.id === 'experience' && <ExperienceSection />}
              {section.id === 'leadership' && <LeadershipSection />}
              {section.id === 'projects' && <ProjectsSection />}
              {section.id === 'skills' && <SkillsSection />}
              {section.id === 'certifications' && <CertificationsSection />}
            </div>
          )}
        </div>
      ))}

      {/* Template Lock Notice */}
      <div className="card p-6 bg-primary-50 border-primary-200">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-primary-800 mb-2">
              Template Locked
            </h4>
            <p className="text-sm text-primary-700">
              This resume uses a locked finance template that ensures ATS compatibility. 
              The structure, fonts, and formatting are standardized for maximum impact 
              in finance recruiting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
