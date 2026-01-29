/**
 * CoffeeCorner App - Same structure as CineVerse.
 * Routes: login, signup, profiles, home, menu, product/:slug, cart, checkout, search.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Toast from './components/Toast';
import DataInitializer from './components/DataInitializer';
import ThemeInitializer from './components/ThemeInitializer';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CreateProfilePage from './pages/CreateProfilePage';
import SelectProfilePage from './pages/SelectProfilePage';
import SwitchProfilePage from './pages/SwitchProfilePage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import ManageProfilesPage from './pages/ManageProfilesPage';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SearchResultsPage from './pages/SearchResultsPage';
import './styles/App.css';

const Footer = () => (
  <footer className="footer">
    <p>&copy; 2025 CoffeeCorner. Your Daily Brew.</p>
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
            <div className="App">
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
                <Route path="/create-profile" element={<CreateProfilePage />} />
                <Route path="/select-profile" element={<SelectProfilePage />} />
                <Route path="/switch-profile" element={
                  <ProtectedRoute requireProfile={false}>
                    <SwitchProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/profiles" element={
                  <ProtectedRoute requireProfile={false}>
                    <>
                      <Navigation />
                      <main className="main-content">
                        <ManageProfilesPage />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
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
