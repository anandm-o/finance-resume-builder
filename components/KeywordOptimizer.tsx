'use client';

import { useState, useMemo } from 'react';
import { X, Target, TrendingUp, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';

interface KeywordOptimizerProps {
  onClose: () => void;
}

interface KeywordMatch {
  keyword: string;
  matchScore: number;
  category: 'technical' | 'finance' | 'leadership' | 'quantification';
  found: boolean;
  suggestions: string[];
}

export default function KeywordOptimizer({ onClose }: KeywordOptimizerProps) {
  const { resume, aiEnhancementOptions } = useResumeStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Define target keywords based on role
  const targetKeywords = useMemo(() => {
    const baseKeywords = {
      technical: ['Excel', 'PowerPoint', 'Financial Modeling', 'DCF', 'LBO', 'Valuation', 'Modeling'],
      finance: ['M&A', 'Due Diligence', 'Pitch Book', 'CIM', 'Comparable Companies', 'Precedent Transactions'],
      leadership: ['Managed', 'Led', 'Organized', 'Mentored', 'Trained', 'Coordinated'],
      quantification: ['Increased', 'Reduced', 'Improved', 'Generated', 'Analyzed', 'Processed']
    };

    // Add role-specific keywords
    if (aiEnhancementOptions.targetRole.includes('Banking')) {
      baseKeywords.finance.push('Investment Banking', 'Capital Markets', 'Underwriting', 'Syndication');
      baseKeywords.technical.push('Bloomberg Terminal', 'Capital IQ', 'FactSet');
    } else if (aiEnhancementOptions.targetRole.includes('Asset Management')) {
      baseKeywords.finance.push('Portfolio Management', 'Risk Management', 'Asset Allocation', 'Performance Analysis');
      baseKeywords.technical.push('Risk Models', 'Portfolio Optimization', 'Performance Attribution');
    } else if (aiEnhancementOptions.targetRole.includes('Corporate Finance')) {
      baseKeywords.finance.push('FP&A', 'Budgeting', 'Forecasting', 'Financial Planning', 'Working Capital');
      baseKeywords.technical.push('3-Statement Models', 'Budget Models', 'Cash Flow Forecasting');
    }

    return baseKeywords;
  }, [aiEnhancementOptions.targetRole]);

  // Analyze resume content for keyword matches
  const keywordAnalysis = useMemo(() => {
    const resumeText = JSON.stringify(resume).toLowerCase();
    const analysis: KeywordMatch[] = [];

    Object.entries(targetKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        const found = resumeText.includes(keywordLower);
        
        // Calculate match score based on frequency and context
        let matchScore = 0;
        if (found) {
          const regex = new RegExp(keywordLower, 'gi');
          const matches = resumeText.match(regex);
          matchScore = matches ? Math.min(matches.length * 20, 100) : 0;
        }

        // Generate suggestions for missing keywords
        const suggestions: string[] = [];
        if (!found) {
          switch (category) {
            case 'technical':
              suggestions.push(`Add "${keyword}" to your skills section`);
              suggestions.push(`Include "${keyword}" in your experience bullets`);
              break;
            case 'finance':
              suggestions.push(`Describe your experience with "${keyword}"`);
              suggestions.push(`Add a bullet point about "${keyword}"`);
              break;
            case 'leadership':
              suggestions.push(`Use "${keyword}" to start your leadership bullets`);
              suggestions.push(`Include "${keyword}" in your project descriptions`);
              break;
            case 'quantification':
              suggestions.push(`Start bullets with "${keyword} by X%"`);
              suggestions.push(`Use "${keyword}" to describe outcomes`);
              break;
          }
        }

        analysis.push({
          keyword,
          matchScore,
          category: category as any,
          found,
          suggestions
        });
      });
    });

    return analysis.sort((a, b) => b.matchScore - a.matchScore);
  }, [resume, targetKeywords]);

  const filteredAnalysis = selectedCategory === 'all' 
    ? keywordAnalysis 
    : keywordAnalysis.filter(k => k.category === selectedCategory);

  const overallScore = Math.round(
    keywordAnalysis.reduce((sum, k) => sum + k.matchScore, 0) / keywordAnalysis.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600 bg-success-50';
    if (score >= 60) return 'text-warning-600 bg-warning-50';
    return 'text-error-600 bg-error-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const categories = [
    { id: 'all', name: 'All Categories', count: keywordAnalysis.length },
    { id: 'technical', name: 'Technical Skills', count: keywordAnalysis.filter(k => k.category === 'technical').length },
    { id: 'finance', name: 'Finance Terms', count: keywordAnalysis.filter(k => k.category === 'finance').length },
    { id: 'leadership', name: 'Leadership', count: keywordAnalysis.filter(k => k.category === 'leadership').length },
    { id: 'quantification', name: 'Quantification', count: keywordAnalysis.filter(k => k.category === 'quantification').length }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-finance-200">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-finance-900">Keyword Optimizer</h2>
          </div>
          <button
            onClick={onClose}
            className="text-finance-400 hover:text-finance-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overall Score */}
          <div className="mb-8">
            <div className="text-center p-6 bg-finance-50 rounded-lg">
              <h3 className="text-lg font-medium text-finance-800 mb-2">
                Overall Keyword Match Score
              </h3>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold ${getScoreColor(overallScore)}`}>
                <span>{overallScore}%</span>
                <span className="text-sm">({getScoreLabel(overallScore)})</span>
              </div>
              <p className="text-finance-600 mt-2">
                Target Role: {aiEnhancementOptions.targetRole}
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-finance-800 mb-3">Filter by Category</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-finance-100 text-finance-700 hover:bg-finance-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Keyword Analysis */}
          <div className="space-y-4">
            {filteredAnalysis.map((keyword) => (
              <div
                key={keyword.keyword}
                className={`p-4 border rounded-lg ${
                  keyword.found 
                    ? 'border-success-200 bg-success-50' 
                    : 'border-error-200 bg-error-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {keyword.found ? (
                        <CheckCircle className="h-5 w-5 text-success-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-error-500" />
                      )}
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-finance-800">{keyword.keyword}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(keyword.matchScore)}`}>
                          {keyword.matchScore}%
                        </span>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        keyword.category === 'technical' ? 'bg-blue-100 text-blue-700' :
                        keyword.category === 'finance' ? 'bg-green-100 text-green-700' :
                        keyword.category === 'leadership' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {keyword.category}
                      </span>
                    </div>
                    
                    {!keyword.found && keyword.suggestions.length > 0 && (
                      <div className="ml-8">
                        <h6 className="text-sm font-medium text-finance-700 mb-2">Suggestions:</h6>
                        <ul className="space-y-1">
                          {keyword.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-finance-600 flex items-center gap-2">
                              <Zap className="h-3 w-3 text-warning-500" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optimization Tips */}
          <div className="mt-8 p-6 bg-primary-50 rounded-lg">
            <h4 className="font-medium text-primary-800 mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Optimization Tips
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm text-primary-700">
              <div>
                <h5 className="font-medium mb-2">For Low-Scoring Keywords:</h5>
                <ul className="space-y-1">
                  <li>• Add relevant skills to your skills section</li>
                  <li>• Include specific tools and technologies in experience bullets</li>
                  <li>• Use finance-specific terminology throughout</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">For High-Scoring Keywords:</h5>
                <ul className="space-y-1">
                  <li>• Ensure consistent usage across sections</li>
                  <li>• Provide specific examples and outcomes</li>
                  <li>• Use variations to avoid repetition</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-finance-200 mt-8">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Here you could implement auto-optimization features
                onClose();
              }}
              className="btn-primary flex-1"
            >
              Apply Optimizations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
