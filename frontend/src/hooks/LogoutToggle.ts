import { useState, useEffect } from 'react';

export const useLogoutToggle = () => {
  const [isLogoutToggle, setIsLogoutToggle] = useState(true); // default to logged out

  useEffect(() => {
    const stored = localStorage.getItem('isLoggedOut');
    if (stored === null) {
      // No value stored, assume logged out
      setIsLogoutToggle(true);
      localStorage.setItem('isLoggedOut', 'true');
    } else {
      setIsLogoutToggle(stored === 'true');
    }
  }, []);

  const toggleLogoutToggle = () => {
    const newValue = !isLogoutToggle;
    setIsLogoutToggle(newValue);
    localStorage.setItem('isLoggedOut', newValue.toString());
  };

  return { isLogoutToggle, toggleLogoutToggle };
};
