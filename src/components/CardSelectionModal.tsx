import React, { useState } from 'react';
import { X, Plus, Search, FileText } from 'lucide-react';
import { TimelineCard } from '../types';

interface CardSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCard: (cardId: string) => void;
  availableCards: TimelineCard[];
  groupTitle: string;
}

export const CardSelectionModal: React.FC<CardSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectCard,
  availableCards,
  groupTitle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredCards = availableCards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCard = (cardId: string) => {
    onSelectCard(cardId);
    onClose();
    setSearchTerm('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            Add Card to "{groupTitle}"
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search ungrouped cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Card List */}
        <div className="p-4 overflow-y-auto max-h-96">
          {filteredCards.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {availableCards.length === 0 ? 'No Ungrouped Cards' : 'No Cards Found'}
              </h3>
              <p className="text-gray-600">
                {availableCards.length === 0 
                  ? 'All cards are already assigned to groups or you need to create some cards first.'
                  : 'Try adjusting your search terms.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCards.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleSelectCard(card.id)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">{card.title}</h4>
                  {card.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{card.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      card.metadata.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      card.metadata.status === 'review' ? 'bg-blue-100 text-blue-800' :
                      card.metadata.status === 'final' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {card.metadata.status}
                    </span>
                    {card.metadata.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {card.metadata.tags.length > 2 && (
                      <span className="text-gray-500 text-xs">
                        +{card.metadata.tags.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};