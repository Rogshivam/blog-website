// import { useEffect, useState } from 'react';

// export const useDarkMode = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   // Detect system preference
//   const getSystemPreference = () => {
//     return window.matchMedia &&
//       window.matchMedia('(prefers-color-scheme: dark)').matches;
//   };

//   // Apply theme class to <html>
//   const applyTheme = (dark: boolean) => {
//     if (dark) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   };

//   useEffect(() => {
//     const storedPref = localStorage.getItem('theme');

//     if (storedPref === 'dark') {
//       setIsDarkMode(true);
//       applyTheme(true);
//     } else if (storedPref === 'light') {
//       setIsDarkMode(false);
//       applyTheme(false);
//     } else {
//       const systemPref = getSystemPreference();
//       setIsDarkMode(systemPref);
//       applyTheme(systemPref);
//     }
//   }, []);

//   const toggleDarkMode = () => {
//     const newMode = !isDarkMode;
//     setIsDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     applyTheme(newMode);
//   };

//   return { isDarkMode, toggleDarkMode };
// };
import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return { isDarkMode, toggleDarkMode };
}; 
