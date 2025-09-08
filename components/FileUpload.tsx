'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, ArrowLeft, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { ResumeAI } from '../lib/ai';
import { ParsedResume } from '../types/resume';

// Utility function to read file content
const readFileContent = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Determine the appropriate API endpoint based on file type
  let apiEndpoint = '';
  let errorMessage = '';
  
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    apiEndpoint = '/api/parse-pdf';
    errorMessage = 'Failed to parse PDF file. Please try uploading a text-based PDF or DOCX.';
  } else if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.toLowerCase().endsWith('.docx')
  ) {
    apiEndpoint = '/api/parse-docx';
    errorMessage = 'Failed to parse DOCX file. Please try uploading a different DOCX file.';
  } else {
    // For other file types (like .txt), use FileReader
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error cases
      if (response.status === 422) {
        throw new Error('Looks like your file is image-based. Please upload a text-based PDF or DOCX export.');
      }
      
      throw new Error(errorData.error || errorMessage);
    }
    
    const data = await response.json();
    return data.text;
  } catch (error: any) {
    if (error.message.includes('image-based')) {
      throw error; // Re-throw the specific error message
    }
    if (error.message.includes('PDF parsing library error')) {
      throw new Error('PDF parsing is currently having issues. Please try uploading a DOCX file instead.');
    }
    throw new Error(errorMessage);
  }
};

export default function FileUpload({ onBack }: { onBack: () => void }) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const { resetResume, updateResumeFromAI } = useResumeStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    console.log('File dropped:', file.name, file.type, file.size);
    setUploadedFile(file);
    setIsProcessing(true);
    setError('');
    setCurrentStep('Reading file...');

    try {
      // Read file content
      console.log('Starting file processing...');
      const content = await readFileContent(file);
      console.log('File content read successfully!');
      console.log('Content length:', content.length);
      console.log('=== FULL EXTRACTED TEXT ===');
      console.log(content);
      console.log('=== END OF EXTRACTED TEXT ===');
      
      setCurrentStep('Processing with AI...');

      // Parse with AI
      console.log('Calling Gemini AI to parse resume...');
      console.log('Content being sent to AI (first 500 chars):', content.substring(0, 500));
      const parsed = await ResumeAI.parseResume(content, 'Investment Banking Analyst');
      console.log('AI parsing result:', parsed);
      console.log('Parsed header:', parsed.header);
      console.log('Parsed education:', parsed.education);
      console.log('Parsed experience:', parsed.experience);
      setParsedData(parsed);
      setCurrentStep('Enhancing content...');

      // Enhance with AI
      console.log('Calling Gemini AI to enhance resume...');
      const enhanced = await ResumeAI.enhanceResume(parsed as any, 'Investment Banking Analyst');
      console.log('AI enhancement result:', enhanced);
      setCurrentStep('Updating resume...');

      // Update the resume with parsed and enhanced data
      updateResumeFromAI(parsed, enhanced);
      
      setCurrentStep('Complete!');
      setTimeout(() => {
        setShowPreview(true);
      }, 1000);

    } catch (err: any) {
      console.error('Error in onDrop:', err);
      setError(err.message || 'Failed to process resume');
      setCurrentStep('');
    } finally {
      setIsProcessing(false);
    }
  }, [resetResume]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  if (showPreview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-success-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-finance-800 mb-2">
            Resume Processed Successfully!
          </h2>
          <p className="text-finance-600">
            Your resume has been analyzed and enhanced by our AI. You can now review and edit the content.
          </p>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={() => window.location.href = '/builder'}
            className="btn-primary flex items-center gap-2"
          >
            <FileText className="h-5 w-5" />
            Go to Builder
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="btn-secondary flex items-center gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-finance-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-finance-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="btn-outline flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>
              
              <div className="h-6 w-px bg-finance-200" />
              
              <h1 className="text-xl font-semibold text-finance-900">
                Upload Your Resume
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-finance-900 mb-4">
            Transform Your Resume
          </h2>
          <p className="text-lg text-finance-600 max-w-2xl mx-auto">
            Upload your existing resume and our AI will extract the content, 
            enhance it with finance-specific language, and format it into our 
            ATS-ready template.
          </p>
        </div>

        {/* Upload Area */}
        <div className="card p-8 mb-8">
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-finance-300 hover:border-primary-400 hover:bg-finance-50'
              }`}
            >
              <input {...getInputProps()} />
              
              <Upload className="h-16 w-16 text-finance-400 mx-auto mb-4" />
              
              <h3 className="text-xl font-semibold text-finance-800 mb-2">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
              </h3>
              
              <p className="text-finance-600 mb-4">
                or click to browse files
              </p>
              
              <div className="flex items-center justify-center gap-4 text-sm text-finance-500">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  PDF
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  DOCX
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  DOC
                </div>
              </div>
              
              <p className="text-xs text-finance-400 mt-4">
                Maximum file size: 10MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-success-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-finance-800 mb-2">
                File Uploaded Successfully!
              </h3>
              <p className="text-finance-600 mb-4">
                {uploadedFile.name}
              </p>
              
              {isProcessing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="h-5 w-5 animate-spin text-primary-500" />
                    <span className="text-finance-700">{currentStep}</span>
                  </div>
                  <div className="w-full bg-finance-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Processing Steps */}
        {uploadedFile && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-finance-800 mb-4">
              What happens next?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-finance-800">Content Extraction</h4>
                  <p className="text-sm text-finance-600">
                    Our AI analyzes your resume and extracts key information like experience, 
                    education, and skills.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-finance-800">AI Enhancement</h4>
                  <p className="text-sm text-finance-600">
                    Each bullet point gets enhanced with finance-specific language, 
                    quantification, and action verbs.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-finance-800">Template Mapping</h4>
                  <p className="text-sm text-finance-600">
                    Content is automatically mapped to our locked finance template 
                    for consistent, ATS-friendly formatting.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-finance-800">Review & Edit</h4>
                  <p className="text-sm text-finance-600">
                    You can review all AI suggestions, make edits, and customize 
                    the content before finalizing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="card p-4 bg-error-50 border-error-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-error-500" />
              <div>
                <h4 className="font-medium text-error-800">Upload Error</h4>
                <p className="text-sm text-error-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Supported Formats */}
        <div className="card p-6 mt-8">
          <h3 className="text-lg font-semibold text-finance-800 mb-4">
            Supported File Formats
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-finance-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="h-8 w-8 text-finance-600" />
              </div>
              <h4 className="font-medium text-finance-800 mb-1">PDF</h4>
              <p className="text-sm text-finance-600">
                Most common format, excellent for text extraction
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-finance-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="h-8 w-8 text-finance-600" />
              </div>
              <h4 className="font-medium text-finance-800 mb-1">DOCX</h4>
              <p className="text-sm text-finance-600">
                Modern Word format, preserves formatting well
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-finance-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="h-8 w-8 text-finance-600" />
              </div>
              <h4 className="font-medium text-finance-800 mb-1">DOC</h4>
              <p className="text-sm text-finance-600">
                Legacy Word format, basic text extraction
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
