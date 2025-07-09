import React from 'react';
import { useLogoutToggle } from '../hooks/LogoutToggle';

const LogoutToggle: React.FC = () => {
  const { isLogoutToggle, toggleLogoutToggle } = useLogoutToggle();

  return (
    <button onClick={toggleLogoutToggle}>
      {isLogoutToggle ? 'Login' : 'Logout'}
    </button>
  );
};

export default LogoutToggle;
