import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Edit3, 
  Trash2, 
  Clock, 
  MapPin, 
  User, 
  Tag,
  GripVertical,
  Rewind,
  Copy,
  Hash,
  Plus
} from 'lucide-react';
import { TimelineCard, CardGroup } from '../types';
import { format, parseISO } from 'date-fns';
import { CardOrderModal } from './CardOrderModal';

interface DraggableCardProps {
  card: TimelineCard;
  group?: CardGroup;
  isSelected: boolean;
  onEdit: (card: TimelineCard) => void;
  onDelete: (cardId: string) => void;
  onSelect: (card: TimelineCard, event: React.MouseEvent) => void;
  isNested?: boolean;
  allCards?: TimelineCard[];
  onUpdateCardOrder?: (cardId: string, newOrder: number) => void;
  onInsertCardBetween?: (afterCardId: string) => void;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  card,
  group,
  isSelected,
  onEdit,
  onDelete,
  onSelect,
  isNested = false,
  allCards = [],
  onUpdateCardOrder,
  onInsertCardBetween,
}) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatTimeInfo = (card: TimelineCard) => {
    const { timeInfo } = card;
    
    switch (timeInfo.type) {
      case 'absolute':
        if (timeInfo.absoluteDate) {
          const date = parseISO(timeInfo.absoluteDate);
          const timeStr = timeInfo.absoluteTime ? ` at ${timeInfo.absoluteTime}` : '';
          return `${format(date, 'MMM dd, yyyy')}${timeStr}`;
        }
        return 'No date set';
      
      case 'relative':
        return `${timeInfo.relativeValue} ${timeInfo.relativeUnit} ${timeInfo.relativeReference ? `after ${timeInfo.relativeReference}` : 'later'}`;
      
      case 'story':
        return `${timeInfo.storyUnit} ${timeInfo.storyValue}`;
      
      default:
        return 'Unknown time';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'final': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative transition-all duration-200 ${
          isDragging ? 'opacity-50 scale-105 z-50' : ''
        } ${isNested ? 'ml-6' : ''}`}
      >
        <div
          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
            isSelected 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
          }`}
          onClick={(e) => onSelect(card, e)}
        >
          {/* Order Number */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full min-w-[2rem] text-center">
              #{card.order + 1}
            </span>
            {onUpdateCardOrder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOrderModalOpen(true);
                }}
                className="p-1 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Change order"
              >
                <Hash className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Time Indicators */}
          <div className="flex flex-col gap-1">
            {card.timeInfo.isFlashback && (
              <div className="text-orange-500" title="Flashback">
                <Rewind className="w-4 h-4" />
              </div>
            )}
            {card.timeInfo.isConcurrent && (
              <div className="text-purple-500" title="Concurrent Event">
                <Copy className="w-4 h-4" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900 text-lg">{card.title}</h4>
              
              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onInsertCardBetween && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInsertCardBetween(card.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-100 rounded transition-colors"
                    title="Insert card after this one"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(card);
                  }}
                  className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(card.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Time Info */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Clock className="w-4 h-4" />
              <span>{formatTimeInfo(card)}</span>
            </div>

            {/* Group Badge */}
            {group && (
              <div className="mb-2">
                <span 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: group.color }}
                >
                  {group.title}
                </span>
              </div>
            )}

            {/* Description */}
            {card.description && (
              <p className="text-gray-700 mb-3 leading-relaxed line-clamp-2">
                {card.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {/* Status */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(card.metadata.status)}`}>
                {card.metadata.status}
              </span>

              {/* Point of View */}
              {card.metadata.pointOfView && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="text-xs">{card.metadata.pointOfView}</span>
                </div>
              )}

              {/* Location */}
              {card.metadata.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">{card.metadata.location}</span>
                </div>
              )}

              {/* Tags */}
              {card.metadata.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <div className="flex flex-wrap gap-1">
                    {card.metadata.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {card.metadata.tags.length > 2 && (
                      <span className="text-gray-500 text-xs">
                        +{card.metadata.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Order Modal */}
      {isOrderModalOpen && onUpdateCardOrder && (
        <CardOrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          card={card}
          allCards={allCards}
          onUpdateOrder={onUpdateCardOrder}
          onInsertBetween={onInsertCardBetween || (() => {})}
        />
      )}
    </>
  );
};