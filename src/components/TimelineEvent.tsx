import React, { useRef } from 'react';
import { format } from 'date-fns';
import { 
  Clock, 
  Edit3, 
  Trash2, 
  FileText, 
  Bookmark,
  User,
  Globe,
  Zap,
  CheckCircle,
  GripVertical
} from 'lucide-react';
import { TimelineEvent as TimelineEventType } from '../types';

interface TimelineEventProps {
  event: TimelineEventType;
  index: number;
  onEdit: (event: TimelineEventType) => void;
  onDelete: (eventId: string) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: () => void;
  isDragging: boolean;
  zoomLevel: number;
}

const getEventIcon = (iconName: string) => {
  const icons = {
    bookmark: Bookmark,
    user: User,
    globe: Globe,
    zap: Zap,
    'check-circle': CheckCircle,
  };
  const Icon = icons[iconName as keyof typeof icons] || Bookmark;
  return <Icon className="w-4 h-4" />;
};

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  index,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  zoomLevel,
}) => {
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
  };

  const eventDate = new Date(event.date + ' ' + event.time);
  const formattedDate = format(eventDate, 'MMM dd, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');

  return (
    <div
      ref={dragRef}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`group relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 ${
        isDragging 
          ? 'border-blue-300 shadow-lg scale-105 opacity-50' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      style={{
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'left center',
        margin: `${8 * zoomLevel}px 0`,
      }}
    >
      {/* Drag Handle */}
      <div className="absolute left-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Event Content */}
      <div className="p-6 pl-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white"
              style={{ backgroundColor: event.category.color }}
            >
              {getEventIcon(event.category.icon)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formattedDate} at {formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(event)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Badge */}
        <div className="mb-3">
          <span 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: event.category.color }}
          >
            {event.category.name}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>

        {/* Notes */}
        {event.notes && (
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Notes</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{event.notes}</p>
          </div>
        )}

        {/* Attachments */}
        {event.attachments && event.attachments.length > 0 && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Attachments ({event.attachments.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.attachments.map((attachment, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {attachment}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timeline Connector */}
      <div className="absolute left-6 -bottom-4 w-0.5 h-4 bg-gray-300"></div>
    </div>
  );
};