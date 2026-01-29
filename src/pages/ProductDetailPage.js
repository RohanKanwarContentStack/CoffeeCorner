/**
 * ProductDetailPage - Product details and Add to Cart.
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug, getProductsByCategory } from '../services/dataService';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const { addToCart, showToast } = useCart();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadProduct = () => {
    setLoading(true);
    window.scrollTo(0, 0);
    const data = getProductBySlug(slug);
    setProduct(data);
    if (data?.category?.slug) {
      const sameCategory = getProductsByCategory(data.category.slug);
      const similar = sameCategory
        .filter((p) => p.uid !== data.uid)
        .slice(0, 6);
      setSimilarProducts(similar);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    showToast(`Added ${quantity} × ${product.title} to cart`, 'success');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-page">
        <h1>Product Not Found</h1>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/menu" className="btn btn-primary">View Menu</Link>
      </div>
    );
  }

  const imageUrl = product.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop';
  const bannerUrl = product.image || imageUrl;

  return (
    <div className="product-detail-page product-detail-cc">
      <section className="product-detail-header-parallax">
        <div
          className="parallax-backdrop"
          style={{
            backgroundImage: `url(${bannerUrl})`,
            transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0002})`,
          }}
        />
        <div className="parallax-overlay parallax-overlay-primary" />
        <div className="parallax-overlay parallax-overlay-secondary" />
        <div className="parallax-overlay parallax-overlay-vignette" />

        <div className="parallax-content-container">
          <div className="parallax-content">
            <div className="poster-column">
              <div className="poster-sticky">
                <img
                  src={imageUrl}
                  alt={`${product.title}`}
                  className="poster-image-3d"
                />
                <div className="poster-actions poster-actions-cc">
                  <button
                    className="action-btn primary add-to-cart-btn-cc"
                    onClick={handleAddToCart}
                    aria-label="Add to cart"
                  >
                    <span className="icon">🛒</span>
                    <span>Add to Cart</span>
                  </button>
                  <div className="quantity-selector quantity-selector-cc">
                    <label htmlFor="qty">Qty</label>
                    <input
                      id="qty"
                      type="number"
                      min={1}
                      max={99}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      aria-label="Quantity"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="details-column">
              <div className="detail-content-card detail-content-card-cc">
                <h1 className="product-title-enhanced product-detail-title-cc">{product.title}</h1>
                <div className="meta-row-enhanced meta-row-cc">
                  <span className="meta-item meta-price-cc">${product.price?.toFixed(2)}</span>
                  {product.category?.name && (
                    <>
                      <span className="meta-divider">•</span>
                      <span className="meta-item meta-type-cc">{product.category.name}</span>
                    </>
                  )}
                </div>
                {product.category && (
                  <div className="genre-pills">
                    <Link to={`/menu?category=${product.category.slug}`} className="genre-pill">
                      <span className="genre-icon">☕</span>
                      <span>{product.category.name}</span>
                    </Link>
                  </div>
                )}
                <div className="synopsis-section synopsis-cc">
                  <h2>Description</h2>
                  <div className="synopsis-text">
                    <p>{product.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {scrollY < 50 && (
          <div className="scroll-indicator">
            <span>Scroll for more</span>
            <span className="scroll-arrow">↓</span>
          </div>
        )}
      </section>

      {similarProducts.length > 0 && (
        <div className="similar-products-section">
          <h2 className="section-title">You Might Also Like</h2>
          <div className="similar-products-grid">
            {similarProducts.map((p) => (
              <ProductCard key={p.uid} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
