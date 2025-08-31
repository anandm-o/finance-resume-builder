'use client';

import { useResumeStore } from '../../store/resumeStore';

export default function HeaderSection() {
  const { resume, updateHeader } = useResumeStore();

  const handleChange = (field: string, value: string) => {
    updateHeader({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-finance-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          value={resume.header.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="John Doe"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-finance-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          value={resume.header.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john.doe@email.com"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-finance-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          value={resume.header.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="(555) 123-4567"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-finance-700 mb-2">
          Location *
        </label>
        <input
          type="text"
          value={resume.header.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Vancouver, BC"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-finance-700 mb-2">
          LinkedIn Profile (Optional)
        </label>
        <input
          type="url"
          value={resume.header.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
          placeholder="linkedin.com/in/johndoe"
          className="input-field"
        />
      </div>
    </div>
  );
}
