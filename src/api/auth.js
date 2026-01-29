import CryptoJS from 'crypto-js';
import logger from '../utils/logger';

// Environment variables - REQUIRED (no fallbacks for security)
const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_SECRET;
const API_KEY = process.env.REACT_APP_CONTENTSTACK_API_KEY;
const DELIVERY_TOKEN = process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN;
const MANAGEMENT_TOKEN = process.env.REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'development';
const REGION = (process.env.REACT_APP_CONTENTSTACK_REGION || 'us').toLowerCase();

// Contentstack has no separate "staging" API host. "Staging" is an environment name inside your stack.
// Use REACT_APP_CONTENTSTACK_ENVIRONMENT=staging (or testing, production) to target that environment.
// API host is determined by REGION only. Official docs: eu = .contentstack.com, us = .contentstack.io
// const BASE_URL = 'https://stag-cdn.csnonprod.com/v3';
// const MANAGEMENT_URL = 'https://stag-api.csnonprod.com/v3';

const BASE_URL = 'https://cdn.contentstack.io/v3';
const MANAGEMENT_URL = 'https://api.contentstack.io/v3';

if (!SECRET_KEY) {
  console.error('SECURITY ERROR: REACT_APP_ENCRYPTION_SECRET is not configured');
}
if (!API_KEY) {
  console.error('SECURITY ERROR: REACT_APP_CONTENTSTACK_API_KEY is not configured');
}
if (!DELIVERY_TOKEN) {
  console.error('SECURITY ERROR: REACT_APP_CONTENTSTACK_DELIVERY_TOKEN is not configured');
}

logger.group('Auth Configuration');
logger.info(`API_KEY: ${API_KEY ? 'Configured' : 'Missing'}`);
logger.info(`DELIVERY_TOKEN: ${DELIVERY_TOKEN ? 'Configured' : 'Missing'}`);
logger.info(`MANAGEMENT_TOKEN: ${MANAGEMENT_TOKEN ? 'Configured' : 'Not set (localStorage only)'}`);
logger.info(`ENVIRONMENT: ${ENVIRONMENT}`);
logger.info(`REGION: ${REGION} API)`);
logger.groupEnd();

export const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, SECRET_KEY || '').toString();
};

export const decryptPassword = (encryptedPassword) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY || '');
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    logger.error('Password decryption failed');
    return null;
  }
};

const checkEmailExists = async (email) => {
  try {
    if (!API_KEY || !DELIVERY_TOKEN) return false;
    const query = { email: email.toLowerCase() };
    const deliveryResponse = await fetch(
      `${BASE_URL}/content_types/signup_user/entries?environment=${ENVIRONMENT}&query=${JSON.stringify(query)}`,
      {
        headers: {
          'api_key': API_KEY,
          'access_token': DELIVERY_TOKEN,
        }
      }
    );
    const deliveryData = await deliveryResponse.json();
    if (deliveryData.entries && deliveryData.entries.length > 0) return true;
    if (MANAGEMENT_TOKEN) {
      const managementResponse = await fetch(
        `${MANAGEMENT_URL}/content_types/signup_user/entries?query=${JSON.stringify(query)}&locale=en-us`,
        {
          headers: {
            'api_key': API_KEY,
            'authorization': MANAGEMENT_TOKEN,
          }
        }
      );
      const managementData = await managementResponse.json();
      return managementData.entries && managementData.entries.length > 0;
    }
    return false;
  } catch (error) {
    logger.error('Email verification failed:', error.message);
    return false;
  }
};

export const signUpUser = async (username, email, password) => {
  if (!API_KEY || !DELIVERY_TOKEN) {
    throw new Error('Contentstack auth not configured');
  }
  try {
    const encryptedPassword = encryptPassword(password);
    const existingUser = await checkEmailExists(email);
    if (existingUser) throw new Error('Email already exists');
    const requestBody = {
      entry: {
        title: username.toLowerCase().replace(/\s+/g, '_'),
        username: username,
        email: email.toLowerCase(),
        password: encryptedPassword,
        created_on: new Date().toISOString(),
      }
    };
    logger.info('Creating user account:', { username, email });
    const response = await fetch(
      `${MANAGEMENT_URL}/content_types/signup_user/entries?locale=en-us`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_key': API_KEY,
          'authorization': MANAGEMENT_TOKEN || DELIVERY_TOKEN,
        },
        body: JSON.stringify(requestBody)
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      logger.error('Sign up failed:', errorData.error_message);
      throw new Error(errorData.error_message || 'Failed to create account');
    }
    const data = await response.json();
    logger.success('User account created successfully');
    if (data.entry && data.entry.uid) {
      await publishEntry(data.entry.uid);
    }
    return {
      uid: data.entry.uid,
      username: data.entry.username,
      email: data.entry.email,
      created_on: data.entry.created_on
    };
  } catch (error) {
    logger.error('Sign up failed:', error.message);
    throw error;
  }
};

export const signInUser = async (email, password) => {
  if (!API_KEY || !DELIVERY_TOKEN) {
    throw new Error('Contentstack auth not configured');
  }
  try {
    const query = { email: email.toLowerCase() };
    let user = null;

    // Prefer Management API first so we get the full entry including password (Delivery often omits it)
    if (MANAGEMENT_TOKEN) {
      const managementResponse = await fetch(
        `${MANAGEMENT_URL}/content_types/signup_user/entries?query=${JSON.stringify(query)}&locale=en-us`,
        {
          headers: {
            'api_key': API_KEY,
            'authorization': MANAGEMENT_TOKEN,
          }
        }
      );

      if (managementResponse.ok) {
        const managementData = await managementResponse.json();
        if (managementData.entries && managementData.entries.length > 0) {
          user = managementData.entries[0];
          logger.info('User found via Management API');
        }
      }
    }

    if (!user) {
      const deliveryResponse = await fetch(
        `${BASE_URL}/content_types/signup_user/entries?environment=${ENVIRONMENT}&query=${JSON.stringify(query)}`,
        {
          headers: {
            'api_key': API_KEY,
            'access_token': DELIVERY_TOKEN,
          }
        }
      );
      if (deliveryResponse.ok) {
        const deliveryData = await deliveryResponse.json();
        if (deliveryData.entries && deliveryData.entries.length > 0) {
          user = deliveryData.entries[0];
          // Delivery API may omit password; fetch full entry from Management to verify
          if ((user.password === undefined || user.password === null) && MANAGEMENT_TOKEN && user.uid) {
            const fullEntry = await getEntryDetails(user.uid);
            if (fullEntry && fullEntry.password != null) {
              user = { ...user, password: fullEntry.password };
            }
          }
        }
      }
    }

    if (!user) throw new Error('Invalid email or password');

    if (user.password == null) {
      logger.error('Login: password not available from API (check Contentstack field visibility)');
      throw new Error('Invalid email or password');
    }
    const decrypted = decryptPassword(user.password);
    if (decrypted !== password) throw new Error('Invalid email or password');

    logger.success('Sign in successful');

    if (MANAGEMENT_TOKEN) {
      await updateLastLogin(user.uid);
    }

    return {
      uid: user.uid,
      username: user.username,
      email: user.email,
      created_on: user.created_on,
      last_login: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Sign in failed:', error.message);
    throw error;
  }
};

const updateLastLogin = async (userUid) => {
  try {
    if (!MANAGEMENT_TOKEN) return;
    const existing = await getEntryDetails(userUid);
    if (!existing) return;
    const lastLogin = new Date().toISOString();
    const requestBody = {
      entry: {
        title: existing.title,
        username: existing.username,
        email: existing.email,
        password: existing.password,
        created_on: existing.created_on,
        last_login: lastLogin,
      },
    };
    const response = await fetch(
      `${MANAGEMENT_URL}/content_types/signup_user/entries/${userUid}?locale=en-us`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'api_key': API_KEY,
          'authorization': MANAGEMENT_TOKEN,
        },
        body: JSON.stringify(requestBody)
      }
    );
    if (response.ok) await publishEntry(userUid);
  } catch (error) {
    logger.error('Failed to update last login:', error.message);
  }
};

const getEntryDetails = async (entryUid) => {
  try {
    if (!MANAGEMENT_TOKEN) return null;
    const response = await fetch(
      `${MANAGEMENT_URL}/content_types/signup_user/entries/${entryUid}?locale=en-us`,
      {
        headers: {
          'Content-Type': 'application/json',
          'api_key': API_KEY,
          'authorization': MANAGEMENT_TOKEN,
        }
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.entry;
    }
    return null;
  } catch (error) {
    logger.error('Failed to get entry details:', error.message);
    return null;
  }
};

const publishEntry = async (entryUid) => {
  try {
    if (!MANAGEMENT_TOKEN) return;
    const entryDetails = await getEntryDetails(entryUid);
    if (!entryDetails) return;
    const publishPayload = {
      entry: {
        environments: [ENVIRONMENT],
        locales: ['en-us']
      }
    };
    if (entryDetails._version) {
      publishPayload.entry.version = entryDetails._version;
    }
    const response = await fetch(
      `${MANAGEMENT_URL}/content_types/signup_user/entries/${entryUid}/publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_key': API_KEY,
          'authorization': MANAGEMENT_TOKEN,
        },
        body: JSON.stringify(publishPayload)
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 422 && (errorData?.error_message?.includes('already published') || errorData?.error_code === 'ENTRY_ALREADY_PUBLISHED')) {
        return;
      }
      logger.warn(`Publish skipped (${response.status})`);
    } else {
      logger.success('Entry published');
    }
  } catch (error) {
    logger.error('Publish failed:', error.message);
  }
};

