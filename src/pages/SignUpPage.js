import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoHeader from '../components/LogoHeader';
import logger from '../utils/logger';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    try {
      const result = await signup(username, email, password);
      if (result.success) navigate('/home');
      else setError(result.error || 'Sign up failed');
    } catch (err) {
      logger.error('Signup failed:', err.message);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-cc auth-split auth-signup">
      <div className="auth-visual-panel auth-visual-left">
        <div className="auth-visual-bg" />
        <div className="auth-visual-overlay" />
        <div className="auth-visual-quote">
          <p>Join us for your next cup.</p>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <LogoHeader />
          <div className="signup-headline-section">
            <h2 className="signup-headline">Fresh coffee, daily.</h2>
            <p className="signup-tagline">Create an account to order and save your favorites.</p>
          </div>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" id="username" className="form-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus minLength={3} maxLength={30} />
            </div>
            <div className="form-group">
              <input type="email" id="email" className="form-input" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                style={{ paddingRight: '2.5rem' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {error && <div className="error-message">⚠️ {error}</div>}
            <button type="submit" className="btn btn-primary btn-block btn-large" disabled={loading}>
              {loading ? 'Creating account...' : 'Next'}
            </button>
            <div className="signin-section">
              <p className="signin-text">Already have an account? <Link to="/login" className="signin-link">Sign in</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
