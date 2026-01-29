/**
 * AuthContext - Contentstack auth when env configured, else local storage.
 * Storage keys use coffeecorner_ prefix. No profiles.
 */

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import CryptoJS from 'crypto-js';
import { signUpUser, signInUser } from '../api/auth';
import logger from '../utils/logger';

const AuthContext = createContext(null);

const hashPassword = (password, salt) => {
  const salted = salt + password;
  return CryptoJS.SHA256(salted).toString(CryptoJS.enc.Hex);
};

const generateSalt = () =>
  CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

const isContentstackConfigured = () => {
  return !!(
    process.env.REACT_APP_CONTENTSTACK_API_KEY &&
    process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN
  );
};

const USER_KEY = 'coffeecorner_user';
const USERS_KEY = 'coffeecorner_users';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useContentstack, setUseContentstack] = useState(false);

  useEffect(() => {
    const csConfigured = isContentstackConfigured();
    setUseContentstack(csConfigured);
    const savedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const signupLocal = (username, email, password) => {
    const existing = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (existing[email]) {
      return { success: false, error: 'Email already registered' };
    }
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);
    const stored = {
      uid: Date.now().toString(),
      username,
      email,
      passwordHash,
      salt,
      created_on: new Date().toISOString(),
    };
    existing[email] = stored;
    localStorage.setItem(USERS_KEY, JSON.stringify(existing));
    const userData = {
      uid: stored.uid,
      username,
      email,
      created_on: stored.created_on,
    };
    setUser(userData);
    sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
    return { success: true, user: userData };
  };

  const loginLocal = (email, password, rememberMe = false) => {
    const existing = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const stored = existing[email];
    if (!stored) return { success: false, error: 'Invalid email or password' };
    const passwordHash = hashPassword(password, stored.salt);
    if (passwordHash !== stored.passwordHash) {
      return { success: false, error: 'Invalid email or password' };
    }
    const userData = {
      uid: stored.uid,
      username: stored.username,
      email: stored.email,
      created_on: stored.created_on,
    };
    setUser(userData);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(userData));
    return { success: true, user: userData };
  };

  const signup = async (username, email, password) => {
    try {
      if (useContentstack) {
        const userData = await signUpUser(username, email, password);
        setUser(userData);
        sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return signupLocal(username, email, password);
    } catch (error) {
      logger.error('Signup failed:', error.message);
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      if (useContentstack) {
        const userData = await signInUser(email, password);
        setUser(userData);
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(USER_KEY, JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return loginLocal(email, password, rememberMe);
    } catch (error) {
      logger.error('Login failed:', error.message);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  const value = {
    user,
    signup,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    hasUser: !!user,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
