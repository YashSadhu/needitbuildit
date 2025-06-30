import React, { useState } from 'react';
import { Plus, Calendar, Users, BookOpen } from 'lucide-react';
import { TimelineEvent } from './TimelineEvent';
import { TimelineEvent as TimelineEventType } from '../types';

interface TimelineProps {
  events: TimelineEventType[];
  onEventEdit: (event: TimelineEventType) => void;
  onEventDelete: (eventId: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onAddEvent: () => void;
  zoomLevel: number;
}

export const Timeline: React.FC<TimelineProps> = ({
  events,
  onEventEdit,
  onEventDelete,
  onReorder,
  onAddEvent,
  zoomLevel,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      setHoveredIndex(index);
    }
  };

  const handleDrop = () => {
    if (draggedIndex !== null && hoveredIndex !== null) {
      onReorder(draggedIndex, hoveredIndex);
    }
    setDraggedIndex(null);
    setHoveredIndex(null);
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
          <p className="text-gray-600 mb-6">
            Start building your story timeline by adding your first event. Track plot points, 
            character arcs, and key moments in your narrative.
          </p>
          <button
            onClick={onAddEvent}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add First Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Story Timeline</h2>
            <p className="text-sm text-gray-600">
              {events.length} event{events.length !== 1 ? 's' : ''} in your story
            </p>
          </div>
        </div>
        
        <button
          onClick={onAddEvent}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Timeline Events */}
      <div className="relative">
        {/* Timeline Line */}
        <div 
          className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-blue-200"
          style={{ transform: `scaleX(${zoomLevel})` }}
        ></div>

        {/* Events */}
        <div className="space-y-0">
          {events.map((event, index) => (
            <div key={event.id} className="relative">
              <TimelineEvent
                event={event}
                index={index}
                onEdit={onEventEdit}
                onDelete={onEventDelete}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={draggedIndex === index}
                zoomLevel={zoomLevel}
              />
              
              {/* Timeline Node */}
              <div 
                className="absolute left-5 top-8 w-3 h-3 rounded-full border-2 border-white shadow-md z-10"
                style={{ 
                  backgroundColor: event.category.color,
                  transform: `scale(${zoomLevel})`,
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Add Event at End */}
        <div className="relative mt-6">
          <div 
            className="absolute left-5 top-4 w-3 h-3 rounded-full border-2 border-dashed border-gray-300 bg-white z-10"
            style={{ transform: `scale(${zoomLevel})` }}
          ></div>
          <button
            onClick={onAddEvent}
            className="ml-12 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-gray-500 hover:text-blue-500 w-full text-left"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'left center' }}
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add another event</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};