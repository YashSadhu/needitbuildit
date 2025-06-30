import { useCallback } from 'react';
import { TimelineCard, CardGroup } from '../types';

export const useCardOperations = (
  cards: TimelineCard[],
  setCards: (cards: TimelineCard[] | ((prev: TimelineCard[]) => TimelineCard[])) => void,
  groups: CardGroup[],
  setGroups: (groups: CardGroup[] | ((prev: CardGroup[]) => CardGroup[])) => void
) => {
  const addCard = useCallback((cardData: Omit<TimelineCard, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => {
    const newCard: TimelineCard = {
      ...cardData,
      id: crypto.randomUUID(),
      order: cards.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCards(prev => [...prev, newCard]);

    if (cardData.parentId) {
      setGroups(prev => prev.map(group =>
        group.id === cardData.parentId
          ? { ...group, cardIds: [...group.cardIds, newCard.id] }
          : group
      ));
    }
  }, [cards.length, setCards, setGroups]);

  const updateCard = useCallback((cardId: string, updates: Partial<TimelineCard>) => {
    setCards(prev => prev.map(card =>
      card.id === cardId
        ? { ...card, ...updates, updatedAt: new Date().toISOString() }
        : card
    ));

    if (updates.parentId !== undefined) {
      setGroups(prev => {
        let newGroups = prev.map(group => ({
          ...group,
          cardIds: group.cardIds.filter(id => id !== cardId)
        }));

        if (updates.parentId) {
          newGroups = newGroups.map(group =>
            group.id === updates.parentId
              ? { ...group, cardIds: [...group.cardIds, cardId] }
              : group
          );
        }

        return newGroups;
      });
    }
  }, [setCards, setGroups]);

  const deleteCard = useCallback((cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
    setGroups(prev => prev.map(group => ({
      ...group,
      cardIds: group.cardIds.filter(id => id !== cardId)
    })));
  }, [setCards, setGroups]);

  const reorderCards = useCallback((dragIndex: number, hoverIndex: number, groupId?: string) => {
    if (groupId) {
      setGroups(prev => prev.map(group => {
        if (group.id !== groupId) return group;

        const newCardIds = [...group.cardIds];
        const draggedId = newCardIds[dragIndex];
        newCardIds.splice(dragIndex, 1);
        newCardIds.splice(hoverIndex, 0, draggedId);

        return { ...group, cardIds: newCardIds };
      }));
    } else {
      setCards(prev => {
        const newCards = [...prev];
        const draggedCard = newCards[dragIndex];
        newCards.splice(dragIndex, 1);
        newCards.splice(hoverIndex, 0, draggedCard);

        return newCards.map((card, index) => ({ ...card, order: index }));
      });
    }
  }, [setCards, setGroups]);

  const updateCardOrder = useCallback((cardId: string, newOrder: number) => {
    setCards(prev => {
      const cards = [...prev];
      const cardIndex = cards.findIndex(card => card.id === cardId);
      
      if (cardIndex === -1) return prev;
      
      const card = cards[cardIndex];
      cards.splice(cardIndex, 1);
      cards.splice(newOrder, 0, card);
      
      return cards.map((card, index) => ({
        ...card,
        order: index,
        updatedAt: new Date().toISOString()
      }));
    });
  }, [setCards]);

  const insertCardBetween = useCallback((afterCardId: string) => {
    const sortedCards = [...cards].sort((a, b) => a.order - b.order);
    const afterIndex = sortedCards.findIndex(card => card.id === afterCardId);
    
    if (afterIndex === -1) return;
    
    const newCard: TimelineCard = {
      id: crypto.randomUUID(),
      title: 'New Card',
      description: '',
      order: afterIndex + 1,
      metadata: {
        tags: [],
        status: 'draft',
        customFields: {}
      },
      timeInfo: {
        type: 'absolute',
        absoluteDate: new Date().toISOString().split('T')[0],
        absoluteTime: new Date().toTimeString().slice(0, 5),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedCards = [
      ...sortedCards.slice(0, afterIndex + 1),
      newCard,
      ...sortedCards.slice(afterIndex + 1)
    ].map((card, index) => ({
      ...card,
      order: index
    }));

    setCards(updatedCards);
    return newCard;
  }, [cards, setCards]);

  return {
    addCard,
    updateCard,
    deleteCard,
    reorderCards,
    updateCardOrder,
    insertCardBetween,
  };
};