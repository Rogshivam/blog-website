import { useState, useEffect } from 'react';

type Theme = 'system' | 'dark' | 'light';

export const useDarkMode = () => {
  const [theme, setTheme] = useState<Theme>('system');

  // Detect system preference
  const getSystemPref = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      setTheme('system'); // default
      applyTheme('system');
    }
  }, []);

  const applyTheme = (mode: Theme) => {
    let applied = mode === 'system' ? getSystemPref() : mode;

    document.body.classList.remove('dark-mode', 'light-mode');
    if (applied === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  };

  const changeTheme = (mode: Theme) => {
    setTheme(mode);
    localStorage.setItem('theme', mode);
    applyTheme(mode);
  };

  return { theme, changeTheme };
};
