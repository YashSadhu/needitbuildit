export interface TimelineCard {
  id: string;
  title: string;
  description: string;
  content?: string;
  parentId?: string; // For nested cards
  order: number;
  metadata: CardMetadata;
  timeInfo: TimeInfo;
  createdAt: string;
  updatedAt: string;
}

export interface CardGroup {
  id: string;
  title: string;
  description: string;
  type: 'event' | 'chapter' | 'act' | 'custom';
  isCollapsed: boolean;
  order: number;
  color: string;
  cardIds: string[];
}

export interface CardMetadata {
  tags: string[];
  label?: string;
  pointOfView?: string;
  location?: string;
  status: 'draft' | 'review' | 'final' | 'archived';
  customFields: Record<string, any>;
}

export interface TimeInfo {
  type: 'absolute' | 'relative' | 'story';
  absoluteDate?: string;
  absoluteTime?: string;
  relativeValue?: number;
  relativeUnit?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
  relativeReference?: string;
  storyUnit?: string;
  storyValue?: string;
  isFlashback?: boolean;
  isConcurrent?: boolean;
  concurrentGroup?: string;
}

export interface MetadataTemplate {
  id: string;
  name: string;
  description: string;
  fields: Partial<CardMetadata>;
}

export interface SearchQuery {
  id?: string;
  name?: string;
  text: string;
  filters: SearchFilters;
  saved: boolean;
}

export interface SearchFilters {
  tags: string[];
  labels: string[];
  pointOfView: string[];
  locations: string[];
  status: string[];
  timeType: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  groups: string[];
  customFields: Record<string, any>;
}

export interface ResearchNote {
  id: string;
  title: string;
  content: string;
  category: 'research' | 'ideas' | 'characters' | 'worldbuilding' | 'plot' | 'general';
  tags: string[];
  links: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TimelineState {
  cards: TimelineCard[];
  groups: CardGroup[];
  metadataTemplates: MetadataTemplate[];
  savedSearches: SearchQuery[];
  activeFilters: SearchFilters;
  searchTerm: string;
  selectedCards: string[];
  viewMode: 'timeline' | 'cards' | 'hierarchy';
  zoomLevel: number;
  timelineScale: 'hour' | 'day' | 'week' | 'month' | 'year';
  showConcurrent: boolean;
  isAddModalOpen: boolean;
  isGroupModalOpen: boolean;
  isBulkEditOpen: boolean;
  selectedCard: TimelineCard | null;
  selectedGroup: CardGroup | null;
  researchNotes: ResearchNote[];
}

export interface EventCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface FilterOptions {
  categories: string[];
  dateRange: {
    start: string;
    end: string;
  };
  searchTerm: string;
}

// Legacy types for backward compatibility
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: EventCategory;
  notes?: string;
  attachments?: string[];
  order: number;
}