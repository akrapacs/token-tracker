import { useState, useEffect, Dispatch, SetStateAction } from "react";

const getItem = <T> (key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  const saved = localStorage.getItem(key);
  if (!saved) {
    return defaultValue;
  }
  const initial = JSON.parse(saved);
  return initial || defaultValue;
}

export const useLocalStorage = <T> (key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(() => {
    return getItem(key, defaultValue);
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};