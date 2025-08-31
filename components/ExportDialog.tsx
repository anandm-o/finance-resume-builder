'use client';

import { useState } from 'react';
import { X, Download, FileText, FileImage, FileCode } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';

interface ExportDialogProps {
  onClose: () => void;
}

export default function ExportDialog({ onClose }: ExportDialogProps) {
  const { resume } = useResumeStore();
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 20) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // In a real implementation, this would generate the actual file
      // For now, we'll simulate the download
      const filename = `${resume.header.name.replace(/\s+/g, '_')}_Finance_Resume.${exportFormat}`;
      
      // Create a dummy download link
      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Resume content would be here');
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close dialog after successful export
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const exportOptions = [
    {
      id: 'pdf',
      name: 'PDF',
      description: 'High-quality, print-ready format',
      icon: FileImage,
      color: 'text-error-600',
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200'
    },
    {
      id: 'docx',
      name: 'Microsoft Word',
      description: 'Editable format for further customization',
      icon: FileText,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200'
    },
    {
      id: 'txt',
      name: 'Plain Text',
      description: 'Simple text format for ATS systems',
      icon: FileCode,
      color: 'text-finance-600',
      bgColor: 'bg-finance-50',
      borderColor: 'border-finance-200'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-finance-200">
          <h2 className="text-xl font-semibold text-finance-900">Export Resume</h2>
          <button
            onClick={onClose}
            className="text-finance-400 hover:text-finance-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-finance-800 mb-3">
              Choose Export Format
            </h3>
            <p className="text-finance-600 text-sm mb-4">
              Select the format that best suits your needs. All formats maintain the 
              locked template structure and ATS compatibility.
            </p>
          </div>

          {/* Format Options */}
          <div className="space-y-3 mb-6">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.id}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    exportFormat === option.id
                      ? `${option.borderColor} ${option.bgColor}`
                      : 'border-finance-200 hover:border-finance-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="exportFormat"
                    value={option.id}
                    checked={exportFormat === option.id}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="sr-only"
                  />
                  
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0 ${
                    exportFormat === option.id
                      ? `${option.borderColor} bg-white`
                      : 'border-finance-300'
                  }`}>
                    {exportFormat === option.id && (
                      <div className={`w-3 h-3 rounded-full ${option.bgColor.replace('50', '500')} m-0.5`} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-5 w-5 ${option.color}`} />
                      <span className="font-medium text-finance-800">{option.name}</span>
                    </div>
                    <p className="text-sm text-finance-600">{option.description}</p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-finance-700">Exporting...</span>
                <span className="text-sm text-finance-600">{exportProgress}%</span>
              </div>
              <div className="w-full bg-finance-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn-primary w-full flex items-center justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Export Resume
              </>
            )}
          </button>

          {/* Format Info */}
          <div className="mt-6 p-4 bg-finance-50 rounded-lg">
            <h4 className="font-medium text-finance-800 mb-2">Format Details</h4>
            <div className="text-sm text-finance-600 space-y-1">
              {exportFormat === 'pdf' && (
                <>
                  <p>• High-resolution (300 DPI) for printing</p>
                  <p>• Maintains exact template formatting</p>
                  <p>• Universal compatibility</p>
                </>
              )}
              {exportFormat === 'docx' && (
                <>
                  <p>• Editable in Microsoft Word</p>
                  <p>• Preserves all formatting and styles</p>
                  <p>• Easy to customize further</p>
                </>
              )}
              {exportFormat === 'txt' && (
                <>
                  <p>• Plain text format</p>
                  <p>• Maximum ATS compatibility</p>
                  <p>• No formatting, just content</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
