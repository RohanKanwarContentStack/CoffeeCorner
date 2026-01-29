/**
 * AuthContext - Same pattern as CineVerse: uses Contentstack auth when env configured, else local.
 * Storage keys use coffeecorner_ prefix.
 */

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import CryptoJS from 'crypto-js';
import { signUpUser, signInUser, updateUserProfiles as updateProfilesAPI } from '../api/auth';
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
const PROFILE_KEY = 'coffeecorner_selected_profile';
const USERS_KEY = 'coffeecorner_users';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useContentstack, setUseContentstack] = useState(false);

  useEffect(() => {
    const csConfigured = isContentstackConfigured();
    setUseContentstack(csConfigured);
    const savedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    const savedProfile = localStorage.getItem(PROFILE_KEY) || sessionStorage.getItem(PROFILE_KEY);
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedProfile) setSelectedProfile(JSON.parse(savedProfile));
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
      profiles: [],
      created_on: new Date().toISOString(),
    };
    existing[email] = stored;
    localStorage.setItem(USERS_KEY, JSON.stringify(existing));
    const userData = {
      uid: stored.uid,
      username,
      email,
      profiles: [],
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
      profiles: stored.profiles || [],
      created_on: stored.created_on,
    };
    setUser(userData);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(userData));
    return { success: true, user: userData };
  };

  const updateProfilesLocal = (profiles) => {
    if (!user) return;
    const updated = { ...user, profiles };
    setUser(updated);
    const storage = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(updated));
    if (storage === localStorage) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(updated));
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
    }
    const existing = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (existing[user.email]) {
      existing[user.email] = { ...existing[user.email], profiles };
      localStorage.setItem(USERS_KEY, JSON.stringify(existing));
    }
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

  const updateUserProfiles = async (profiles) => {
    if (!user) return;
    try {
      if (useContentstack && user.uid) {
        const returnedProfiles = await updateProfilesAPI(user.uid, profiles);
        const updated = { ...user, profiles: returnedProfiles };
        setUser(updated);
        const storage = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
        storage.setItem(USER_KEY, JSON.stringify(updated));
        if (storage === localStorage) sessionStorage.setItem(USER_KEY, JSON.stringify(updated));
        else localStorage.setItem(USER_KEY, JSON.stringify(updated));
        return;
      }
      updateProfilesLocal(profiles);
    } catch (error) {
      logger.error('Profile update failed:', error.message);
      updateProfilesLocal(profiles);
    }
  };

  const selectProfile = (profile) => {
    setSelectedProfile(profile);
    const storage = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
    storage.setItem(PROFILE_KEY, JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    setSelectedProfile(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PROFILE_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(PROFILE_KEY);
  };

  const value = {
    user,
    selectedProfile,
    signup,
    login,
    logout,
    updateUserProfiles,
    selectProfile,
    loading,
    isAuthenticated: !!user && !!selectedProfile,
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
