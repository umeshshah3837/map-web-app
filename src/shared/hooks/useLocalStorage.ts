import { useCallback } from 'react';

export function useLocalStorage() {
  const save = useCallback(<T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  const load = useCallback(<T>(key: string): T | null => {
    const value = localStorage.getItem(key);

    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }, []);

  return {
    save,
    load,
  };
}
