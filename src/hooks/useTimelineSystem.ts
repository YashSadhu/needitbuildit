import { useState, useCallback } from 'react';
import { 
  TimelineCard, 
  CardGroup, 
  MetadataTemplate, 
  SearchQuery, 
  SearchFilters, 
  CardMetadata,
  ResearchNote
} from '../types';
import { useTimelineData } from './useTimelineData';
import { useCardOperations } from './useCardOperations';
import { useGroupOperations } from './useGroupOperations';
import { useDataValidation } from './useDataValidation';
import { useAutoSave } from './useAutoSave';

export const useTimelineSystem = () => {
  const { validateData } = useDataValidation();
  
  const {
    cards,
    setCards,
    groups,
    setGroups,
    metadataTemplates,
    setMetadataTemplates,
    savedSearches,
    setSavedSearches,
    researchNotes,
    setResearchNotes,
  } = useTimelineData();

  const cardOperations = useCardOperations(cards, setCards, groups, setGroups);
  const groupOperations = useGroupOperations(groups, setGroups, setCards);

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
    ...cardOperations,
    
    // Group operations
    ...groupOperations,
    
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