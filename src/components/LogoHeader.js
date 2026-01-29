import React from 'react';

const LogoHeader = ({ subtitle }) => {
  return (
    <div className="logo-header">
      <div className="logo-container">
        <span className="logo-emoji" aria-hidden="true">☕</span>
        <h1 className="logo-text">CoffeeCorner</h1>
      </div>
      {subtitle && <p className="logo-subtitle">{subtitle}</p>}
    </div>
  );
};

export default LogoHeader;
