import React from 'react';
import { HardDrive, AlertTriangle, CheckCircle } from 'lucide-react';
import { useStorageQuota } from '../hooks/useStorageQuota';

export const StorageStatus: React.FC = () => {
  const { storageInfo, formatBytes } = useStorageQuota();

  if (storageInfo.total === 0) {
    return null; // Don't show if we can't determine storage info
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
      storageInfo.isNearLimit 
        ? 'bg-orange-50 text-orange-700 border border-orange-200' 
        : 'bg-green-50 text-green-700 border border-green-200'
    }`}>
      {storageInfo.isNearLimit ? (
        <AlertTriangle className="w-4 h-4" />
      ) : (
        <CheckCircle className="w-4 h-4" />
      )}
      
      <div className="flex items-center gap-2">
        <HardDrive className="w-4 h-4" />
        <span>
          Storage: {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.total)}
        </span>
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              storageInfo.isNearLimit ? 'bg-orange-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
          />
        </div>
        <span className="font-medium">
          {storageInfo.percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};