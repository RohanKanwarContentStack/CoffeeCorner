/**
 * ProductCard - Reused pattern from CineVerse MovieCard.
 * Links to product detail; shows image, title, price, category.
 */
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imageUrl = product.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop';
  const priceStr = typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price;
  const accessibleTitle = `${product.title}${product.price ? `, ${priceStr}` : ''}${product.category?.name ? `, ${product.category.name}` : ''}`;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="movie-card product-card"
      aria-label={accessibleTitle}
    >
      <div className="movie-card-image product-card-image">
        <img
          src={imageUrl}
          alt={`${product.title}`}
          loading="lazy"
          decoding="async"
          width="300"
          height="300"
        />
        {product.featured && (
          <div className="featured-badge" aria-label="Featured" role="status">
            Featured
          </div>
        )}
      </div>
      <div className="movie-card-content product-card-content">
        <h3 className="movie-card-title">{product.title}</h3>
        <div className="movie-card-meta product-card-meta">
          <span className="product-price">{priceStr}</span>
          {product.category?.name && (
            <span className="genre-tag">{product.category.name}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
