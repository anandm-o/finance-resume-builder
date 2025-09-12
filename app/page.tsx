'use client';

import { useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import FileUpload from '../components/FileUpload';
import ResumeBuilder from '../components/ResumeBuilder';
import Link from 'next/link';
import { ArrowRight, Upload, Edit3, Eye, Shield, Zap, Target, FileText } from 'lucide-react';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'landing' | 'upload' | 'builder'>('landing');
  const { currentUser } = useFirebase();

  const handleUpload = () => setCurrentView('upload');
  const handleBuilder = () => setCurrentView('builder');
  const handleTrySample = () => setCurrentView('builder');

  if (currentView === 'upload') {
    return <FileUpload />;
  }

  if (currentView === 'builder') {
    return <ResumeBuilder />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-finance-50 to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-finance-900 mb-6">
            Turn Your Resume Into a{' '}
            <span className="text-primary-600">Finance-Recruiting Machine</span>
          </h1>
          <p className="text-xl text-finance-600 mb-8 max-w-3xl mx-auto">
            Upload your resume or start from scratch. Our AI shapes it into a polished, ATS-ready finance template that gets you interviews.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleUpload}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
            >
              <Upload className="h-5 w-5" />
              Upload Resume
              <ArrowRight className="h-5 w-5" />
            </button>
            <Link
              href="/resume-creator"
              className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2"
            >
              <Edit3 className="h-5 w-5" />
              Start from Scratch
            </Link>
            <button
              onClick={handleTrySample}
              className="btn-outline text-lg px-8 py-4 flex items-center justify-center gap-2"
            >
              <Eye className="h-5 w-5" />
              Try Sample
            </button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-finance-800 mb-4">
              Trusted by Finance Students Worldwide
            </h2>
            <p className="text-lg text-finance-600">
              Join thousands of students who've landed interviews at top firms
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-finance-600">Resumes Built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-finance-600">ATS Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-finance-600">Interviews Landed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">4.9/5</div>
              <div className="text-finance-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-finance-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-finance-800 mb-4">
              Everything You Need for Finance Recruiting
            </h2>
            <p className="text-lg text-finance-600">
              Professional templates, AI enhancement, and industry-specific guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-finance-800 mb-3">Template Lock</h3>
              <p className="text-finance-600">
                Our finance template is locked and optimized for ATS systems. No more formatting issues or compatibility problems.
              </p>
            </div>
            
            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-finance-800 mb-3">AI Enhancement</h3>
              <p className="text-finance-600">
                Get AI-powered suggestions to improve your bullet points, add quantification, and optimize for your target role.
              </p>
            </div>
            
            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-finance-800 mb-3">Role-Specific</h3>
              <p className="text-finance-600">
                Tailored for Investment Banking, Private Equity, Asset Management, and Corporate Finance roles.
              </p>
            </div>
            
            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-finance-800 mb-3">Multiple Formats</h3>
              <p className="text-finance-600">
                Export to PDF, DOCX, or TXT with perfect formatting. Print-ready and professional.
              </p>
            </div>
            
            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-finance-800 mb-3">Easy Import</h3>
              <p className="text-finance-600">
                Upload your existing resume (PDF/DOCX) and we'll extract and enhance the content automatically.
              </p>
            </div>
            
            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-finance-800 mb-3">Live Preview</h3>
              <p className="text-finance-600">
                See exactly how your resume will look as you build it. Real-time updates and professional formatting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Build Your Finance Resume?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students who've transformed their careers with our professional templates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleUpload}
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Upload className="h-5 w-5" />
              Upload & Transform
            </button>
            <Link
              href="/resume-creator"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Edit3 className="h-5 w-5" />
              Start Building
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
