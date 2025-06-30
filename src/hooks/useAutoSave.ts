import { useEffect, useRef } from 'react';

interface AutoSaveOptions {
  delay?: number;
  onSave?: () => void;
  onError?: (error: Error) => void;
}

export const useAutoSave = (
  data: any,
  saveFunction: (data: any) => void,
  options: AutoSaveOptions = {}
) => {
  const { delay = 1000, onSave, onError } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef(data);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only save if data has actually changed
    if (JSON.stringify(data) !== JSON.stringify(previousDataRef.current)) {
      timeoutRef.current = setTimeout(() => {
        try {
          saveFunction(data);
          previousDataRef.current = data;
          onSave?.();
        } catch (error) {
          onError?.(error as Error);
        }
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveFunction, delay, onSave, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};