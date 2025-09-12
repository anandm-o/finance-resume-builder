'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { useResumeStore } from '../store/resumeStore';
import { Plus, Edit, Copy, Trash2, Download, Eye } from 'lucide-react';

export default function Dashboard() {
  const { currentUser } = useFirebase();
  const { resumes, loadUserResumes, loadResume, deleteResume, duplicateResume, resetResume } = useResumeStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadUserResumes();
    }
  }, [currentUser, loadUserResumes]);

  const handleCreateNew = () => {
    resetResume();
    // Navigate to resume builder
    window.location.href = '/builder';
  };

  const handleEditResume = (resumeId: string) => {
    loadResume(resumeId);
    // Navigate to resume builder
    window.location.href = '/builder';
  };

  const handleDuplicateResume = async (resumeId: string) => {
    setLoading(true);
    try {
      await duplicateResume(resumeId);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      setLoading(true);
      try {
        await deleteResume(resumeId);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-finance-800 mb-4">Welcome to Finance Resume Builder</h1>
          <p className="text-finance-600 mb-8">Please sign in to access your resumes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-finance-800 mb-2">My Resumes</h1>
          <p className="text-finance-600">
            Welcome back, {currentUser.displayName || currentUser.email}
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create New Resume
        </button>
      </div>

      {/* Resumes Grid */}
      {resumes.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-soft p-8 max-w-md mx-auto">
            <div className="text-finance-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-finance-800 mb-2">No resumes yet</h3>
            <p className="text-finance-600 mb-6">Create your first professional finance resume to get started</p>
            <button
              onClick={handleCreateNew}
              className="btn-primary w-full"
            >
              Create Your First Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div key={resume.id} className="card p-6 hover:shadow-medium transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-finance-800 mb-1">
                    {resume.header.name || 'Untitled Resume'}
                  </h3>
                  <p className="text-sm text-finance-600">
                    {resume.meta.roleTarget}
                  </p>
                </div>
                <div className="text-xs text-finance-500">
                  {resume.meta.updatedAt && new Date(resume.meta.updatedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm text-finance-700">
                  <span className="font-medium">Experience:</span> {resume.experience.length} positions
                </div>
                <div className="text-sm text-finance-700">
                  <span className="font-medium">Education:</span> {resume.education.length} institutions
                </div>
                <div className="text-sm text-finance-700">
                  <span className="font-medium">Skills:</span> {resume.skills.technical.length + resume.skills.financeTools.length} skills
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditResume(resume.id)}
                  className="btn-outline flex-1 flex items-center justify-center gap-2 py-2"
                  title="Edit Resume"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicateResume(resume.id)}
                  disabled={loading}
                  className="btn-outline p-2"
                  title="Duplicate Resume"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteResume(resume.id)}
                  disabled={loading}
                  className="btn-outline p-2 text-error-600 hover:text-error-700 hover:border-error-300"
                  title="Delete Resume"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12 bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-xl font-semibold text-finance-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleCreateNew}
            className="p-4 border border-finance-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
          >
            <Plus className="h-6 w-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-finance-800 mb-1">Create New Resume</h3>
            <p className="text-sm text-finance-600">Start building a new resume from scratch</p>
          </button>
          
          <button
            onClick={() => resetResume()}
            className="p-4 border border-finance-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
          >
            <Eye className="h-6 w-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-finance-800 mb-1">Try Sample</h3>
            <p className="text-sm text-finance-600">Explore with our sample resume template</p>
          </button>
          
          <button
            onClick={() => window.location.href = '/upload'}
            className="p-4 border border-finance-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
          >
            <Download className="h-6 w-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-finance-800 mb-1">Upload Resume</h3>
            <p className="text-sm text-finance-600">Import and enhance your existing resume</p>
          </button>
        </div>
      </div>
    </div>
  );
}
