/**
 * CartPage - Cart listing with quantities and checkout; same structure as CineVerse WatchlistPage.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <div className="watchlist-title-section">
          <h1 className="watchlist-title">
            <span className="watchlist-icon">🛒</span>
            My Cart
          </h1>
          <p className="watchlist-subtitle">
            {cart.length === 0
              ? 'Your cart is empty. Add drinks or pastries from the menu!'
              : `${cart.reduce((sum, i) => sum + i.quantity, 0)} item(s) · Total $${cartTotal.toFixed(2)}`
            }
          </p>
        </div>
        {cart.length > 0 && (
          <button
            className="clear-watchlist-btn"
            onClick={() => {
              if (window.confirm('Clear entire cart?')) clearCart();
            }}
          >
            <span className="clear-icon">🗑️</span>
            Clear All
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="watchlist-empty">
          <div className="empty-illustration">
            <span className="empty-icon">☕</span>
          </div>
          <h2>Your cart is empty</h2>
          <p>Browse our menu and add items to your cart.</p>
          <Link to="/menu" className="btn btn-primary">
            View Menu
          </Link>
        </div>
      ) : (
        <div className="watchlist-grid">
          {cart.map((item, index) => {
            const product = item.product;
            const imageUrl = product.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop';
            return (
              <div
                key={product.uid}
                className="watchlist-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link to={`/product/${product.slug}`} className="watchlist-card-link">
                  <div className="watchlist-card-poster">
                    <img src={imageUrl} alt={product.title} loading="lazy" />
                    <div className="watchlist-card-overlay">
                      <span className="play-icon">☕</span>
                    </div>
                  </div>
                </Link>
                <div className="watchlist-card-info">
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="watchlist-card-title">{product.title}</h3>
                  </Link>
                  <div className="watchlist-card-meta">
                    <span className="meta-year">${product.price?.toFixed(2)} each</span>
                  </div>
                  <div className="cart-quantity-row" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-glass btn-sm"
                      onClick={() => updateQuantity(product.uid, Math.max(1, item.quantity - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span style={{ minWidth: '2rem', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      type="button"
                      className="btn btn-glass btn-sm"
                      onClick={() => updateQuantity(product.uid, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
                      ${(product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  className="remove-from-watchlist-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromCart(product.uid);
                  }}
                  aria-label={`Remove ${product.title} from cart`}
                >
                  <span className="remove-icon">×</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {cart.length > 0 && (
        <div className="cart-checkout-row" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Total: <strong>${cartTotal.toFixed(2)}</strong>
          </p>
          <Link to="/checkout" className="btn btn-primary btn-lg">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
