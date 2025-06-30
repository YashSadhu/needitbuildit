import { useCallback } from 'react';
import { CardGroup, TimelineCard } from '../types';

export const useGroupOperations = (
  groups: CardGroup[],
  setGroups: (groups: CardGroup[] | ((prev: CardGroup[]) => CardGroup[])) => void,
  setCards: (cards: TimelineCard[] | ((prev: TimelineCard[]) => TimelineCard[])) => void
) => {
  const addGroup = useCallback((groupData: Omit<CardGroup, 'id' | 'order' | 'cardIds'>) => {
    const newGroup: CardGroup = {
      ...groupData,
      id: crypto.randomUUID(),
      order: groups.length,
      cardIds: [],
    };

    setGroups(prev => [...prev, newGroup]);
  }, [groups.length, setGroups]);

  const updateGroup = useCallback((groupId: string, updates: Partial<CardGroup>) => {
    setGroups(prev => prev.map(group =>
      group.id === groupId ? { ...group, ...updates } : group
    ));
  }, [setGroups]);

  const deleteGroup = useCallback((groupId: string) => {
    const groupToDelete = groups.find(g => g.id === groupId);
    if (groupToDelete) {
      setCards(prev => prev.map(card =>
        groupToDelete.cardIds.includes(card.id)
          ? { ...card, parentId: undefined }
          : card
      ));
    }

    setGroups(prev => prev.filter(group => group.id !== groupId));
  }, [groups, setCards, setGroups]);

  const toggleGroupCollapse = useCallback((groupId: string) => {
    setGroups(prev => prev.map(group =>
      group.id === groupId ? { ...group, isCollapsed: !group.isCollapsed } : group
    ));
  }, [setGroups]);

  const addCardToGroup = useCallback((cardId: string, groupId: string) => {
    setGroups(prev => prev.map(group => ({
      ...group,
      cardIds: group.cardIds.filter(id => id !== cardId)
    })));

    setGroups(prev => prev.map(group =>
      group.id === groupId
        ? { ...group, cardIds: [...group.cardIds, cardId] }
        : group
    ));

    setCards(prev => prev.map(card =>
      card.id === cardId
        ? { ...card, parentId: groupId, updatedAt: new Date().toISOString() }
        : card
    ));
  }, [setCards, setGroups]);

  const removeCardFromGroup = useCallback((cardId: string) => {
    setGroups(prev => prev.map(group => ({
      ...group,
      cardIds: group.cardIds.filter(id => id !== cardId)
    })));

    setCards(prev => prev.map(card =>
      card.id === cardId
        ? { ...card, parentId: undefined, updatedAt: new Date().toISOString() }
        : card
    ));
  }, [setCards, setGroups]);

  const reorderGroups = useCallback((dragIndex: number, hoverIndex: number) => {
    setGroups(prev => {
      const newGroups = [...prev];
      const draggedGroup = newGroups[dragIndex];
      newGroups.splice(dragIndex, 1);
      newGroups.splice(hoverIndex, 0, draggedGroup);

      return newGroups.map((group, index) => ({ ...group, order: index }));
    });
  }, [setGroups]);

  return {
    addGroup,
    updateGroup,
    deleteGroup,
    toggleGroupCollapse,
    addCardToGroup,
    removeCardFromGroup,
    reorderGroups,
  };
};