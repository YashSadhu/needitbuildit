import React from 'react';
import { PenTool, Clock, Grid3X3, List, BarChart3, Edit3, Download, FileText, Settings, Home } from 'lucide-react';

interface HeaderProps {
  viewMode: 'timeline' | 'hierarchy';
  selectedCards: string[];
  filteredCards: any[];
  groups: any[];
  onViewModeChange: (mode: 'timeline' | 'hierarchy') => void;
  onAddCard: () => void;
  onBulkEdit: () => void;
  onExport: () => void;
  onResearchNotes: () => void;
  onSettings: () => void;
  onBackToLanding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  selectedCards,
  filteredCards,
  groups,
  onViewModeChange,
  onAddCard,
  onBulkEdit,
  onExport,
  onResearchNotes,
  onSettings,
  onBackToLanding,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Back to Landing Page"
            >
              <Home className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Storytelling Timeline</h1>
              <p className="text-sm text-gray-600">Intuitive story planning and narrative organization</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Mode Selector */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('timeline')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'timeline' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Clock className="w-4 h-4" />
                Timeline
              </button>
              <button
                onClick={() => onViewModeChange('hierarchy')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'hierarchy' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                Hierarchy
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>{filteredCards.length} cards</span>
              </div>
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                <span>{groups.length} groups</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Research Notes Button */}
              <button
                onClick={onResearchNotes}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" />
                Research
              </button>

              {/* Export Button */}
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              {/* Settings Button */}
              <button
                onClick={onSettings}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>

            {/* Bulk Edit Button */}
            {selectedCards.length > 0 && (
              <button
                onClick={onBulkEdit}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit {selectedCards.length}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};