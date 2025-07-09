// hooks/LogoutToggle.ts
import { useState, useEffect } from 'react';
import LogoutToggle from './components/LogoutToggle'; // ✅ default import

export const useLogoutToggle = () => {
  const [isLogoutToggle, setIsLogoutToggle] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('isLoggedOut') === 'true';
    setIsLogoutToggle(stored);
  }, []);

  const toggleLogoutToggle = () => {
    const newValue = !isLogoutToggle;
    setIsLogoutToggle(newValue);
    localStorage.setItem('isLoggedOut', newValue.toString());
  };

  return { isLogoutToggle, toggleLogoutToggle };
};
