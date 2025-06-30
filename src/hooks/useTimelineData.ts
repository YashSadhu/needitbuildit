import { useCallback } from 'react';
import { TimelineCard, CardGroup, MetadataTemplate, SearchQuery, ResearchNote } from '../types';
import { useLocalStorage } from './useLocalStorage';

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
};

export const useTimelineData = () => {
  const [cards, setCards] = useLocalStorage<TimelineCard[]>(STORAGE_KEYS.CARDS, []);
  const [groups, setGroups] = useLocalStorage<CardGroup[]>(STORAGE_KEYS.GROUPS, DEFAULT_GROUPS);
  const [metadataTemplates, setMetadataTemplates] = useLocalStorage<MetadataTemplate[]>(STORAGE_KEYS.TEMPLATES, DEFAULT_TEMPLATES);
  const [savedSearches, setSavedSearches] = useLocalStorage<SearchQuery[]>(STORAGE_KEYS.SEARCHES, []);
  const [researchNotes, setResearchNotes] = useLocalStorage<ResearchNote[]>(STORAGE_KEYS.NOTES, DEFAULT_RESEARCH_NOTES);

  return {
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
  };
};