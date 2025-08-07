
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const LogoutToggle: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in by checking for token in cookies
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        credentials: 'include'
      });
      setIsLoggedIn(res.ok);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        setIsLoggedIn(false);
        // Clear any local storage
        localStorage.clear();
        // Redirect to login page
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and redirect
      setIsLoggedIn(false);
      localStorage.clear();
      router.push('/login');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <button 
      onClick={isLoggedIn ? handleLogout : handleLogin}
      className="logout-toggle-btn"
    >
      {isLoggedIn ? 'Logout' : 'Login'}
    </button>
  );
};

export default LogoutToggle;
