import React, { useState } from 'react';
import { X, ArrowUp, ArrowDown, Hash } from 'lucide-react';
import { TimelineCard } from '../types';

interface CardOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: TimelineCard;
  allCards: TimelineCard[];
  onUpdateOrder: (cardId: string, newOrder: number) => void;
  onInsertBetween: (afterCardId: string) => void;
}

export const CardOrderModal: React.FC<CardOrderModalProps> = ({
  isOpen,
  onClose,
  card,
  allCards,
  onUpdateOrder,
  onInsertBetween,
}) => {
  const [newOrder, setNewOrder] = useState(card.order + 1); // Display as 1-based

  if (!isOpen) return null;

  const sortedCards = [...allCards].sort((a, b) => a.order - b.order);
  const currentIndex = sortedCards.findIndex(c => c.id === card.id);

  const handleUpdateOrder = () => {
    const zeroBasedOrder = Math.max(0, Math.min(newOrder - 1, allCards.length - 1));
    onUpdateOrder(card.id, zeroBasedOrder);
    onClose();
  };

  const handleInsertAfter = (afterCardId: string) => {
    onInsertBetween(afterCardId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Hash className="w-5 h-5 text-blue-500" />
            Reorder Card: {card.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Direct Order Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Set Position (1 to {allCards.length})
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max={allCards.length}
                value={newOrder}
                onChange={(e) => setNewOrder(parseInt(e.target.value) || 1)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleUpdateOrder}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Move to Position
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Current position: {card.order + 1} of {allCards.length}
            </p>
          </div>

          {/* Insert Between Cards */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Or insert after another card:
            </h3>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {sortedCards.map((otherCard, index) => (
                <div
                  key={otherCard.id}
                  className={`flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 ${
                    otherCard.id === card.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <span className={`font-medium ${
                        otherCard.id === card.id ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {otherCard.title}
                      </span>
                      {otherCard.id === card.id && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    {otherCard.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {otherCard.description}
                      </p>
                    )}
                  </div>
                  
                  {otherCard.id !== card.id && (
                    <button
                      onClick={() => handleInsertAfter(otherCard.id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    >
                      <ArrowDown className="w-3 h-3" />
                      Insert After
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdateOrder(card.id, 0)}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
              Move to Top
            </button>
            <button
              onClick={() => onUpdateOrder(card.id, allCards.length - 1)}
              disabled={currentIndex === allCards.length - 1}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowDown className="w-4 h-4" />
              Move to Bottom
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
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