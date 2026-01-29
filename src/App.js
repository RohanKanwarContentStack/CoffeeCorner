/**
 * CoffeeCorner App
 * Routes: login, signup, home, menu, product/:slug, cart, checkout, search, account.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Toast from './components/Toast';
import { CoffeeLogo } from './components/LogoHeader';
import DataInitializer from './components/DataInitializer';
import ThemeInitializer from './components/ThemeInitializer';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ChatBot from './components/ChatBot';
import './styles/App.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="footer-logo">
            <span className="footer-logo-icon" aria-hidden="true"><CoffeeLogo /></span>
            CoffeeCorner
          </span>
          <p className="footer-tagline">Your Daily Brew.</p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <div className="footer-nav-block">
            <span className="footer-nav-title">Shop</span>
            <Link to="/home">Home</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/cart">Cart</Link>
          </div>
          <div className="footer-nav-block">
            <span className="footer-nav-title">Company</span>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#locations">Locations</a>
          </div>
          <div className="footer-nav-block">
            <span className="footer-nav-title">Legal</span>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </nav>
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">&copy; 2025 CoffeeCorner. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <DataInitializer>
            <ThemeInitializer />
            <Toast />
            <div className="App app-coffeecorner">
              <ChatBot />
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={
                  <div className="error-page">
                    <h1>Password Recovery</h1>
                    <p>This feature is coming soon!</p>
                    <a href="/login" className="btn btn-primary">Back to Login</a>
                  </div>
                } />
                <Route path="/account" element={
                  <ProtectedRoute>
                    <>
                      <Navigation />
                      <main className="main-content">
                        <AccountSettingsPage />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/home" element={
                  <ProtectedRoute>
                    <>
                      <Navigation />
                      <main className="main-content">
                        <HomePage />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/menu" element={
                  <ProtectedRoute>
                    <>
                      <Navigation />
                      <main className="main-content">
                        <MenuPage />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/product/:slug" element={
                  <ProtectedRoute>
                    <>
                      <Navigation />
                      <main className="main-content">
                        <ProductDetailPage />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <>
                      <Navigation />
                      <main className="main-content">
                        <CartPage />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <>
                      <Navigation />
                      <main className="main-content">
                        <CheckoutPage />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <>
                      <Navigation />
                      <main className="main-content">
                        <SearchResultsPage />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                } />
                <Route path="*" element={
                  <div className="error-page">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="/login" className="btn btn-primary">Go to Login</a>
                  </div>
                } />
              </Routes>
            </div>
          </DataInitializer>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
