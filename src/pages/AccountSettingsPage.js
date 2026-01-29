/**
 * AccountSettingsPage - Account settings.
 */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccountSettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      logout();
      navigate('/signup');
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  return (
    <div className="account-settings-page">
      <div className="settings-header">
        <h1>Account Settings</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Manage your CoffeeCorner account.</p>
      </div>
      <div className="settings-group">
        <div className="setting-row">
          <div className="setting-row-info">
            <div className="setting-row-label">Username</div>
            <div className="setting-row-value">{user?.username}</div>
          </div>
        </div>
        <div className="setting-row">
          <div className="setting-row-info">
            <div className="setting-row-label">Email</div>
            <div className="setting-row-value">{user?.email}</div>
          </div>
        </div>
      </div>
      <div className="settings-actions" style={{ marginTop: '2rem' }}>
        <button className={`btn ${showDeleteConfirm ? 'btn-error' : 'btn-glass'}`} onClick={handleDeleteAccount}>
          {showDeleteConfirm ? '⚠️ Click again to sign out everywhere' : 'Sign out everywhere'}
        </button>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
