/**
 * SearchBar - Product search input and submit.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/dataService';

const SearchBar = ({ onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (location.pathname === '/search') {
      setSearchTerm(searchParams.get('q') || '');
    }
  }, [location.pathname, searchParams]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      setIsLoading(true);
      const results = searchProducts(searchTerm);
      setSuggestions(results.slice(0, 5));
      setShowSuggestions(true);
      setIsLoading(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowSuggestions(false);
      if (location.pathname !== '/search') setSearchTerm('');
    }
  };

  const handleSuggestionClick = (product) => {
    setShowSuggestions(false);
    setSearchTerm('');
    navigate(`/product/${product.slug}`);
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search drinks, pastries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="search-input"
          autoComplete="off"
        />
        <button type="submit" className="search-button" aria-label="Search">
          🔍
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {isLoading ? (
            <div className="suggestion-loading">Searching...</div>
          ) : (
            <>
              {suggestions.map((product) => (
                <div
                  key={product.uid}
                  className="search-suggestion-item"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <div className="suggestion-poster">
                    {product.image ? (
                      <img src={product.image} alt={product.title} />
                    ) : (
                      <div className="suggestion-poster-placeholder">☕</div>
                    )}
                  </div>
                  <div className="suggestion-info">
                    <div className="suggestion-title">{product.title}</div>
                    <div className="suggestion-meta">
                      <span>${product.price?.toFixed(2)}</span>
                      {product.category?.name && (
                        <span className="suggestion-rating">{product.category.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="suggestion-footer" onClick={() => onSearch(searchTerm)}>
                View all results for "{searchTerm}" →
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
