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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Folder, FileText } from 'lucide-react';
import { TimelineCard, CardGroup } from '../types';
import { DraggableGroup } from './DraggableGroup';
import { DraggableCard } from './DraggableCard';

interface HierarchyViewProps {
  cards: TimelineCard[];
  groups: CardGroup[];
  onCardEdit: (card: TimelineCard) => void;
  onCardDelete: (cardId: string) => void;
  onGroupEdit: (group: CardGroup) => void;
  onGroupDelete: (groupId: string) => void;
  onToggleCollapse: (groupId: string) => void;
  onAddCard: () => void;
  onAddGroup: () => void;
  selectedCards: string[];
  onCardSelect: (cardIds: string[]) => void;
  onReorderCards: (dragIndex: number, hoverIndex: number, groupId?: string) => void;
  onReorderGroups: (dragIndex: number, hoverIndex: number) => void;
  addCardToGroup: (cardId: string, groupId: string) => void;
  getUngroupedCards: () => TimelineCard[];
  onInsertCardBetween?: (afterCardId: string) => void;
  onUpdateCardOrder?: (cardId: string, newOrder: number) => void;
}

export const HierarchyView: React.FC<HierarchyViewProps> = ({
  cards,
  groups,
  onCardEdit,
  onCardDelete,
  onGroupEdit,
  onGroupDelete,
  onToggleCollapse,
  onAddCard,
  onAddGroup,
  selectedCards,
  onCardSelect,
  onReorderCards,
  onReorderGroups,
  addCardToGroup,
  getUngroupedCards,
  onInsertCardBetween,
  onUpdateCardOrder,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const ungroupedCards = getUngroupedCards();

  const handleCardClick = (card: TimelineCard, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      const newSelection = selectedCards.includes(card.id)
        ? selectedCards.filter(id => id !== card.id)
        : [...selectedCards, card.id];
      onCardSelect(newSelection);
    } else {
      onCardSelect([card.id]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Check if we're dragging a group
    const isGroup = groups.some(group => group.id === active.id);
    
    if (isGroup) {
      const oldIndex = groups.findIndex(group => group.id === active.id);
      const newIndex = groups.findIndex(group => group.id === over.id);
      onReorderGroups(oldIndex, newIndex);
    } else {
      // Handle card reordering
      const activeCard = cards.find(card => card.id === active.id);
      const overCard = cards.find(card => card.id === over.id);
      
      if (activeCard && overCard) {
        const oldIndex = cards.indexOf(activeCard);
        const newIndex = cards.indexOf(overCard);
        onReorderCards(oldIndex, newIndex);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hierarchy View</h2>
          <p className="text-sm text-gray-600">
            {groups.length} group{groups.length !== 1 ? 's' : ''} • {cards.length} card{cards.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onAddGroup}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Group
          </button>
          <button
            onClick={onAddCard}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Card
          </button>
        </div>
      </div>

      {/* Drag and Drop Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          {/* Groups */}
          <SortableContext items={groups.map(group => group.id)} strategy={verticalListSortingStrategy}>
            {groups.map(group => (
              <DraggableGroup
                key={group.id}
                group={group}
                cards={cards}
                ungroupedCards={ungroupedCards}
                onEdit={onGroupEdit}
                onDelete={onGroupDelete}
                onToggleCollapse={onToggleCollapse}
                onAddCardToGroup={addCardToGroup}
                onCardEdit={onCardEdit}
                onCardDelete={onCardDelete}
                onCardSelect={handleCardClick}
                selectedCards={selectedCards}
                onInsertCardBetween={onInsertCardBetween}
                onUpdateCardOrder={onUpdateCardOrder}
              />
            ))}
          </SortableContext>
          
          {/* Ungrouped Cards */}
          {ungroupedCards.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Ungrouped Cards ({ungroupedCards.length})
              </h3>
              <div className="space-y-3">
                <SortableContext items={ungroupedCards.map(card => card.id)} strategy={verticalListSortingStrategy}>
                  {ungroupedCards.map(card => (
                    <DraggableCard
                      key={card.id}
                      card={card}
                      isSelected={selectedCards.includes(card.id)}
                      onEdit={onCardEdit}
                      onDelete={onCardDelete}
                      onSelect={handleCardClick}
                      allCards={cards}
                      onUpdateCardOrder={onUpdateCardOrder}
                      onInsertCardBetween={onInsertCardBetween}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          )}

          {/* Empty State */}
          {groups.length === 0 && ungroupedCards.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Yet</h3>
              <p className="text-gray-600 mb-4">Start organizing your story by creating groups and cards.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={onAddGroup}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Group
                </button>
                <button
                  onClick={onAddCard}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Card
                </button>
              </div>
            </div>
          )}
        </div>
      </DndContext>
    </div>
  );
};