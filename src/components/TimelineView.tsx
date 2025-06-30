import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Calendar } from 'lucide-react';
import { TimelineCard, CardGroup } from '../types';
import { DraggableCard } from './DraggableCard';

interface TimelineViewProps {
  cards: TimelineCard[];
  groups: CardGroup[];
  zoomLevel: number;
  timelineScale: 'hour' | 'day' | 'week' | 'month' | 'year';
  showConcurrent: boolean;
  onCardEdit: (card: TimelineCard) => void;
  onCardDelete: (cardId: string) => void;
  onCardSelect: (cardIds: string[]) => void;
  selectedCards: string[];
  onReorderCards: (dragIndex: number, hoverIndex: number) => void;
  onInsertCardBetween?: (afterCardId: string) => void;
  onUpdateCardOrder?: (cardId: string, newOrder: number) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  cards,
  groups,
  zoomLevel,
  timelineScale,
  showConcurrent,
  onCardEdit,
  onCardDelete,
  onCardSelect,
  selectedCards,
  onReorderCards,
  onInsertCardBetween,
  onUpdateCardOrder,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedCards = [...cards].sort((a, b) => {
    // Sort by absolute date first, then by order
    if (a.timeInfo.type === 'absolute' && b.timeInfo.type === 'absolute') {
      if (a.timeInfo.absoluteDate && b.timeInfo.absoluteDate) {
        const dateA = new Date(a.timeInfo.absoluteDate + ' ' + (a.timeInfo.absoluteTime || '00:00'));
        const dateB = new Date(b.timeInfo.absoluteDate + ' ' + (b.timeInfo.absoluteTime || '00:00'));
        return dateA.getTime() - dateB.getTime();
      }
    }
    return a.order - b.order;
  });

  const handleCardClick = (card: TimelineCard, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select
      const newSelection = selectedCards.includes(card.id)
        ? selectedCards.filter(id => id !== card.id)
        : [...selectedCards, card.id];
      onCardSelect(newSelection);
    } else {
      // Single select
      onCardSelect([card.id]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeCard = sortedCards.find(card => card.id === active.id);
    const overCard = sortedCards.find(card => card.id === over.id);
    
    if (activeCard && overCard) {
      const oldIndex = sortedCards.indexOf(activeCard);
      const newIndex = sortedCards.indexOf(overCard);
      onReorderCards(oldIndex, newIndex);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Timeline View</h2>
          <p className="text-sm text-gray-600">
            {cards.length} card{cards.length !== 1 ? 's' : ''} • Scale: {timelineScale} • Zoom: {Math.round(zoomLevel * 100)}%
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div 
          className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-blue-200"
          style={{ transform: `scaleX(${zoomLevel})` }}
        />

        {/* Drag and Drop Context */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortedCards.map(card => card.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {sortedCards.map((card, index) => {
                const group = groups.find(g => g.cardIds.includes(card.id));
                
                return (
                  <div
                    key={card.id}
                    className="relative"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: 'left center',
                      marginBottom: `${8 * zoomLevel}px`,
                    }}
                  >
                    {/* Timeline Node */}
                    <div 
                      className="absolute left-5 top-6 w-3 h-3 rounded-full border-2 border-white shadow-md z-10"
                      style={{ 
                        backgroundColor: group?.color || '#6B7280',
                      }}
                    />

                    {/* Card */}
                    <div className="ml-12">
                      <DraggableCard
                        card={card}
                        group={group}
                        isSelected={selectedCards.includes(card.id)}
                        onEdit={onCardEdit}
                        onDelete={onCardDelete}
                        onSelect={handleCardClick}
                        allCards={cards}
                        onUpdateCardOrder={onUpdateCardOrder}
                        onInsertCardBetween={onInsertCardBetween}
                      />
                    </div>

                    {/* Connection Line to Next Card */}
                    {index < sortedCards.length - 1 && (
                      <div className="absolute left-6 -bottom-2 w-0.5 h-6 bg-gray-300" />
                    )}
                  </div>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

        {/* Empty State */}
        {cards.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Cards in Timeline</h3>
            <p className="text-gray-600">Add some cards to see them in the timeline view.</p>
          </div>
        )}
      </div>
    </div>
  );
};