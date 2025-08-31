'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import BulletEditor from './BulletEditor';

export default function ProjectsSection() {
  const { resume, updateProject, addProject, removeProject } = useResumeStore();

  const handleChange = (id: string, field: string, value: any) => {
    updateProject(id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      {resume.projects.map((project, index) => (
        <div key={project.id} className="p-4 border border-finance-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-finance-800">Project #{index + 1}</h4>
            <button
              onClick={() => removeProject(project.id)}
              className="text-error-500 hover:text-error-600 p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => handleChange(project.id, 'name', e.target.value)}
                placeholder="3-Statement Financial Model"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Start Date *
              </label>
              <input
                type="text"
                value={project.startDate}
                onChange={(e) => handleChange(project.id, 'startDate', e.target.value)}
                placeholder="Jan 2024"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                End Date *
              </label>
              <input
                type="text"
                value={project.endDate}
                onChange={(e) => handleChange(project.id, 'endDate', e.target.value)}
                placeholder="Mar 2024"
                className="input-field"
              />
            </div>
          </div>

          {/* Bullets */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-finance-700">
                Project Details
              </label>
              <button
                onClick={() => {
                  const newBullet = {
                    id: `bullet-${Date.now()}`,
                    text: '',
                    enhancementLevel: 'Keep as-is' as const,
                  };
                  const updatedBullets = [...project.bullets, newBullet];
                  updateProject(project.id, { bullets: updatedBullets });
                }}
                className="btn-outline px-3 py-1 text-sm"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Detail
              </button>
            </div>
            
            {project.bullets.map((bullet, bulletIndex) => (
              <div key={bullet.id} className="mb-3 p-3 border border-finance-200 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-finance-600">Detail #{bulletIndex + 1}</span>
                  <button
                    onClick={() => {
                      const updatedBullets = project.bullets.filter((_, i) => i !== bulletIndex);
                      updateProject(project.id, { bullets: updatedBullets });
                    }}
                    className="text-error-500 hover:text-error-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <BulletEditor
                  bullet={bullet}
                  onChange={(updates) => {
                    const updatedBullets = project.bullets.map((b, i) => 
                      i === bulletIndex ? { ...b, ...updates } : b
                    );
                    updateProject(project.id, { bullets: updatedBullets });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={addProject}
        className="btn-outline w-full flex items-center justify-center py-3"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Project
      </button>
    </div>
  );
}
