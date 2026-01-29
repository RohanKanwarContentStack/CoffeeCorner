import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileAvatar from '../components/ProfileAvatar';

const COFFEE_BG = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&h=1080&fit=crop',
];

const SwitchProfilePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { user, selectProfile } = useAuth();

  useEffect(() => {
    if (!user?.profiles || user.profiles.length === 0) {
      navigate('/create-profile');
      return;
    }
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % COFFEE_BG.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleSelectProfile = (profile) => {
    selectProfile(profile);
    window.location.href = '/home';
  };

  if (!user?.profiles || user.profiles.length === 0) return null;

  return (
    <div className="profile-page">
      <div className="profile-background" style={{ backgroundImage: `url(${COFFEE_BG[currentImageIndex]})` }}>
        <div className="profile-background-overlay"></div>
      </div>
      <div className="profile-content">
        <div className="profile-header">
          <h1 className="profile-title">Switch Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '1rem' }}>Choose who's ordering.</p>
        </div>
        <div className="profiles-container">
          <div className="profiles-grid">
            {user.profiles.map((profile, index) => (
              <div key={profile._metadata?.uid || index} className="profile-item">
                <button className="profile-avatar-button" onClick={() => handleSelectProfile(profile)} type="button">
                  <ProfileAvatar avatarId={profile.avatar} size="large" variant="round" showGlow={false} />
                  <span className="profile-name">{profile.profile_name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwitchProfilePage;
