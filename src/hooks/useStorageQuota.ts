import { useState, useEffect, useCallback } from 'react';

interface StorageInfo {
  used: number;
  available: number;
  total: number;
  percentage: number;
  isNearLimit: boolean;
}

export const useStorageQuota = () => {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    used: 0,
    available: 0,
    total: 0,
    percentage: 0,
    isNearLimit: false,
  });

  const checkStorageQuota = useCallback(async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const total = estimate.quota || 0;
        const available = total - used;
        const percentage = total > 0 ? (used / total) * 100 : 0;
        const isNearLimit = percentage > 80; // Warning at 80%

        setStorageInfo({
          used,
          available,
          total,
          percentage,
          isNearLimit,
        });
      } else {
        // Fallback for browsers that don't support storage estimation
        const localStorageSize = new Blob(Object.values(localStorage)).size;
        setStorageInfo({
          used: localStorageSize,
          available: 5 * 1024 * 1024 - localStorageSize, // Assume 5MB limit
          total: 5 * 1024 * 1024,
          percentage: (localStorageSize / (5 * 1024 * 1024)) * 100,
          isNearLimit: localStorageSize > 4 * 1024 * 1024, // Warning at 4MB
        });
      }
    } catch (error) {
      console.warn('Could not estimate storage quota:', error);
    }
  }, []);

  useEffect(() => {
    checkStorageQuota();
    
    // Check storage quota periodically
    const interval = setInterval(checkStorageQuota, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [checkStorageQuota]);

  const formatBytes = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    storageInfo,
    checkStorageQuota,
    formatBytes,
  };
};