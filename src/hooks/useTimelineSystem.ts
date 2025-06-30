import { useState, useEffect, useCallback } from 'react';
import { 
  TimelineCard, 
  CardGroup, 
  MetadataTemplate, 
  SearchQuery, 
  SearchFilters, 
  TimelineState,
  CardMetadata,
  TimeInfo,
  ResearchNote
} from '../types';
import { useLocalStorage } from './useLocalStorage';
import { useDataValidation } from './useDataValidation';
import { useAutoSave } from './useAutoSave';

const DEFAULT_TEMPLATES: MetadataTemplate[] = [
  {
    id: '1',
    name: 'Character Scene',
    description: 'Template for character-focused scenes',
    fields: {
      tags: ['character-development'],
      status: 'draft',
      customFields: { importance: 'medium' }
    }
  },
  {
    id: '2',
    name: 'Action Sequence',
    description: 'Template for action scenes',
    fields: {
      tags: ['action', 'plot-critical'],
      status: 'draft',
      customFields: { pacing: 'fast', tension: 'high' }
    }
  },
  {
    id: '3',
    name: 'Dialogue Scene',
    description: 'Template for dialogue-heavy scenes',
    fields: {
      tags: ['dialogue', 'character-interaction'],
      status: 'draft',
      customFields: { mood: 'neutral' }
    }
  }
];

const DEFAULT_GROUPS: CardGroup[] = [
  {
    id: '1',
    title: 'Act I - Setup',
    description: 'Introduction and setup of the story',
    type: 'act',
    isCollapsed: false,
    order: 0,
    color: '#3B82F6',
    cardIds: []
  },
  {
    id: '2',
    title: 'Act II - Confrontation',
    description: 'Main conflict and development',
    type: 'act',
    isCollapsed: false,
    order: 1,
    color: '#8B5CF6',
    cardIds: []
  },
  {
    id: '3',
    title: 'Act III - Resolution',
    description: 'Climax and resolution',
    type: 'act',
    isCollapsed: false,
    order: 2,
    color: '#10B981',
    cardIds: []
  }
];

const DEFAULT_RESEARCH_NOTES: ResearchNote[] = [
  {
    id: '1',
    title: 'Getting Started with Research Notes',
    content: `Welcome to the Research & Notes section! This is your flexible workspace for:

• Research materials and sources
• Character backstories and development notes
• World-building details and lore
• Plot ideas and brainstorming
• General notes that don't fit into specific cards

You can organize your notes by categories, add tags for easy searching, and include links to external resources. This helps keep all your story planning materials in one place.

Feel free to edit or delete this note and start adding your own research and ideas!`,
    category: 'general',
    tags: ['tutorial', 'getting-started'],
    links: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const STORAGE_KEYS = {
  CARDS: 'timeline-cards',
  GROUPS: 'timeline-groups',
  TEMPLATES: 'timeline-templates',
  SEARCHES: 'timeline-searches',
  NOTES: 'timeline-research-notes',
  SETTINGS: 'timeline-settings',
};

export const useTimelineSystem = () => {
  const { validateData } = useDataValidation();

  // Separate localStorage hooks for different data types
  const [cards, setCards] = useLocalStorage<TimelineCard[]>(STORAGE_KEYS.CARDS, []);
  const [groups, setGroups] = useLocalStorage<CardGroup[]>(STORAGE_KEYS.GROUPS, DEFAULT_GROUPS);
  const [metadataTemplates, setMetadataTemplates] = useLocalStorage<MetadataTemplate[]>(STORAGE_KEYS.TEMPLATES, DEFAULT_TEMPLATES);
  const [savedSearches, setSavedSearches] = useLocalStorage<SearchQuery[]>(STORAGE_KEYS.SEARCHES, []);
  const [researchNotes, setResearchNotes] = useLocalStorage<ResearchNote[]>(STORAGE_KEYS.NOTES, DEFAULT_RESEARCH_NOTES);

  // Session state (not persisted)
  const [state, setState] = useState({
    activeFilters: {
      tags: [],
      labels: [],
      pointOfView: [],
      locations: [],
      status: [],
      timeType: [],
      groups: [],
      customFields: {}
    } as SearchFilters,
    searchTerm: '',
    selectedCards: [] as string[],
    viewMode: 'timeline' as 'timeline' | 'cards' | 'hierarchy',
    zoomLevel: 1,
    timelineScale: 'day' as 'hour' | 'day' | 'week' | 'month' | 'year',
    showConcurrent: true,
    isAddModalOpen: false,
    isGroupModalOpen: false,
    isBulkEditOpen: false,
    selectedCard: null as TimelineCard | null,
    selectedGroup: null as CardGroup | null,
  });

  // Auto-save functionality
  useAutoSave(
    { cards, groups, metadataTemplates, savedSearches, researchNotes },
    (data) => {
      const validation = validateData(data);
      if (!validation.isValid) {
        console.warn('Data validation failed:', validation.errors);
      }
    },
    {
      delay: 2000,
      onSave: () => console.log('Data auto-saved'),
      onError: (error) => console.error('Auto-save failed:', error),
    }
  );

  // Card operations
  const addCard = useCallback((cardData: Omit<TimelineCard, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => {
    const newCard: TimelineCard = {
      ...cardData,
      id: crypto.randomUUID(),
      order: cards.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCards(prev => [...prev, newCard]);

    // If card is assigned to a group, add it to the group's cardIds
    if (cardData.parentId) {
      setGroups(prev => prev.map(group =>
        group.id === cardData.parentId
          ? { ...group, cardIds: [...group.cardIds, newCard.id] }
          : group
      ));
    }

    setState(prev => ({ ...prev, isAddModalOpen: false }));
  }, [cards.length, setCards, setGroups]);

  const updateCard = useCallback((cardId: string, updates: Partial<TimelineCard>) => {
    setCards(prev => prev.map(card =>
      card.id === cardId
        ? { ...card, ...updates, updatedAt: new Date().toISOString() }
        : card
    ));

    // Handle group assignment changes
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
      // Reorder within a group
      setGroups(prev => prev.map(group => {
        if (group.id !== groupId) return group;

        const newCardIds = [...group.cardIds];
        const draggedId = newCardIds[dragIndex];
        newCardIds.splice(dragIndex, 1);
        newCardIds.splice(hoverIndex, 0, draggedId);

        return { ...group, cardIds: newCardIds };
      }));
    } else {
      // Reorder in main timeline
      setCards(prev => {
        const newCards = [...prev];
        const draggedCard = newCards[dragIndex];
        newCards.splice(dragIndex, 1);
        newCards.splice(hoverIndex, 0, draggedCard);

        return newCards.map((card, index) => ({ ...card, order: index }));
      });
    }
  }, [setCards, setGroups]);

  // New card ordering functions
  const updateCardOrder = useCallback((cardId: string, newOrder: number) => {
    setCards(prev => {
      const cards = [...prev];
      const cardIndex = cards.findIndex(card => card.id === cardId);
      
      if (cardIndex === -1) return prev;
      
      const card = cards[cardIndex];
      cards.splice(cardIndex, 1);
      cards.splice(newOrder, 0, card);
      
      // Update all order values
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

    // Insert the new card and update all subsequent orders
    const updatedCards = [
      ...sortedCards.slice(0, afterIndex + 1),
      newCard,
      ...sortedCards.slice(afterIndex + 1)
    ].map((card, index) => ({
      ...card,
      order: index
    }));

    setCards(updatedCards);
    setState(prev => ({
      ...prev,
      selectedCard: newCard,
      isAddModalOpen: true,
    }));
  }, [cards, setCards]);

  // Group operations
  const addGroup = useCallback((groupData: Omit<CardGroup, 'id' | 'order' | 'cardIds'>) => {
    const newGroup: CardGroup = {
      ...groupData,
      id: crypto.randomUUID(),
      order: groups.length,
      cardIds: [],
    };

    setGroups(prev => [...prev, newGroup]);
    setState(prev => ({ ...prev, isGroupModalOpen: false }));
  }, [groups.length, setGroups]);

  const updateGroup = useCallback((groupId: string, updates: Partial<CardGroup>) => {
    setGroups(prev => prev.map(group =>
      group.id === groupId ? { ...group, ...updates } : group
    ));
  }, [setGroups]);

  const deleteGroup = useCallback((groupId: string) => {
    // Remove parentId from cards that were in this group
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
    // Remove card from all groups first
    setGroups(prev => prev.map(group => ({
      ...group,
      cardIds: group.cardIds.filter(id => id !== cardId)
    })));

    // Add card to the specified group
    setGroups(prev => prev.map(group =>
      group.id === groupId
        ? { ...group, cardIds: [...group.cardIds, cardId] }
        : group
    ));

    // Update card's parentId
    setCards(prev => prev.map(card =>
      card.id === cardId
        ? { ...card, parentId: groupId, updatedAt: new Date().toISOString() }
        : card
    ));
  }, [setCards, setGroups]);

  const removeCardFromGroup = useCallback((cardId: string) => {
    // Remove card from all groups
    setGroups(prev => prev.map(group => ({
      ...group,
      cardIds: group.cardIds.filter(id => id !== cardId)
    })));

    // Update card's parentId
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

  // Research notes operations
  const updateResearchNotes = useCallback((notes: ResearchNote[]) => {
    setResearchNotes(notes);
  }, [setResearchNotes]);

  // Search and filter operations
  const setSearchTerm = useCallback((term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const setActiveFilters = useCallback((filters: Partial<SearchFilters>) => {
    setState(prev => ({
      ...prev,
      activeFilters: { ...prev.activeFilters, ...filters },
    }));
  }, []);

  const saveSearch = useCallback((query: Omit<SearchQuery, 'id'>) => {
    const newQuery: SearchQuery = {
      ...query,
      id: crypto.randomUUID(),
      saved: true,
    };

    setSavedSearches(prev => [...prev, newQuery]);
  }, [setSavedSearches]);

  const deleteSearch = useCallback((queryId: string) => {
    setSavedSearches(prev => prev.filter(query => query.id !== queryId));
  }, [setSavedSearches]);

  // Bulk operations
  const bulkUpdateMetadata = useCallback((cardIds: string[], metadata: Partial<CardMetadata>) => {
    setCards(prev => prev.map(card =>
      cardIds.includes(card.id)
        ? {
            ...card,
            metadata: { ...card.metadata, ...metadata },
            updatedAt: new Date().toISOString(),
          }
        : card
    ));
  }, [setCards]);

  const selectCards = useCallback((cardIds: string[]) => {
    setState(prev => ({ ...prev, selectedCards: cardIds }));
  }, []);

  // Template operations
  const addTemplate = useCallback((template: Omit<MetadataTemplate, 'id'>) => {
    const newTemplate: MetadataTemplate = {
      ...template,
      id: crypto.randomUUID(),
    };

    setMetadataTemplates(prev => [...prev, newTemplate]);
  }, [setMetadataTemplates]);

  const applyTemplate = useCallback((cardIds: string[], templateId: string) => {
    const template = metadataTemplates.find(t => t.id === templateId);
    if (!template) return;

    bulkUpdateMetadata(cardIds, template.fields);
  }, [metadataTemplates, bulkUpdateMetadata]);

  // View operations
  const setViewMode = useCallback((mode: 'timeline' | 'cards' | 'hierarchy') => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const setZoomLevel = useCallback((level: number) => {
    setState(prev => ({ ...prev, zoomLevel: Math.max(0.5, Math.min(3, level)) }));
  }, []);

  const setTimelineScale = useCallback((scale: 'hour' | 'day' | 'week' | 'month' | 'year') => {
    setState(prev => ({ ...prev, timelineScale: scale }));
  }, []);

  // Modal operations
  const setAddModalOpen = useCallback((isOpen: boolean) => {
    setState(prev => ({ ...prev, isAddModalOpen: isOpen }));
  }, []);

  const setGroupModalOpen = useCallback((isOpen: boolean) => {
    setState(prev => ({ ...prev, isGroupModalOpen: isOpen }));
  }, []);

  const setBulkEditOpen = useCallback((isOpen: boolean) => {
    setState(prev => ({ ...prev, isBulkEditOpen: isOpen }));
  }, []);

  const setSelectedCard = useCallback((card: TimelineCard | null) => {
    setState(prev => ({ ...prev, selectedCard: card }));
  }, []);

  const setSelectedGroup = useCallback((group: CardGroup | null) => {
    setState(prev => ({ ...prev, selectedGroup: group }));
  }, []);

  // Get filtered and sorted data
  const getFilteredCards = useCallback(() => {
    return cards.filter(card => {
      // Search term filter
      if (state.searchTerm) {
        const searchLower = state.searchTerm.toLowerCase();
        const matchesSearch = 
          card.title.toLowerCase().includes(searchLower) ||
          card.description.toLowerCase().includes(searchLower) ||
          card.content?.toLowerCase().includes(searchLower) ||
          card.metadata.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          card.metadata.location?.toLowerCase().includes(searchLower) ||
          card.metadata.pointOfView?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Active filters
      const { activeFilters } = state;
      
      if (activeFilters.tags.length > 0) {
        const hasMatchingTag = activeFilters.tags.some(tag => 
          card.metadata.tags.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      if (activeFilters.status.length > 0 && !activeFilters.status.includes(card.metadata.status)) {
        return false;
      }

      if (activeFilters.labels.length > 0 && card.metadata.label && !activeFilters.labels.includes(card.metadata.label)) {
        return false;
      }

      if (activeFilters.pointOfView.length > 0 && card.metadata.pointOfView && !activeFilters.pointOfView.includes(card.metadata.pointOfView)) {
        return false;
      }

      if (activeFilters.locations.length > 0 && card.metadata.location && !activeFilters.locations.includes(card.metadata.location)) {
        return false;
      }

      if (activeFilters.timeType.length > 0 && !activeFilters.timeType.includes(card.timeInfo.type)) {
        return false;
      }

      // Date range filter for absolute dates
      if (activeFilters.dateRange && card.timeInfo.type === 'absolute' && card.timeInfo.absoluteDate) {
        const cardDate = new Date(card.timeInfo.absoluteDate);
        const startDate = activeFilters.dateRange.start ? new Date(activeFilters.dateRange.start) : null;
        const endDate = activeFilters.dateRange.end ? new Date(activeFilters.dateRange.end) : null;

        if (startDate && cardDate < startDate) return false;
        if (endDate && cardDate > endDate) return false;
      }

      return true;
    });
  }, [cards, state.searchTerm, state.activeFilters]);

  const getUniqueValues = useCallback(() => {
    const tags = new Set<string>();
    const labels = new Set<string>();
    const pointOfViews = new Set<string>();
    const locations = new Set<string>();
    const statuses = new Set<string>();

    cards.forEach(card => {
      card.metadata.tags.forEach(tag => tags.add(tag));
      if (card.metadata.label) labels.add(card.metadata.label);
      if (card.metadata.pointOfView) pointOfViews.add(card.metadata.pointOfView);
      if (card.metadata.location) locations.add(card.metadata.location);
      statuses.add(card.metadata.status);
    });

    return {
      tags: Array.from(tags).sort(),
      labels: Array.from(labels).sort(),
      pointOfViews: Array.from(pointOfViews).sort(),
      locations: Array.from(locations).sort(),
      statuses: Array.from(statuses).sort(),
    };
  }, [cards]);

  const getUngroupedCards = useCallback(() => {
    return cards.filter(card => !card.parentId);
  }, [cards]);

  return {
    // Data
    cards,
    groups,
    metadataTemplates,
    savedSearches,
    researchNotes,
    
    // State
    ...state,
    
    // Card operations
    addCard,
    updateCard,
    deleteCard,
    reorderCards,
    updateCardOrder,
    insertCardBetween,
    
    // Group operations
    addGroup,
    updateGroup,
    deleteGroup,
    toggleGroupCollapse,
    addCardToGroup,
    removeCardFromGroup,
    reorderGroups,
    
    // Research notes
    updateResearchNotes,
    
    // Search and filter
    setSearchTerm,
    setActiveFilters,
    saveSearch,
    deleteSearch,
    
    // Bulk operations
    bulkUpdateMetadata,
    selectCards,
    
    // Templates
    addTemplate,
    applyTemplate,
    
    // View operations
    setViewMode,
    setZoomLevel,
    setTimelineScale,
    
    // Modal operations
    setAddModalOpen,
    setGroupModalOpen,
    setBulkEditOpen,
    setSelectedCard,
    setSelectedGroup,
    
    // Computed data
    getFilteredCards,
    getUniqueValues,
    getUngroupedCards,
  };
};