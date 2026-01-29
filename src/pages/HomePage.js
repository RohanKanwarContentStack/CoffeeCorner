/**
 * HomePage - Featured and trending drinks; same structure as CineVerse HomePage (simplified).
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getAllProducts } from '../services/dataService';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setFeaturedProducts(getFeaturedProducts());
    const all = getAllProducts();
    setTrendingProducts(all.slice(0, 5));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (trendingProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentTrendingIndex((prev) => (prev + 1) % trendingProducts.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [trendingProducts]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePrevTrending = () => {
    setCurrentTrendingIndex((prev) =>
      prev === 0 ? trendingProducts.length - 1 : prev - 1
    );
  };

  const handleNextTrending = () => {
    setCurrentTrendingIndex((prev) => (prev + 1) % trendingProducts.length);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading CoffeeCorner...</p>
      </div>
    );
  }

  const currentTrending = trendingProducts[currentTrendingIndex];
  const bannerUrl = currentTrending?.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&h=1080&fit=crop';

  return (
    <div className="home-page-new">
      <div className="hero-banner-enhanced">
        <div
          className="hero-parallax-bg"
          style={{
            backgroundImage: `url(${bannerUrl})`,
            transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0002})`,
          }}
        />
        <div className="hero-gradient-overlay" />
        <div className="hero-vignette" />

        {currentTrending && (
          <div className="hero-content-enhanced">
            <div className="hero-badge">
              <span className="badge-icon">☕</span>
              <span>Featured This Week</span>
            </div>
            <h1 className="hero-title-animated">{currentTrending.title}</h1>
            <div className="hero-meta-enhanced">
              <span className="meta-pill">${currentTrending.price?.toFixed(2)}</span>
              {currentTrending.category?.name && (
                <span className="meta-pill">{currentTrending.category.name}</span>
              )}
            </div>
            {currentTrending.description && (
              <p className="hero-description-expandable">
                {currentTrending.description.substring(0, 150)}...
              </p>
            )}
            <div className="hero-cta-group">
              <Link
                to={`/product/${currentTrending.slug}`}
                className="btn btn-primary btn-lg hero-cta"
              >
                <span className="btn-icon">☕</span>
                <span>Order Now</span>
              </Link>
              <Link
                to={`/product/${currentTrending.slug}`}
                className="btn btn-glass btn-lg hero-cta"
              >
                <span>View Details</span>
              </Link>
            </div>
          </div>
        )}

        <div className="hero-carousel-controls">
          <button
            className="carousel-nav-btn carousel-prev"
            onClick={handlePrevTrending}
            aria-label="Previous"
          >
            &lt;
          </button>
          <div className="hero-thumbnails">
            {trendingProducts.map((product, index) => (
              <button
                key={product.uid}
                className={`hero-thumbnail ${index === currentTrendingIndex ? 'active' : ''}`}
                onClick={() => setCurrentTrendingIndex(index)}
                aria-label={`View ${product.title}`}
              >
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop'}
                  alt={product.title}
                  loading="lazy"
                />
                <div className="thumbnail-overlay" />
              </button>
            ))}
          </div>
          <button
            className="carousel-nav-btn carousel-next"
            onClick={handleNextTrending}
            aria-label="Next"
          >
            &gt;
          </button>
        </div>

        {scrollY < 50 && (
          <div className="scroll-indicator">
            <span>Scroll to explore</span>
            <span className="scroll-arrow">v</span>
          </div>
        )}
      </div>

      <div className="home-content-full">
        <section className="home-movies-only-section">
          <div className="section-header">
            <h2 className="section-title">Featured Drinks & Pastries</h2>
            <p className="section-subtitle">Handpicked for you</p>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="movies-grid-home">
              {featuredProducts.map((product) => (
                <div key={product.uid} className="movie-card-wrapper">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No featured items yet</h2>
              <p>Check our full menu!</p>
              <Link to="/menu" className="btn btn-primary">View Menu</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
