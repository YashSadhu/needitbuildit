import React from 'react';
import { TimelineView } from './TimelineView';
import { HierarchyView } from './HierarchyView';
import { TimelineCard, CardGroup } from '../types';

interface MainContentProps {
  viewMode: 'timeline' | 'hierarchy';
  filteredCards: TimelineCard[];
  groups: CardGroup[];
  zoomLevel: number;
  timelineScale: 'hour' | 'day' | 'week' | 'month' | 'year';
  showConcurrent: boolean;
  selectedCards: string[];
  onCardEdit: (card: TimelineCard) => void;
  onCardDelete: (cardId: string) => void;
  onCardSelect: (cardIds: string[]) => void;
  onGroupEdit: (group: CardGroup) => void;
  onGroupDelete: (groupId: string) => void;
  onToggleCollapse: (groupId: string) => void;
  onAddCard: () => void;
  onAddGroup: () => void;
  onReorderCards: (dragIndex: number, hoverIndex: number, groupId?: string) => void;
  onReorderGroups: (dragIndex: number, hoverIndex: number) => void;
  addCardToGroup: (cardId: string, groupId: string) => void;
  getUngroupedCards: () => TimelineCard[];
  onInsertCardBetween?: (afterCardId: string) => void;
  onUpdateCardOrder?: (cardId: string, newOrder: number) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  viewMode,
  filteredCards,
  groups,
  zoomLevel,
  timelineScale,
  showConcurrent,
  selectedCards,
  onCardEdit,
  onCardDelete,
  onCardSelect,
  onGroupEdit,
  onGroupDelete,
  onToggleCollapse,
  onAddCard,
  onAddGroup,
  onReorderCards,
  onReorderGroups,
  addCardToGroup,
  getUngroupedCards,
  onInsertCardBetween,
  onUpdateCardOrder,
}) => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {viewMode === 'timeline' ? (
        <TimelineView
          cards={filteredCards}
          groups={groups}
          zoomLevel={zoomLevel}
          timelineScale={timelineScale}
          showConcurrent={showConcurrent}
          onCardEdit={onCardEdit}
          onCardDelete={onCardDelete}
          onCardSelect={onCardSelect}
          selectedCards={selectedCards}
          onReorderCards={onReorderCards}
          onInsertCardBetween={onInsertCardBetween}
          onUpdateCardOrder={onUpdateCardOrder}
        />
      ) : (
        <HierarchyView
          cards={filteredCards}
          groups={groups}
          onCardEdit={onCardEdit}
          onCardDelete={onCardDelete}
          onGroupEdit={onGroupEdit}
          onGroupDelete={onGroupDelete}
          onToggleCollapse={onToggleCollapse}
          onAddCard={onAddCard}
          onAddGroup={onAddGroup}
          selectedCards={selectedCards}
          onCardSelect={onCardSelect}
          onReorderCards={onReorderCards}
          onReorderGroups={onReorderGroups}
          addCardToGroup={addCardToGroup}
          getUngroupedCards={getUngroupedCards}
          onInsertCardBetween={onInsertCardBetween}
          onUpdateCardOrder={onUpdateCardOrder}
        />
      )}
    </main>
  );
};