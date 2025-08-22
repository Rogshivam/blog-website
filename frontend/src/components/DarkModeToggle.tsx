import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

const icons: Record<'system' | 'light' | 'dark', string> = {
  system: '🖥️',
  light: '☀️',
  dark: '🌙',
};

const DarkModeToggle: React.FC = () => {
  const { theme, changeTheme } = useDarkMode();

  const handleClick = () => {
    const nextTheme =
      theme === 'system' ? 'light' :
      theme === 'light' ? 'dark' : 'system';
    changeTheme(nextTheme);
  };

  return (
    <button
      id="darkModeToggle"
      className="dark-mode-toggle"
      onClick={handleClick}
    >
      {icons[theme]}
    </button>
  );
};

export default DarkModeToggle;
