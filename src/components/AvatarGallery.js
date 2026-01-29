/**
 * AvatarGallery - Emoji-based avatar picker for profiles.
 */
import React from 'react';
import { AVATARS } from '../data/avatars';

const AvatarGallery = ({ selectedAvatarId, onSelectAvatar, variant = 'round' }) => {
  return (
    <div className="avatar-gallery-container">
      <div className="avatar-gallery-header">
        <h3 className="avatar-gallery-title">Choose Your Avatar</h3>
      </div>
      <div className="avatar-section">
        <div className="avatar-grid main-grid">
          {AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              className={`avatar-item ${variant} ${selectedAvatarId === avatar.id ? 'selected' : ''}`}
              onClick={() => onSelectAvatar(avatar.id)}
              aria-label={`Select ${avatar.name} avatar`}
              aria-pressed={selectedAvatarId === avatar.id}
            >
              <div className="avatar-image-container">
                <div className="avatar-image avatar-emoji">{avatar.emoji}</div>
                {selectedAvatarId === avatar.id && (
                  <div className="avatar-selected-indicator" aria-hidden="true">
                    <span>✓</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarGallery;
