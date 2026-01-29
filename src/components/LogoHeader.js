import React from 'react';

export const CoffeeLogo = () => (
  <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const LogoHeader = ({ subtitle }) => {
  return (
    <div className="logo-header">
      <div className="logo-container">
        <span className="logo-icon-wrap"><CoffeeLogo /></span>
        <h1 className="logo-text">CoffeeCorner</h1>
      </div>
      {subtitle && <p className="logo-subtitle">{subtitle}</p>}
    </div>
  );
};

export default LogoHeader;
