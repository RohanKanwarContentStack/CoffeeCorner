import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoHeader from '../components/LogoHeader';
import logger from '../utils/logger';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        if (result.user.profiles && result.user.profiles.length > 0) {
          navigate('/select-profile');
        } else {
          navigate('/create-profile');
        }
      } else {
        setError(result.error || 'Login failed');
        setPassword('');
      }
    } catch (err) {
      logger.error('Login failed:', err.message);
      setError(err.message || 'An error occurred during login');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <LogoHeader subtitle="Your Daily Brew" />
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-btn"
              style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem',
                padding: '0.25rem', color: 'var(--text-secondary)', opacity: 0.7,
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
          {error && <div className="error-message">⚠️ {error}</div>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <div className="remember-me">
            <label className="checkbox-label">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <span>Remember me</span>
            </label>
          </div>
          <div className="signup-section">
            <p className="signup-text">New to CoffeeCorner?</p>
            <Link to="/signup" className="signup-link">Sign up now</Link>
          </div>
        </form>
      </div>
      <div className="login-background">
        <div className="background-overlay"></div>
      </div>
    </div>
  );
};

export default LoginPage;
