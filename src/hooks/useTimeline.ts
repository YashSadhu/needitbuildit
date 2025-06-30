import { useState, useEffect, useCallback } from 'react';
import { TimelineEvent, EventCategory, FilterOptions, TimelineState } from '../types';

const DEFAULT_CATEGORIES: EventCategory[] = [
  { id: '1', name: 'Plot Point', color: '#3B82F6', icon: 'bookmark' },
  { id: '2', name: 'Character Arc', color: '#8B5CF6', icon: 'user' },
  { id: '3', name: 'World Building', color: '#10B981', icon: 'globe' },
  { id: '4', name: 'Conflict', color: '#EF4444', icon: 'zap' },
  { id: '5', name: 'Resolution', color: '#F59E0B', icon: 'check-circle' },
];

const STORAGE_KEY = 'timeline-events';

export const useTimeline = () => {
  const [state, setState] = useState<TimelineState>({
    events: [],
    categories: DEFAULT_CATEGORIES,
    filters: {
      categories: [],
      dateRange: { start: '', end: '' },
      searchTerm: '',
    },
    selectedEvent: null,
    isAddModalOpen: false,
    zoomLevel: 1,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const events = JSON.parse(stored);
        setState(prev => ({ ...prev, events }));
      } catch (error) {
        console.error('Error loading stored events:', error);
      }
    }
  }, []);

  // Save to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
  }, [state.events]);

  const addEvent = useCallback((event: Omit<TimelineEvent, 'id' | 'order'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: crypto.randomUUID(),
      order: state.events.length,
    };

    setState(prev => ({
      ...prev,
      events: [...prev.events, newEvent].sort((a, b) => 
        new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
      ),
      isAddModalOpen: false,
    }));
  }, [state.events.length]);

  const updateEvent = useCallback((updatedEvent: TimelineEvent) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ).sort((a, b) => 
        new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
      ),
      selectedEvent: null,
    }));
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setState(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== eventId),
      selectedEvent: null,
    }));
  }, []);

  const reorderEvents = useCallback((dragIndex: number, hoverIndex: number) => {
    setState(prev => {
      const dragEvent = prev.events[dragIndex];
      const newEvents = [...prev.events];
      newEvents.splice(dragIndex, 1);
      newEvents.splice(hoverIndex, 0, dragEvent);
      
      return {
        ...prev,
        events: newEvents.map((event, index) => ({ ...event, order: index })),
      };
    });
  }, []);

  const setFilters = useCallback((filters: Partial<FilterOptions>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const setSelectedEvent = useCallback((event: TimelineEvent | null) => {
    setState(prev => ({ ...prev, selectedEvent: event }));
  }, []);

  const setAddModalOpen = useCallback((isOpen: boolean) => {
    setState(prev => ({ ...prev, isAddModalOpen: isOpen }));
  }, []);

  const setZoomLevel = useCallback((level: number) => {
    setState(prev => ({ ...prev, zoomLevel: Math.max(0.5, Math.min(3, level)) }));
  }, []);

  const getFilteredEvents = useCallback(() => {
    return state.events.filter(event => {
      // Category filter
      if (state.filters.categories.length > 0 && 
          !state.filters.categories.includes(event.category.id)) {
        return false;
      }

      // Date range filter
      if (state.filters.dateRange.start || state.filters.dateRange.end) {
        const eventDate = new Date(event.date);
        const startDate = state.filters.dateRange.start ? new Date(state.filters.dateRange.start) : null;
        const endDate = state.filters.dateRange.end ? new Date(state.filters.dateRange.end) : null;

        if (startDate && eventDate < startDate) return false;
        if (endDate && eventDate > endDate) return false;
      }

      // Search term filter
      if (state.filters.searchTerm) {
        const searchLower = state.filters.searchTerm.toLowerCase();
        return (
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.notes?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [state.events, state.filters]);

  return {
    ...state,
    addEvent,
    updateEvent,
    deleteEvent,
    reorderEvents,
    setFilters,
    setSelectedEvent,
    setAddModalOpen,
    setZoomLevel,
    getFilteredEvents,
  };
};