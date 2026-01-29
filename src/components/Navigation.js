/**
 * Navigation - Main nav: Home, Menu, Cart, Search.
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import { CoffeeLogo } from './LogoHeader';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearch = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setIsMenuOpen(false);
  };

  const isActiveLink = (path) => {
    if (path === '/home') return location.pathname === '/home' || location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <Link to="/home" className="nav-logo" aria-label="CoffeeCorner Home">
          <span className="nav-logo-icon" aria-hidden="true"><CoffeeLogo /></span>
          <span className="nav-logo-text">CoffeeCorner</span>
        </Link>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`} role="menubar">
          <Link
            to="/home"
            className={`nav-link ${isActiveLink('/home') ? 'active' : ''}`}
            role="menuitem"
            aria-current={isActiveLink('/home') ? 'page' : undefined}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className={`nav-link ${isActiveLink('/menu') ? 'active' : ''}`}
            role="menuitem"
            aria-current={isActiveLink('/menu') ? 'page' : undefined}
          >
            Menu
          </Link>
          <Link
            to="/cart"
            className={`nav-link nav-link-cart ${isActiveLink('/cart') ? 'active' : ''}`}
            role="menuitem"
            aria-current={isActiveLink('/cart') ? 'page' : undefined}
          >
            <span className="cart-nav-icon">🛒</span>
            Cart
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>

        <div className="nav-right">
          <SearchBar onSearch={handleSearch} />
          <UserMenu />
          <button
            className="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="nav-links"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
