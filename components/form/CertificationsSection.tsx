'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

export default function CertificationsSection() {
  const { resume, updateSkills } = useResumeStore();
  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertDate, setNewCertDate] = useState('');

  const handleAddCertification = () => {
    if (newCertName.trim() && newCertIssuer.trim() && newCertDate.trim()) {
      const newCert = {
        name: newCertName.trim(),
        issuer: newCertIssuer.trim(),
        date: newCertDate.trim()
      };
      
      const updatedCerts = [...(resume.certifications || []), newCert];
      // We need to update the resume directly for certifications
      // This is a limitation of the current store structure
      
      setNewCertName('');
      setNewCertIssuer('');
      setNewCertDate('');
    }
  };

  const handleRemoveCertification = (index: number) => {
    const updatedCerts = (resume.certifications || []).filter((_, i) => i !== index);
    // We need to update the resume directly for certifications
    // This is a limitation of the current store structure
  };

  return (
    <div className="space-y-6">
      {(resume.certifications || []).map((cert, index) => (
        <div key={index} className="p-4 border border-finance-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-finance-800">Certification #{index + 1}</h4>
            <button
              onClick={() => handleRemoveCertification(index)}
              className="text-error-500 hover:text-error-600 p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Certification Name *
              </label>
              <input
                type="text"
                value={cert.name}
                placeholder="CFA Level I"
                className="input-field"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Issuing Organization *
              </label>
              <input
                type="text"
                value={cert.issuer}
                placeholder="CFA Institute"
                className="input-field"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-finance-700 mb-2">
                Date Obtained *
              </label>
              <input
                type="text"
                value={cert.date}
                placeholder="June 2024"
                className="input-field"
                disabled
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add New Certification */}
      <div className="p-4 border border-finance-200 rounded-lg bg-finance-50">
        <h4 className="font-medium text-finance-800 mb-4">Add New Certification</h4>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-finance-700 mb-2">
              Certification Name *
            </label>
            <input
              type="text"
              value={newCertName}
              onChange={(e) => setNewCertName(e.target.value)}
              placeholder="CFA Level I"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-finance-700 mb-2">
              Issuing Organization *
            </label>
            <input
              type="text"
              value={newCertIssuer}
              onChange={(e) => setNewCertIssuer(e.target.value)}
              placeholder="CFA Institute"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-finance-700 mb-2">
              Date Obtained *
            </label>
            <input
              type="text"
              value={newCertDate}
              onChange={(e) => setNewCertDate(e.target.value)}
              placeholder="June 2024"
              className="input-field"
            />
          </div>
        </div>

        <button
          onClick={handleAddCertification}
          className="btn-outline flex items-center justify-center py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </button>
      </div>

      {/* Common Finance Certifications */}
      <div className="p-4 border border-finance-200 rounded-lg bg-primary-50">
        <h4 className="font-medium text-primary-800 mb-3">Common Finance Certifications</h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>CFA (Chartered Financial Analyst)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>FRM (Financial Risk Manager)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>CAIA (Chartered Alternative Investment Analyst)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>CPA (Certified Public Accountant)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>Series 7 (General Securities Representative)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>Series 63 (Uniform Securities Agent)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
