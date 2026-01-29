/**
 * CheckoutPage - Order summary and place order.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.username) setName((prev) => (prev === '' ? user.username : prev));
    if (user.email) setEmail((prev) => (prev === '' ? user.email : prev));
  }, [user]);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !address.trim()) return;
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
      <div className="checkout-page checkout-page-cc">
        <div className="checkout-success-cc">
          <h1 className="checkout-success-title">Thank you for your order!</h1>
          <p className="checkout-success-subtitle">We'll have your drinks and pastries ready soon.</p>
          <div className="checkout-success-actions">
            <Link to="/menu" className="btn btn-primary">Back to Menu</Link>
            <Link to="/home" className="btn btn-outline-cc">Home</Link>
          </div>
        </div>
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
    <div className="checkout-page checkout-page-cc">
      <h1 className="section-title">Checkout</h1>
      <div className="checkout-summary-cc">
        <h2 className="checkout-summary-title">Order Summary</h2>
        <ul className="checkout-summary-list">
          {cart.map((item) => (
            <li key={item.product.uid} className="checkout-summary-row">
              <span>{item.product.title} × {item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="checkout-summary-total">
          Total: ${cartTotal.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-form checkout-form-cc">
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
          <label htmlFor="checkout-address">Address</label>
          <input
            id="checkout-address"
            type="text"
            className="form-input"
            placeholder="Street address, city, postal code"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
        <Link to="/cart" className="btn btn-outline-cc btn-block checkout-back-link">
          Back to Cart
        </Link>
      </form>
    </div>
  );
};

export default CheckoutPage;
