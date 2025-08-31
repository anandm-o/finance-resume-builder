'use client';

import { useState } from 'react';
import { Zap, Star, Shield, Edit3, RefreshCw } from 'lucide-react';
import { ExperienceBullet, EnhancementLevel } from '../../types/resume';

interface BulletEditorProps {
  bullet: ExperienceBullet;
  onChange: (updates: Partial<ExperienceBullet>) => void;
}

export default function BulletEditor({ bullet, onChange }: BulletEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(bullet.text);

  const handleEnhancementChange = (level: EnhancementLevel) => {
    onChange({ enhancementLevel: level });
  };

  const handleSaveEdit = () => {
    onChange({ text: editText });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(bullet.text);
    setIsEditing(false);
  };

  const handleAIEnhance = async () => {
    // This would integrate with actual AI service
    // For now, we'll simulate AI enhancement
    const enhancedText = bullet.text.replace(
      /(helped|worked|assisted|supported)/gi,
      (match) => {
        const enhancements = {
          'helped': 'led',
          'worked': 'developed',
          'assisted': 'managed',
          'supported': 'executed'
        };
        return enhancements[match.toLowerCase() as keyof typeof enhancements] || match;
      }
    );
    
    onChange({ 
      text: enhancedText,
      enhancementLevel: 'Enhance',
      aiSuggestions: {
        aggressive: enhancedText,
        standard: bullet.text,
        conservative: bullet.text
      }
    });
  };

  const getEnhancementIcon = (level: EnhancementLevel) => {
    switch (level) {
      case 'Enhance':
        return <Zap className="h-4 w-4 text-warning-500" />;
      case 'Conservative':
        return <Shield className="h-4 w-4 text-success-500" />;
      case 'Keep as-is':
        return <Star className="h-4 w-4 text-finance-500" />;
      default:
        return <Star className="h-4 w-4 text-finance-500" />;
    }
  };

  const getEnhancementLabel = (level: EnhancementLevel) => {
    switch (level) {
      case 'Enhance':
        return 'Enhanced';
      case 'Conservative':
        return 'Conservative';
      case 'Keep as-is':
        return 'Original';
      default:
        return 'Original';
    }
  };

  return (
    <div className="space-y-3">
      {/* Enhancement Level Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-finance-600">Enhancement:</span>
        <div className="flex border border-finance-200 rounded-md overflow-hidden">
          {(['Keep as-is', 'Conservative', 'Enhance'] as EnhancementLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => handleEnhancementChange(level)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                bullet.enhancementLevel === level
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-finance-600 hover:bg-finance-50'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        
        <button
          onClick={handleAIEnhance}
          className="btn-outline px-2 py-1 text-xs flex items-center gap-1"
          title="Enhance with AI"
        >
          <Zap className="h-3 w-3" />
          AI
        </button>
      </div>

      {/* Bullet Text */}
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="input-field text-sm"
            rows={3}
            placeholder="Enter your bullet point..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="btn-outline px-3 py-1 text-xs"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="btn-outline px-3 py-1 text-xs bg-finance-100"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getEnhancementIcon(bullet.enhancementLevel)}
              <span className="text-xs text-finance-600">
                {getEnhancementLabel(bullet.enhancementLevel)}
              </span>
            </div>
            <p className="text-sm text-finance-800 leading-relaxed">
              {bullet.text || 'No text entered'}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-outline p-1 ml-2"
            title="Edit bullet"
          >
            <Edit3 className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* AI Suggestions */}
      {bullet.aiSuggestions && (
        <div className="mt-3 p-3 bg-finance-50 rounded border border-finance-200">
          <h5 className="text-xs font-medium text-finance-700 mb-2">AI Suggestions</h5>
          <div className="space-y-2">
            {Object.entries(bullet.aiSuggestions).map(([style, text]) => (
              <div key={style} className="flex items-start gap-2">
                <span className="text-xs font-medium text-finance-600 capitalize min-w-[80px]">
                  {style}:
                </span>
                <p className="text-xs text-finance-700 flex-1">{text}</p>
                <button
                  onClick={() => onChange({ text, enhancementLevel: style as EnhancementLevel })}
                  className="btn-outline px-2 py-1 text-xs"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Original Text (if different) */}
      {bullet.originalText && bullet.originalText !== bullet.text && (
        <div className="mt-2 p-2 bg-finance-100 rounded border-l-2 border-finance-300">
          <div className="text-xs font-medium text-finance-600 mb-1">Original:</div>
          <p className="text-xs text-finance-700 italic">{bullet.originalText}</p>
        </div>
      )}
    </div>
  );
}
