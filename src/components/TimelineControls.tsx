import React from 'react';
import { PenTool } from 'lucide-react';

interface TimelineControlsProps {
  viewMode: 'timeline' | 'hierarchy';
  timelineScale: 'hour' | 'day' | 'week' | 'month' | 'year';
  zoomLevel: number;
  onTimelineScaleChange: (scale: 'hour' | 'day' | 'week' | 'month' | 'year') => void;
  onZoomLevelChange: (level: number) => void;
  onAddCard: () => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  viewMode,
  timelineScale,
  zoomLevel,
  onTimelineScaleChange,
  onZoomLevelChange,
  onAddCard,
}) => {
  if (viewMode !== 'timeline') return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Scale:</label>
            <select
              value={timelineScale}
              onChange={(e) => onTimelineScaleChange(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Zoom:</label>
            <button
              onClick={() => onZoomLevelChange(zoomLevel - 0.25)}
              disabled={zoomLevel <= 0.5}
              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="text-sm font-medium text-gray-600 min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => onZoomLevelChange(zoomLevel + 0.25)}
              disabled={zoomLevel >= 3}
              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={onAddCard}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PenTool className="w-4 h-4" />
          Add Card
        </button>
      </div>
    </div>
  );
};