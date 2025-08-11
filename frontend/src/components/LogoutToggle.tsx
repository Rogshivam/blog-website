import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const LogoutToggle: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await fetch(`${baseURL}/api/profile`, {
        credentials: 'include',
      });
      setIsLoggedIn(res.ok);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${baseURL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Logout failed');

      setIsLoggedIn(false);
      localStorage.clear();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
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
