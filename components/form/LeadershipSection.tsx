'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import BulletEditor from './BulletEditor';

export default function LeadershipSection() {
  const { resume, updateLeadership, addLeadership, removeLeadership } = useResumeStore();

  const handleChange = (id: string, field: string, value: any) => {
    updateLeadership(id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      {resume.leadership.map((lead, index) => (
        <div key={lead.id} className="p-4 border border-finance-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-finance-800">Leadership #{index + 1}</h4>
            <button
              onClick={() => removeLeadership(lead.id)}
              className="text-error-500 hover:text-error-600 p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Organization *
              </label>
              <input
                type="text"
                value={lead.organization}
                onChange={(e) => handleChange(lead.id, 'organization', e.target.value)}
                placeholder="UBC Finance Club"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={lead.location}
                onChange={(e) => handleChange(lead.id, 'location', e.target.value)}
                placeholder="Vancouver, BC"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Role/Position *
              </label>
              <input
                type="text"
                value={lead.role}
                onChange={(e) => handleChange(lead.id, 'role', e.target.value)}
                placeholder="Vice President, Case Competitions"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Start Date *
              </label>
              <input
                type="text"
                value={lead.startDate}
                onChange={(e) => handleChange(lead.id, 'startDate', e.target.value)}
                placeholder="Sept 2023"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                End Date *
              </label>
              <input
                type="text"
                value={lead.endDate}
                onChange={(e) => handleChange(lead.id, 'endDate', e.target.value)}
                placeholder="Present"
                className="input-field"
              />
            </div>
          </div>

          {/* Bullets */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-finance-700">
                Experience Bullets
              </label>
              <button
                onClick={() => {
                  const newBullet = {
                    id: `bullet-${Date.now()}`,
                    text: '',
                    enhancementLevel: 'Keep as-is' as const,
                  };
                  const updatedBullets = [...lead.bullets, newBullet];
                  updateLeadership(lead.id, { bullets: updatedBullets });
                }}
                className="btn-outline px-3 py-1 text-sm"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Bullet
              </button>
            </div>
            
            {lead.bullets.map((bullet, bulletIndex) => (
              <div key={bullet.id} className="mb-3 p-3 border border-finance-200 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-finance-600">Bullet #{bulletIndex + 1}</span>
                  <button
                    onClick={() => {
                      const updatedBullets = lead.bullets.filter((_, i) => i !== bulletIndex);
                      updateLeadership(lead.id, { bullets: updatedBullets });
                    }}
                    className="text-error-500 hover:text-error-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <BulletEditor
                  bullet={bullet}
                  onChange={(updates) => {
                    const updatedBullets = lead.bullets.map((b, i) => 
                      i === bulletIndex ? { ...b, ...updates } : b
                    );
                    updateLeadership(lead.id, { bullets: updatedBullets });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={addLeadership}
        className="btn-outline w-full flex items-center justify-center py-3"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Leadership Experience
      </button>
    </div>
  );
}
