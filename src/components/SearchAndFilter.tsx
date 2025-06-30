import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Save, 
  X, 
  Calendar, 
  Tag, 
  MapPin, 
  User, 
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SearchFilters, SearchQuery } from '../types';

interface SearchAndFilterProps {
  searchTerm: string;
  activeFilters: SearchFilters;
  savedSearches: SearchQuery[];
  uniqueValues: {
    tags: string[];
    labels: string[];
    pointOfViews: string[];
    locations: string[];
    statuses: string[];
  };
  onSearchChange: (term: string) => void;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onSaveSearch: (query: Omit<SearchQuery, 'id'>) => void;
  onLoadSearch: (query: SearchQuery) => void;
  onDeleteSearch: (queryId: string) => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  activeFilters,
  savedSearches,
  uniqueValues,
  onSearchChange,
  onFiltersChange,
  onSaveSearch,
  onLoadSearch,
  onDeleteSearch,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleSaveSearch = () => {
    if (saveSearchName.trim()) {
      onSaveSearch({
        name: saveSearchName.trim(),
        text: searchTerm,
        filters: activeFilters,
        saved: true,
      });
      setSaveSearchName('');
      setShowSaveDialog(false);
    }
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onFiltersChange({
      tags: [],
      labels: [],
      pointOfView: [],
      locations: [],
      status: [],
      timeType: [],
      groups: [],
      customFields: {},
      dateRange: undefined,
    });
  };

  const activeFilterCount = 
    activeFilters.tags.length +
    activeFilters.labels.length +
    activeFilters.pointOfView.length +
    activeFilters.locations.length +
    activeFilters.status.length +
    activeFilters.timeType.length +
    (activeFilters.dateRange ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cards by title, description, content, or metadata..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
              activeFilterCount > 0 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                {activeFilterCount}
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {(searchTerm || activeFilterCount > 0) && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueValues.tags.map(tag => (
                  <label key={tag} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={activeFilters.tags.includes(tag)}
                      onChange={(e) => {
                        const newTags = e.target.checked
                          ? [...activeFilters.tags, tag]
                          : activeFilters.tags.filter(t => t !== tag);
                        onFiltersChange({ tags: newTags });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {uniqueValues.statuses.map(status => (
                  <label key={status} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={activeFilters.status.includes(status)}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? [...activeFilters.status, status]
                          : activeFilters.status.filter(s => s !== status);
                        onFiltersChange({ status: newStatus });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Point of View Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Point of View
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueValues.pointOfViews.map(pov => (
                  <label key={pov} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={activeFilters.pointOfView.includes(pov)}
                      onChange={(e) => {
                        const newPov = e.target.checked
                          ? [...activeFilters.pointOfView, pov]
                          : activeFilters.pointOfView.filter(p => p !== pov);
                        onFiltersChange({ pointOfView: newPov });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{pov}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueValues.locations.map(location => (
                  <label key={location} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={activeFilters.locations.includes(location)}
                      onChange={(e) => {
                        const newLocations = e.target.checked
                          ? [...activeFilters.locations, location]
                          : activeFilters.locations.filter(l => l !== location);
                        onFiltersChange({ locations: newLocations });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time Type
              </label>
              <div className="space-y-2">
                {['absolute', 'relative', 'story'].map(type => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={activeFilters.timeType.includes(type)}
                      onChange={(e) => {
                        const newTimeType = e.target.checked
                          ? [...activeFilters.timeType, type]
                          : activeFilters.timeType.filter(t => t !== type);
                        onFiltersChange({ timeType: newTimeType });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={activeFilters.dateRange?.start || ''}
                  onChange={(e) => onFiltersChange({
                    dateRange: {
                      start: e.target.value,
                      end: activeFilters.dateRange?.end || ''
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={activeFilters.dateRange?.end || ''}
                  onChange={(e) => onFiltersChange({
                    dateRange: {
                      start: activeFilters.dateRange?.start || '',
                      end: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Search Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSaveDialog(true)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Search
              </button>

              {savedSearches.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Saved:</span>
                  {savedSearches.map(search => (
                    <div key={search.id} className="flex items-center gap-1">
                      <button
                        onClick={() => onLoadSearch(search)}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        {search.name}
                      </button>
                      <button
                        onClick={() => onDeleteSearch(search.id!)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Search</h3>
            <input
              type="text"
              placeholder="Enter search name..."
              value={saveSearchName}
              onChange={(e) => setSaveSearchName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSearch}
                disabled={!saveSearchName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};