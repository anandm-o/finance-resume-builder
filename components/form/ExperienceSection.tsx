'use client';

import { useState } from 'react';
import { Plus, Trash2, X, Zap, Star, Shield, Edit3 } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { EnhancementLevel } from '../../types/resume';
import BulletEditor from './BulletEditor';

export default function ExperienceSection() {
  const { resume, updateExperience, addExperience, removeExperience, addExperienceBullet, removeExperienceBullet, updateExperienceBullet } = useResumeStore();
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectAction, setNewProjectAction] = useState('');
  const [newProjectResult, setNewProjectResult] = useState('');

  const handleChange = (id: string, field: string, value: any) => {
    const index = resume.experience.findIndex(exp => exp.id === id);
    if (index !== -1) {
      updateExperience({ [field]: value }, index);
    }
  };

  const handleAddProject = (expId: string) => {
    if (newProjectName.trim() && newProjectAction.trim() && newProjectResult.trim()) {
      const exp = resume.experience.find(e => e.id === expId);
      if (exp) {
        const newProject = {
          name: newProjectName.trim(),
          action: newProjectAction.trim(),
          result: newProjectResult.trim()
        };
        const updatedProjects = [...(exp.selectedProjects || []), newProject];
        const expIndex = resume.experience.findIndex(e => e.id === expId);
        if (expIndex !== -1) {
          updateExperience({ selectedProjects: updatedProjects }, expIndex);
        }
        setNewProjectName('');
        setNewProjectAction('');
        setNewProjectResult('');
      }
    }
  };

  const handleRemoveProject = (expId: string, projectIndex: number) => {
    const exp = resume.experience.find(e => e.id === expId);
    if (exp) {
      const updatedProjects = exp.selectedProjects?.filter((_, i) => i !== projectIndex) || [];
      const expIndex = resume.experience.findIndex(e => e.id === expId);
      if (expIndex !== -1) {
        updateExperience({ selectedProjects: updatedProjects }, expIndex);
      }
    }
  };

  const getEnhancementIcon = (level: EnhancementLevel) => {
    switch (level) {
      case 'Enhance':
        return <Zap className="h-4 w-4 text-warning-500" />;
      case 'Conservative':
        return <Shield className="h-4 w-4 text-success-500" />;
      case 'Keep as-is':
        return <Star className="h-4 w-4 text-finance-500" />;
      default:
        return <Star className="h-4 w-4 text-finance-500" />;
    }
  };

  const getEnhancementLabel = (level: EnhancementLevel) => {
    switch (level) {
      case 'Enhance':
        return 'Enhanced';
      case 'Conservative':
        return 'Conservative';
      case 'Keep as-is':
        return 'Original';
      default:
        return 'Original';
    }
  };

  return (
    <div className="space-y-6">
      {resume.experience.map((exp, index) => (
        <div key={exp.id} className="p-4 border border-finance-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-finance-800">Experience #{index + 1}</h4>
            <button
              onClick={() => removeExperience(index)}
              className="text-error-500 hover:text-error-600 p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                placeholder="RBC Capital Markets"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => handleChange(exp.id, 'location', e.target.value)}
                placeholder="Toronto, ON"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => handleChange(exp.id, 'title', e.target.value)}
                placeholder="Investment Banking Summer Analyst"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Group/Department (Optional)
              </label>
              <input
                type="text"
                value={exp.groupName || ''}
                onChange={(e) => handleChange(exp.id, 'groupName', e.target.value)}
                placeholder="Technology & Consumer"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Start Date *
              </label>
              <input
                type="text"
                value={exp.startDate}
                onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                placeholder="May 2024"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                End Date *
              </label>
              <input
                type="text"
                value={exp.endDate}
                onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                placeholder="Aug 2024"
                className="input-field"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-finance-700 mb-2">
              Summary (Optional)
            </label>
            <textarea
              value={exp.summary || ''}
              onChange={(e) => handleChange(exp.id, 'summary', e.target.value)}
              placeholder="Brief summary of your role and key responsibilities..."
              className="input-field"
              rows={3}
            />
          </div>

          {/* Selected Projects */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-finance-700 mb-2">
              Selected {resume.meta.roleTarget.includes('Banking') ? 'Transaction' : 'Project'} Experience
            </label>
            {exp.selectedProjects?.map((project, projectIndex) => (
              <div key={projectIndex} className="flex items-center gap-2 mb-2 p-2 bg-finance-50 rounded">
                <div className="flex-1 text-sm">
                  <span className="font-medium">{project.name}</span>: {project.action} → {project.result}
                </div>
                <button
                  onClick={() => handleRemoveProject(exp.id, projectIndex)}
                  className="text-finance-500 hover:text-finance-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name"
                className="input-field text-sm"
              />
              <input
                type="text"
                value={newProjectAction}
                onChange={(e) => setNewProjectAction(e.target.value)}
                placeholder="Action"
                className="input-field text-sm"
              />
              <input
                type="text"
                value={newProjectResult}
                onChange={(e) => setNewProjectResult(e.target.value)}
                placeholder="Result"
                className="input-field text-sm"
              />
            </div>
            <button
              onClick={() => handleAddProject(exp.id)}
              className="btn-outline mt-2 px-4 py-2 text-sm"
            >
              Add Project
            </button>
          </div>

          {/* Bullets */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-finance-700">
                Experience Bullets
              </label>
              <button
                onClick={() => addExperienceBullet(index)}
                className="btn-outline px-3 py-1 text-sm"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Bullet
              </button>
            </div>
            
            {exp.bullets.map((bullet, bulletIndex) => (
              <div key={bullet.id} className="mb-3 p-3 border border-finance-200 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getEnhancementIcon(bullet.enhancementLevel)}
                    <span className="text-xs text-finance-600">
                      {getEnhancementLabel(bullet.enhancementLevel)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeExperienceBullet(index, bulletIndex)}
                    className="text-error-500 hover:text-error-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <BulletEditor
                  bullet={bullet}
                  onChange={(updates) => updateExperienceBullet(index, bulletIndex, updates)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="btn-outline w-full flex items-center justify-center py-3"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </button>
    </div>
  );
}
