'use client';

import React, { useState, useCallback } from 'react';
import { ResumeData, FormSection, FormField, ResumeTemplate } from '../types/template';
import { TemplateFactory } from '../lib/templateFactory';
import { TemplateManager } from '../lib/templateManager';
import { PDFViewer } from '@react-pdf/renderer';

const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
};

const formSections: FormSection[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    fields: [
      { id: 'name', label: 'Full Name', type: 'text', value: '', required: true },
      { id: 'email', label: 'Email', type: 'text', value: '', required: true },
      { id: 'phone', label: 'Phone', type: 'text', value: '', required: true },
      { id: 'location', label: 'Location', type: 'text', value: '', required: true },
      { id: 'linkedin', label: 'LinkedIn URL', type: 'text', value: '' },
      { id: 'website', label: 'Website URL', type: 'text', value: '' },
    ],
  },
  {
    id: 'summary',
    title: 'Professional Summary',
    fields: [
      { id: 'summary', label: 'Summary', type: 'textarea', value: '', required: true },
    ],
  },
  {
    id: 'experience',
    title: 'Work Experience',
    fields: [],
    collapsible: true,
    collapsed: false,
  },
  {
    id: 'education',
    title: 'Education',
    fields: [],
    collapsible: true,
    collapsed: false,
  },
  {
    id: 'skills',
    title: 'Skills',
    fields: [],
    collapsible: true,
    collapsed: false,
  },
];

interface ResumeFormCreatorProps {
  onExport?: (data: ResumeData) => void;
}

export default function ResumeFormCreator({ onExport }: ResumeFormCreatorProps) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(TemplateManager.getDefaultTemplate());

  const updateField = useCallback((sectionId: string, fieldId: string, value: any) => {
    setResumeData(prev => {
      const newData = { ...prev };
      
      if (sectionId === 'personal') {
        newData.personalInfo = { ...newData.personalInfo, [fieldId]: value };
      } else if (sectionId === 'summary') {
        newData.summary = value;
      } else if (sectionId === 'experience') {
        // Handle experience updates
        const fieldParts = fieldId.split('_');
        const expIndex = parseInt(fieldParts[0]);
        const fieldName = fieldParts[1];
        
        if (expIndex >= 0 && expIndex < newData.experience.length) {
          newData.experience[expIndex] = { ...newData.experience[expIndex], [fieldName]: value };
        }
      } else if (sectionId === 'education') {
        const fieldParts = fieldId.split('_');
        const eduIndex = parseInt(fieldParts[0]);
        const fieldName = fieldParts[1];
        
        if (eduIndex >= 0 && eduIndex < newData.education.length) {
          newData.education[eduIndex] = { ...newData.education[eduIndex], [fieldName]: value };
        }
      } else if (sectionId === 'skills') {
        const fieldParts = fieldId.split('_');
        const skillIndex = parseInt(fieldParts[0]);
        const fieldName = fieldParts[1];
        
        if (skillIndex >= 0 && skillIndex < newData.skills.length) {
          newData.skills[skillIndex] = { ...newData.skills[skillIndex], [fieldName]: value };
        }
      }
      
      return newData;
    });
  }, []);

  const addExperience = useCallback(() => {
    const newExperience = {
      id: `exp_${Date.now()}`,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  }, []);

  const removeExperience = useCallback((index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  }, []);

  const addEducation = useCallback(() => {
    const newEducation = {
      id: `edu_${Date.now()}`,
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: '',
      honors: '',
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  }, []);

  const removeEducation = useCallback((index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }, []);

  const addSkillCategory = useCallback(() => {
    const newSkillCategory = {
      id: `skill_${Date.now()}`,
      category: '',
      items: [],
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkillCategory],
    }));
  }, []);

  const removeSkillCategory = useCallback((index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  }, []);

  const updateSkillItems = useCallback((index: number, items: string[]) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, items } : skill
      ),
    }));
  }, []);

  const renderField = (sectionId: string, field: FormField) => {
    const value = sectionId === 'personal' 
      ? resumeData.personalInfo[field.id as keyof typeof resumeData.personalInfo]
      : sectionId === 'summary'
      ? resumeData.summary
      : field.value;

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => updateField(sectionId, field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => updateField(sectionId, field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => updateField(sectionId, field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => updateField(sectionId, field.id, e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => updateField(sectionId, field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => updateField(sectionId, field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );
      default:
        return null;
    }
  };

  const renderExperienceSection = () => (
    <div className="space-y-4">
      {resumeData.experience.map((exp, index) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Experience {index + 1}</h4>
            <button
              onClick={() => removeExperience(index)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateField('experience', `${index}_title`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateField('experience', `${index}_company`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateField('experience', `${index}_location`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) => updateField('experience', `${index}_startDate`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={exp.endDate}
                onChange={(e) => updateField('experience', `${index}_endDate`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={exp.current}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateField('experience', `${index}_current`, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Currently working here</label>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={exp.description}
              onChange={(e) => updateField('experience', `${index}_description`, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addExperience}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + Add Experience
      </button>
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-4">
      {resumeData.education.map((edu, index) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Education {index + 1}</h4>
            <button
              onClick={() => removeEducation(index)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree *
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateField('education', `${index}_degree`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution *
              </label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateField('education', `${index}_institution`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={edu.location}
                onChange={(e) => updateField('education', `${index}_location`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Graduation Date
              </label>
              <input
                type="date"
                value={edu.graduationDate}
                onChange={(e) => updateField('education', `${index}_graduationDate`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPA
              </label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => updateField('education', `${index}_gpa`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Honors
              </label>
              <input
                type="text"
                value={edu.honors}
                onChange={(e) => updateField('education', `${index}_honors`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addEducation}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + Add Education
      </button>
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-4">
      {resumeData.skills.map((skill, index) => (
        <div key={skill.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Skill Category {index + 1}</h4>
            <button
              onClick={() => removeSkillCategory(index)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={skill.category}
                onChange={(e) => updateField('skills', `${index}_category`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={skill.items.join(', ')}
                onChange={(e) => updateSkillItems(index, e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                placeholder="e.g., JavaScript, React, Node.js"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addSkillCategory}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + Add Skill Category
      </button>
    </div>
  );

  const renderSection = (section: FormSection) => {
    if (section.id === 'experience') {
      return renderExperienceSection();
    }
    if (section.id === 'education') {
      return renderEducationSection();
    }
    if (section.id === 'skills') {
      return renderSkillsSection();
    }

    return (
      <div className="space-y-4">
        {section.fields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(section.id, field)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex">
        {/* Form Sidebar */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Resume Builder</h2>
            <p className="text-sm text-gray-600">Fill out your information to generate a professional resume</p>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Template
              </label>
              <select
                value={selectedTemplate.id}
                onChange={(e) => {
                  const template = TemplateManager.getTemplate(e.target.value);
                  if (template) setSelectedTemplate(template);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TemplateManager.getTemplates().map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              {formSections.map((section) => (
                <div key={section.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h3>
                    {section.collapsible && (
                      <button
                        onClick={() => setActiveSection(activeSection === section.id ? '' : section.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {activeSection === section.id ? 'Collapse' : 'Expand'}
                      </button>
                    )}
                  </div>
                  
                  {(activeSection === section.id || !section.collapsible) && (
                    <div className="space-y-4">
                      {renderSection(section)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PDF Preview Side */}
        <div className="flex-1 bg-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              <button
                onClick={() => onExport?.(resumeData)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Export PDF
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <PDFViewer width="100%" height="100%">
              {TemplateFactory.createResumeDocument(
                selectedTemplate.components,
                resumeData,
                selectedTemplate.globalStyles
              )}
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  );
}
