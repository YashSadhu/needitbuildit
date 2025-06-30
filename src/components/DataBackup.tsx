import React, { useState } from 'react';
import { Download, Upload, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { TimelineCard, CardGroup, ResearchNote, MetadataTemplate, SearchQuery } from '../types';
import { useDataValidation } from '../hooks/useDataValidation';

interface DataBackupProps {
  cards: TimelineCard[];
  groups: CardGroup[];
  researchNotes: ResearchNote[];
  metadataTemplates: MetadataTemplate[];
  savedSearches: SearchQuery[];
  onImportData: (data: {
    cards?: TimelineCard[];
    groups?: CardGroup[];
    researchNotes?: ResearchNote[];
    metadataTemplates?: MetadataTemplate[];
    savedSearches?: SearchQuery[];
  }) => void;
}

export const DataBackup: React.FC<DataBackupProps> = ({
  cards,
  groups,
  researchNotes,
  metadataTemplates,
  savedSearches,
  onImportData,
}) => {
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const { validateData } = useDataValidation();

  const exportBackup = () => {
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        cards,
        groups,
        researchNotes,
        metadataTemplates,
        savedSearches,
      },
      metadata: {
        totalCards: cards.length,
        totalGroups: groups.length,
        totalNotes: researchNotes.length,
        totalTemplates: metadataTemplates.length,
        totalSearches: savedSearches.length,
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `story-timeline-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content);

        // Validate the backup data structure
        if (!backupData.data) {
          throw new Error('Invalid backup file format');
        }

        const validation = validateData(backupData.data);
        if (!validation.isValid) {
          throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
        }

        // Import the data
        onImportData(backupData.data);
        
        setImportStatus({
          type: 'success',
          message: `Successfully imported backup from ${new Date(backupData.timestamp).toLocaleDateString()}`
        });

        // Clear the file input
        event.target.value = '';
        
        // Clear status after 5 seconds
        setTimeout(() => {
          setImportStatus({ type: null, message: '' });
        }, 5000);

      } catch (error) {
        setImportStatus({
          type: 'error',
          message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        
        // Clear status after 5 seconds
        setTimeout(() => {
          setImportStatus({ type: null, message: '' });
        }, 5000);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* Status Message */}
      {importStatus.type && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          importStatus.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {importStatus.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-sm">{importStatus.message}</span>
        </div>
      )}

      {/* Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Backup */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Backup
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Download a complete backup of all your data including cards, groups, notes, and settings.
          </p>
          <button
            onClick={exportBackup}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            Create Backup
          </button>
        </div>

        {/* Import Backup */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Backup
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Restore your data from a previously exported backup file. This will replace your current data.
          </p>
          <label className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Select Backup File
            <input
              type="file"
              accept=".json"
              onChange={importBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Data Summary */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Current Data Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Cards:</span>
            <span className="font-medium text-gray-900 ml-2">{cards.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Groups:</span>
            <span className="font-medium text-gray-900 ml-2">{groups.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Notes:</span>
            <span className="font-medium text-gray-900 ml-2">{researchNotes.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Templates:</span>
            <span className="font-medium text-gray-900 ml-2">{metadataTemplates.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Searches:</span>
            <span className="font-medium text-gray-900 ml-2">{savedSearches.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};