/**
 * ManageProfilesPage - Same structure as CineVerse; simplified (no genres/kids).
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AvatarGallery from '../components/AvatarGallery';
import ProfileAvatar from '../components/ProfileAvatar';
import { DEFAULT_AVATAR } from '../data/avatars';

const ManageProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [editingProfile, setEditingProfile] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', avatar: DEFAULT_AVATAR.id });
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  const { user, updateUserProfiles } = useAuth();

  useEffect(() => {
    if (user?.profiles) setProfiles(user.profiles);
  }, [user]);

  const resetForm = () => {
    setFormData({ name: '', avatar: DEFAULT_AVATAR.id });
    setError('');
  };

  const handleCreateProfile = () => {
    if (!formData.name.trim()) {
      setError('Please enter a profile name');
      return;
    }
    if (profiles.length >= 4) {
      setError('Maximum 4 profiles allowed');
      return;
    }
    const newProfile = {
      profile_name: formData.name.trim(),
      avatar: formData.avatar,
      name: formData.name.trim(),
    };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    updateUserProfiles(updated);
    resetForm();
    setShowCreateForm(false);
  };

  const handleEditProfile = (index) => {
    const profile = profiles[index];
    setEditingProfile(index);
    setFormData({ name: profile.profile_name, avatar: profile.avatar });
    setShowCreateForm(false);
    setError('');
  };

  const handleSaveEdit = () => {
    if (!formData.name.trim()) {
      setError('Please enter a profile name');
      return;
    }
    const updated = profiles.map((p, i) =>
      i === editingProfile
        ? { ...p, profile_name: formData.name.trim(), avatar: formData.avatar, name: formData.name.trim() }
        : p
    );
    setProfiles(updated);
    updateUserProfiles(updated);
    resetForm();
    setEditingProfile(null);
  };

  const handleDeleteProfile = (index) => {
    if (deleteConfirm === index) {
      const updated = profiles.filter((_, i) => i !== index);
      setProfiles(updated);
      updateUserProfiles(updated);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(index);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="manage-profiles-page">
      <div className="manage-profiles-container">
        <div className="manage-profiles-header">
          <h1 className="manage-profiles-title">👥 Manage Profiles</h1>
          <p className="manage-profiles-subtitle">Add, edit, or delete profiles. Maximum 4.</p>
          <button className="btn btn-secondary back-btn" onClick={() => navigate('/home')}>← Back to Home</button>
        </div>
        <div className="profiles-management-grid">
          {profiles.map((profile, index) => (
            <div key={profile._metadata?.uid || index} className="manage-profile-card">
              <div className="profile-card-header">
                <div className="profile-display">
                  <ProfileAvatar avatarId={profile.avatar} size="xlarge" variant="round" showGlow />
                  <div className="profile-details">
                    <h3 className="profile-card-name">{profile.profile_name}</h3>
                  </div>
                </div>
              </div>
              <div className="profile-card-actions">
                <button className="btn-action btn-edit-action" onClick={() => handleEditProfile(index)}>✏️ Edit</button>
                <button className={`btn-action btn-delete-action ${deleteConfirm === index ? 'confirm' : ''}`} onClick={() => handleDeleteProfile(index)}>
                  {deleteConfirm === index ? '⚠️ Confirm?' : '🗑️ Delete'}
                </button>
              </div>
            </div>
          ))}
          {profiles.length < 4 && !showCreateForm && editingProfile === null && (
            <div className="manage-profile-card add-profile-card">
              <button className="add-profile-button" onClick={() => setShowCreateForm(true)}>
                <div className="add-icon">+</div>
                <span>Add New Profile</span>
              </button>
            </div>
          )}
        </div>
        {(showCreateForm || editingProfile !== null) && (
          <div className="profile-form-section">
            <h2 className="form-title">{editingProfile !== null ? '✏️ Edit Profile' : '➕ Create Profile'}</h2>
            <div className="form-content">
              <div className="form-group">
                <label>Profile Name</label>
                <input type="text" className="form-input" placeholder="Profile name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} maxLength={20} />
              </div>
              <div className="form-group">
                <AvatarGallery selectedAvatarId={formData.avatar} onSelectAvatar={(id) => setFormData({ ...formData, avatar: id })} variant="round" />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="button" className="btn btn-primary" onClick={editingProfile !== null ? handleSaveEdit : handleCreateProfile}>
                {editingProfile !== null ? 'Save' : 'Create'}
              </button>
              <button type="button" className="btn btn-glass" style={{ marginLeft: '0.5rem' }} onClick={() => { resetForm(); setEditingProfile(null); setShowCreateForm(false); }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProfilesPage;
