/**
 * CreateProfilePage - Same flow as CineVerse; no Contentstack/genres.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AvatarGallery from '../components/AvatarGallery';
import ProfileAvatar from '../components/ProfileAvatar';
import { DEFAULT_AVATAR } from '../data/avatars';

const COFFEE_BG_IMAGES = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1920&h=1080&fit=crop',
];

const CreateProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR.id);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { user, updateUserProfiles, selectProfile } = useAuth();

  useEffect(() => {
    if (user?.profiles) setProfiles(user.profiles);
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % COFFEE_BG_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      setError('Please enter a profile name');
      return;
    }
    if (profiles.length >= 4) {
      setError('Maximum 4 profiles allowed');
      return;
    }
    const newProfile = {
      profile_name: newProfileName.trim(),
      avatar: selectedAvatar,
      name: newProfileName.trim(),
    };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    updateUserProfiles(updated);
    selectProfile(newProfile);
    setShowCreateForm(false);
    setNewProfileName('');
    setSelectedAvatar(DEFAULT_AVATAR.id);
    setError('');
    navigate('/home');
  };

  return (
    <div className="profile-page">
      <div className="profile-background" style={{ backgroundImage: `url(${COFFEE_BG_IMAGES[currentImageIndex]})` }}>
        <div className="profile-background-overlay"></div>
      </div>
      <div className="profile-content">
        <div className="profile-header">
          <h1 className="profile-title">Add a profile</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Create a profile to personalize your experience.</p>
        </div>
        {!showCreateForm ? (
          <div className="profiles-container">
            <div className="profiles-grid">
              {profiles.map((profile, index) => (
                <div key={profile._metadata?.uid || index} className="profile-item">
                  <div className="profile-avatar-button" style={{ cursor: 'default' }}>
                    <ProfileAvatar avatarId={profile.avatar} size="large" variant="round" showGlow={false} />
                    <span className="profile-name">{profile.profile_name}</span>
                  </div>
                </div>
              ))}
              {profiles.length < 4 && (
                <button className="profile-item add-profile-btn" onClick={() => setShowCreateForm(true)} type="button">
                  <span className="add-profile-icon">+</span>
                  <span>Add Profile</span>
                </button>
              )}
            </div>
            {profiles.length > 0 && (
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/home')}>
                Continue to CoffeeCorner
              </button>
            )}
          </div>
        ) : (
          <div className="create-profile-form" style={{ maxWidth: 400, margin: '0 auto' }}>
            <AvatarGallery selectedAvatarId={selectedAvatar} onSelectAvatar={setSelectedAvatar} />
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Profile name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                autoFocus
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="button" className="btn btn-primary btn-block" onClick={handleCreateProfile}>
              Create Profile
            </button>
            <button type="button" className="btn btn-glass btn-block" style={{ marginTop: '0.5rem' }} onClick={() => { setShowCreateForm(false); setError(''); }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProfilePage;
