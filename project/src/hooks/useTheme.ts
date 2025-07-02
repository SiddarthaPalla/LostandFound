import { useState, useEffect } from 'react';
import { Theme } from '../types';
import { saveTheme, getTheme } from '../utils/storage';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => getTheme() as Theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};