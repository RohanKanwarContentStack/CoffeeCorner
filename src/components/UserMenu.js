import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="user-menu-container">
      <div
        className="hamburger-menu"
        onClick={() => setOpen(!open)}
        role="button"
        aria-label="User menu"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!open);
          }
        }}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {open && (
        <>
          <div className="user-menu-overlay" onClick={() => setOpen(false)} />
          <div className="user-menu-dropdown">
            <div className="user-menu-header">
              <strong>{user?.username || user?.email || 'User'}</strong>
            </div>
            <button
              className="user-menu-item logout-button"
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              type="button"
            >
              🚪 Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
