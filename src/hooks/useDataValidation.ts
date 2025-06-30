import { useCallback } from 'react';
import { TimelineCard, CardGroup, ResearchNote } from '../types';

export const useDataValidation = () => {
  const validateCard = useCallback((card: any): card is TimelineCard => {
    return (
      typeof card === 'object' &&
      card !== null &&
      typeof card.id === 'string' &&
      typeof card.title === 'string' &&
      typeof card.description === 'string' &&
      typeof card.order === 'number' &&
      typeof card.metadata === 'object' &&
      typeof card.timeInfo === 'object' &&
      typeof card.createdAt === 'string' &&
      typeof card.updatedAt === 'string'
    );
  }, []);

  const validateGroup = useCallback((group: any): group is CardGroup => {
    return (
      typeof group === 'object' &&
      group !== null &&
      typeof group.id === 'string' &&
      typeof group.title === 'string' &&
      typeof group.description === 'string' &&
      typeof group.type === 'string' &&
      typeof group.isCollapsed === 'boolean' &&
      typeof group.order === 'number' &&
      typeof group.color === 'string' &&
      Array.isArray(group.cardIds)
    );
  }, []);

  const validateNote = useCallback((note: any): note is ResearchNote => {
    return (
      typeof note === 'object' &&
      note !== null &&
      typeof note.id === 'string' &&
      typeof note.title === 'string' &&
      typeof note.content === 'string' &&
      typeof note.category === 'string' &&
      Array.isArray(note.tags) &&
      Array.isArray(note.links) &&
      typeof note.createdAt === 'string' &&
      typeof note.updatedAt === 'string'
    );
  }, []);

  const validateData = useCallback((data: any) => {
    const errors: string[] = [];

    if (data.cards && Array.isArray(data.cards)) {
      data.cards.forEach((card: any, index: number) => {
        if (!validateCard(card)) {
          errors.push(`Invalid card at index ${index}`);
        }
      });
    }

    if (data.groups && Array.isArray(data.groups)) {
      data.groups.forEach((group: any, index: number) => {
        if (!validateGroup(group)) {
          errors.push(`Invalid group at index ${index}`);
        }
      });
    }

    if (data.researchNotes && Array.isArray(data.researchNotes)) {
      data.researchNotes.forEach((note: any, index: number) => {
        if (!validateNote(note)) {
          errors.push(`Invalid research note at index ${index}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [validateCard, validateGroup, validateNote]);

  return {
    validateCard,
    validateGroup,
    validateNote,
    validateData,
  };
};