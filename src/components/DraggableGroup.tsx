import React, { useState } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  Plus, 
  Edit3, 
  Trash2, 
  GripVertical 
} from 'lucide-react';
import { CardGroup, TimelineCard } from '../types';
import { DraggableCard } from './DraggableCard';
import { CardSelectionModal } from './CardSelectionModal';

interface DraggableGroupProps {
  group: CardGroup;
  cards: TimelineCard[];
  ungroupedCards: TimelineCard[];
  onEdit: (group: CardGroup) => void;
  onDelete: (groupId: string) => void;
  onToggleCollapse: (groupId: string) => void;
  onAddCardToGroup: (cardId: string, groupId: string) => void;
  onCardEdit: (card: TimelineCard) => void;
  onCardDelete: (cardId: string) => void;
  onCardSelect: (card: TimelineCard, event: React.MouseEvent) => void;
  selectedCards: string[];
  onInsertCardBetween?: (afterCardId: string) => void;
  onUpdateCardOrder?: (cardId: string, newOrder: number) => void;
}

export const DraggableGroup: React.FC<DraggableGroupProps> = ({
  group,
  cards,
  ungroupedCards,
  onEdit,
  onDelete,
  onToggleCollapse,
  onAddCardToGroup,
  onCardEdit,
  onCardDelete,
  onCardSelect,
  selectedCards,
  onInsertCardBetween,
  onUpdateCardOrder,
}) => {
  const [isCardSelectionOpen, setIsCardSelectionOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const groupCards = cards.filter(card => group.cardIds.includes(card.id));

  const handleAddCard = () => {
    if (ungroupedCards.length > 0) {
      setIsCardSelectionOpen(true);
    }
  };

  const handleSelectCard = (cardId: string) => {
    onAddCardToGroup(cardId, group.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-6 transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-105 z-50' : ''
      }`}
    >
      {/* Group Header */}
      <div 
        className="group flex items-center gap-3 p-4 rounded-lg border-2 border-dashed hover:border-solid transition-all"
        style={{ 
          borderColor: group.color + '60', 
          backgroundColor: group.color + '10' 
        }}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => onToggleCollapse(group.id)}
          className="flex-shrink-0 p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
        >
          {group.isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        
        {/* Group Icon */}
        <div className="flex-shrink-0">
          <Folder className="w-6 h-6" style={{ color: group.color }} />
        </div>
        
        {/* Group Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            {group.title}
            <span className="text-sm font-normal text-gray-500 bg-white bg-opacity-50 px-2 py-1 rounded-full">
              {groupCards.length} card{groupCards.length !== 1 ? 's' : ''}
            </span>
          </h3>
          {group.description && (
            <p className="text-sm text-gray-600 mt-1">{group.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500 bg-white bg-opacity-50 px-2 py-1 rounded-full">
              {group.type}
            </span>
          </div>
        </div>

        {/* Group Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddCard}
            disabled={ungroupedCards.length === 0}
            className="p-2 text-gray-500 hover:text-blue-500 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={ungroupedCards.length === 0 ? "No ungrouped cards available" : "Add card to group"}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(group)}
            className="p-2 text-gray-500 hover:text-blue-500 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(group.id)}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Group Cards */}
      {!group.isCollapsed && (
        <div className="mt-4 space-y-3">
          <SortableContext items={groupCards.map(card => card.id)} strategy={verticalListSortingStrategy}>
            {groupCards.map(card => (
              <DraggableCard
                key={card.id}
                card={card}
                group={group}
                isSelected={selectedCards.includes(card.id)}
                onEdit={onCardEdit}
                onDelete={onCardDelete}
                onSelect={onCardSelect}
                isNested={true}
                allCards={cards}
                onUpdateCardOrder={onUpdateCardOrder}
                onInsertCardBetween={onInsertCardBetween}
              />
            ))}
          </SortableContext>
          
          {groupCards.length === 0 && (
            <div className="ml-6 text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No cards in this group</p>
              {ungroupedCards.length > 0 ? (
                <button
                  onClick={handleAddCard}
                  className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  Add a card
                </button>
              ) : (
                <p className="mt-2 text-xs text-gray-400">
                  Create some cards first or move cards from other groups
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Card Selection Modal */}
      <CardSelectionModal
        isOpen={isCardSelectionOpen}
        onClose={() => setIsCardSelectionOpen(false)}
        onSelectCard={handleSelectCard}
        availableCards={ungroupedCards}
        groupTitle={group.title}
      />
    </div>
  );
};