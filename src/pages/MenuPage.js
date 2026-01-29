/**
 * MenuPage - Full product listing; same structure as CineVerse MoviesPage.
 */
import React, { useState, useEffect } from 'react';
import { getAllProducts, getAllCategories } from '../services/dataService';
import ProductCard from '../components/ProductCard';

const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProducts(getAllProducts());
    setCategories(getAllCategories());
    setLoading(false);
  }, []);

  const displayedProducts = selectedCategory
    ? products.filter((p) => p.category?.slug === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <div className="movies-page-header">
        <div className="movies-page-title-section">
          <h1 className="movies-page-title">Our Menu</h1>
          <p className="movies-page-subtitle">
            Browse drinks and pastries. Filter by category below.
          </p>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="menu-categories" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
          <button
            className={`btn ${!selectedCategory ? 'btn-primary' : 'btn-glass'}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.uid}
              className={`btn ${selectedCategory === cat.slug ? 'btn-primary' : 'btn-glass'}`}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {displayedProducts.length > 0 ? (
        <div className="movies-grid">
          {displayedProducts.map((product) => (
            <div key={product.uid} className="movie-card-wrapper">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">☕</div>
          <h2>No items in this category</h2>
          <p>Try another filter or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
