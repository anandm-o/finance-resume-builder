'use client';

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

export default function EducationSection() {
  const { resume, updateEducation, addEducation, removeEducation } = useResumeStore();
  const [newCoursework, setNewCoursework] = useState('');
  const [newAward, setNewAward] = useState('');

  const handleChange = (index: number, field: string, value: any) => {
    updateEducation(index, { [field]: value });
  };

  const handleAddCoursework = (index: number) => {
    if (newCoursework.trim()) {
      const current = resume.education[index].coursework || [];
      handleChange(index, 'coursework', [...current, newCoursework.trim()]);
      setNewCoursework('');
    }
  };

  const handleRemoveCoursework = (index: number, courseworkIndex: number) => {
    const current = resume.education[index].coursework || [];
    handleChange(index, 'coursework', current.filter((_, i) => i !== courseworkIndex));
  };

  const handleAddAward = (index: number) => {
    if (newAward.trim()) {
      const current = resume.education[index].awards || [];
      handleChange(index, 'awards', [...current, newAward.trim()]);
      setNewAward('');
    }
  };

  const handleRemoveAward = (index: number, awardIndex: number) => {
    const current = resume.education[index].awards || [];
    handleChange(index, 'awards', current.filter((_, i) => i !== awardIndex));
  };

  return (
    <div className="space-y-6">
      {resume.education.map((edu, index) => (
        <div key={index} className="p-4 border border-finance-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-finance-800">Education #{index + 1}</h4>
            {resume.education.length > 1 && (
              <button
                onClick={() => removeEducation(index)}
                className="text-error-500 hover:text-error-600 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                School/University *
              </label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => handleChange(index, 'school', e.target.value)}
                placeholder="University of British Columbia"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={edu.location}
                onChange={(e) => handleChange(index, 'location', e.target.value)}
                placeholder="Vancouver, BC"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Degree *
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                placeholder="Bachelor of Commerce"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Major *
              </label>
              <input
                type="text"
                value={edu.major}
                onChange={(e) => handleChange(index, 'major', e.target.value)}
                placeholder="Finance"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Graduation Year *
              </label>
              <input
                type="text"
                value={edu.graduationYear}
                onChange={(e) => handleChange(index, 'graduationYear', e.target.value)}
                placeholder="2026"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={edu.gpa || ''}
                onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                placeholder="3.8/4.0"
                className="input-field"
              />
            </div>
          </div>

          {/* Awards */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-finance-700 mb-2">
              Awards & Honors
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {edu.awards?.map((award, awardIndex) => (
                <span
                  key={awardIndex}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-finance-100 text-finance-700"
                >
                  {award}
                  <button
                    onClick={() => handleRemoveAward(index, awardIndex)}
                    className="ml-2 text-finance-500 hover:text-finance-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAward}
                onChange={(e) => setNewAward(e.target.value)}
                placeholder="Dean's Honour List"
                className="input-field flex-1"
              />
              <button
                onClick={() => handleAddAward(index)}
                className="btn-outline px-4"
              >
                Add
              </button>
            </div>
          </div>

          {/* Coursework */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-finance-700 mb-2">
              Relevant Coursework
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {edu.coursework?.map((course, courseIndex) => (
                <span
                  key={courseIndex}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700"
                >
                  {course}
                  <button
                    onClick={() => handleRemoveCoursework(index, courseIndex)}
                    className="ml-2 text-primary-500 hover:text-primary-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCoursework}
                onChange={(e) => setNewCoursework(e.target.value)}
                placeholder="Corporate Finance"
                className="input-field flex-1"
              />
              <button
                onClick={() => handleAddCoursework(index)}
                className="btn-outline px-4"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="btn-outline w-full flex items-center justify-center py-3"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </button>
    </div>
  );
}
