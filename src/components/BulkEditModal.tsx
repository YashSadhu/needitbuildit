import React, { useState } from 'react';
import { X, Edit3, Tag, MapPin, User } from 'lucide-react';
import { CardMetadata, MetadataTemplate } from '../types';

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (metadata: Partial<CardMetadata>) => void;
  selectedCount: number;
  templates: MetadataTemplate[];
}

export const BulkEditModal: React.FC<BulkEditModalProps> = ({
  isOpen,
  onClose,
  onApply,
  selectedCount,
  templates,
}) => {
  const [metadata, setMetadata] = useState<Partial<CardMetadata>>({
    tags: [],
    status: undefined,
    pointOfView: '',
    location: '',
    label: '',
  });
  
  const [newTag, setNewTag] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty values
    const cleanMetadata: Partial<CardMetadata> = {};
    
    if (metadata.tags && metadata.tags.length > 0) {
      cleanMetadata.tags = metadata.tags;
    }
    if (metadata.status) {
      cleanMetadata.status = metadata.status;
    }
    if (metadata.pointOfView?.trim()) {
      cleanMetadata.pointOfView = metadata.pointOfView.trim();
    }
    if (metadata.location?.trim()) {
      cleanMetadata.location = metadata.location.trim();
    }
    if (metadata.label?.trim()) {
      cleanMetadata.label = metadata.label.trim();
    }

    onApply(cleanMetadata);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !metadata.tags?.includes(newTag.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleApplyTemplate = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      setMetadata(prev => ({
        ...prev,
        ...template.fields,
        tags: [...(prev.tags || []), ...(template.fields.tags || [])],
      }));
      setSelectedTemplate('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-500" />
            Bulk Edit Metadata
            <span className="text-sm font-normal text-gray-500">
              ({selectedCount} card{selectedCount !== 1 ? 's' : ''})
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Template Selector */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apply Template (Optional)
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a template...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.description}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleApplyTemplate}
              disabled={!selectedTemplate}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Apply
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tags */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Add Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {metadata.tags?.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={metadata.status || ''}
                onChange={(e) => setMetadata(prev => ({ 
                  ...prev, 
                  status: e.target.value as any || undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Don't change</option>
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="final">Final</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label
              </label>
              <input
                type="text"
                value={metadata.label || ''}
                onChange={(e) => setMetadata(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Leave empty to not change"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Point of View */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Point of View
              </label>
              <input
                type="text"
                value={metadata.pointOfView || ''}
                onChange={(e) => setMetadata(prev => ({ ...prev, pointOfView: e.target.value }))}
                placeholder="Leave empty to not change"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <input
                type="text"
                value={metadata.location || ''}
                onChange={(e) => setMetadata(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Leave empty to not change"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};