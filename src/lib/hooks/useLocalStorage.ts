import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : defaultValue;
    },
    () => defaultValue,
  );

  const setValue = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    window.dispatchEvent(new StorageEvent('storage', { key }));
  };

  return [value, setValue] as const;
}
