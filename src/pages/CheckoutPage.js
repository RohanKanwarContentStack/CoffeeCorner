/**
 * CheckoutPage - Order summary and place order (same layout pattern as CineVerse pages).
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setPlacing(true);
    // Simulate order submission
    setTimeout(() => {
      setOrderPlaced(true);
      clearCart();
      setPlacing(false);
    }, 1000);
  };

  if (orderPlaced) {
    return (
      <div className="checkout-success" style={{ maxWidth: 500, margin: '2rem auto', textAlign: 'center' }}>
        <h1>Thank you for your order!</h1>
        <p>We'll have your drinks and pastries ready soon.</p>
        <Link to="/menu" className="btn btn-primary">Back to Menu</Link>
        <Link to="/home" className="btn btn-glass" style={{ marginLeft: '0.5rem' }}>Home</Link>
      </div>
    );
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="error-page">
        <h1>Your cart is empty</h1>
        <p>Add items from the menu before checkout.</p>
        <Link to="/menu" className="btn btn-primary">View Menu</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page" style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h1 className="section-title">Checkout</h1>
      <div className="checkout-summary" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--background-light)', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Order Summary</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cart.map((item) => (
            <li key={item.product.uid} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
              <span>{item.product.title} × {item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
          Total: ${cartTotal.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-form">
        <div className="form-group">
          <label htmlFor="checkout-name">Name</label>
          <input
            id="checkout-name"
            type="text"
            className="form-input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="checkout-email">Email</label>
          <input
            id="checkout-email"
            type="email"
            className="form-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="checkout-notes">Order notes (optional)</label>
          <textarea
            id="checkout-notes"
            className="form-input"
            placeholder="Special requests..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={placing}>
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
        <Link to="/cart" className="btn btn-glass btn-block" style={{ marginTop: '0.5rem' }}>
          Back to Cart
        </Link>
      </form>
    </div>
  );
};

export default CheckoutPage;
