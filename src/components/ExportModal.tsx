import React, { useState } from 'react';
import { X, Download, FileText, FileJson, FileImage } from 'lucide-react';
import { TimelineCard, CardGroup } from '../types';
import { useExport } from '../hooks/useExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: TimelineCard[];
  groups: CardGroup[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  cards,
  groups,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'txt' | 'pdf'>('json');
  const { exportAsJSON, exportAsTXT, exportAsPDF } = useExport();

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      switch (exportFormat) {
        case 'json':
          exportAsJSON(cards, groups);
          break;
        case 'txt':
          exportAsTXT(cards, groups);
          break;
        case 'pdf':
          await exportAsPDF(cards, groups);
          break;
      }
      
      // Close modal after successful export
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const formatDescriptions = {
    json: 'Complete data export including all metadata, perfect for backup or importing into other systems.',
    txt: 'Human-readable text format, ideal for sharing or printing. Organized by groups with full card details.',
    pdf: 'Professional PDF document with formatted layout, perfect for presentations or archival purposes.'
  };

  const formatIcons = {
    json: FileJson,
    txt: FileText,
    pdf: FileImage,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-500" />
            Export Timeline
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Statistics */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Export Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Cards:</span>
                <span className="font-medium text-blue-900 ml-2">{cards.length}</span>
              </div>
              <div>
                <span className="text-blue-700">Groups:</span>
                <span className="font-medium text-blue-900 ml-2">{groups.length}</span>
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="space-y-3">
              {(['json', 'txt', 'pdf'] as const).map((format) => {
                const Icon = formatIcons[format];
                return (
                  <label
                    key={format}
                    className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      exportFormat === format
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value={format}
                      checked={exportFormat === format}
                      onChange={(e) => setExportFormat(e.target.value as any)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900 uppercase">
                          {format}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDescriptions[format]}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export {exportFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};