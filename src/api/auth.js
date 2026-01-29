import CryptoJS from 'crypto-js';
import logger from '../utils/logger';

// Environment variables - same as CineVerse (no fallbacks for security)
const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_SECRET;
const API_KEY = process.env.REACT_APP_CONTENTSTACK_API_KEY;
const DELIVERY_TOKEN = process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN;
const MANAGEMENT_TOKEN = process.env.REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'development';

if (!SECRET_KEY) {
  console.error('SECURITY ERROR: REACT_APP_ENCRYPTION_SECRET is not configured');
}
if (!API_KEY) {
  console.error('SECURITY ERROR: REACT_APP_CONTENTSTACK_API_KEY is not configured');
}
if (!DELIVERY_TOKEN) {
  console.error('SECURITY ERROR: REACT_APP_CONTENTSTACK_DELIVERY_TOKEN is not configured');
}

const BASE_URL = 'https://cdn.contentstack.io/v3';
const MANAGEMENT_URL = 'https://api.contentstack.io/v3';

logger.group('Auth Configuration');
logger.info(`API_KEY: ${API_KEY ? 'Configured' : 'Missing'}`);
logger.info(`DELIVERY_TOKEN: ${DELIVERY_TOKEN ? 'Configured' : 'Missing'}`);
logger.info(`MANAGEMENT_TOKEN: ${MANAGEMENT_TOKEN ? 'Configured' : 'Not set (localStorage only)'}`);
logger.info(`ENVIRONMENT: ${ENVIRONMENT}`);
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
        profiles: []
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
    const profiles = data.entry.profiles || [];
    return {
      uid: data.entry.uid,
      username: data.entry.username,
      email: data.entry.email,
      profiles: profiles,
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
      if (deliveryData.entries && deliveryData.entries.length > 0) user = deliveryData.entries[0];
    }
    if (!user && MANAGEMENT_TOKEN) {
      logger.info('Checking draft entries for user...');
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
        if (managementData.entries && managementData.entries.length > 0) user = managementData.entries[0];
      }
    }
    if (!user) throw new Error('Invalid email or password');
    const decrypted = decryptPassword(user.password);
    if (decrypted !== password) throw new Error('Invalid email or password');
    const profiles = user.profiles || [];
    logger.success(`Sign in successful (${profiles.length} profiles)`);
    await updateLastLogin(user.uid);
    return {
      uid: user.uid,
      username: user.username,
      email: user.email,
      profiles: profiles,
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
    const requestBody = { entry: { last_login: new Date().toISOString() } };
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
      entry: { environments: [ENVIRONMENT], locales: ['en-us'] }
    };
    if (entryDetails._version) publishPayload.entry.version = entryDetails._version;
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
      if (response.status === 422 && errorData?.error_code === 'ENTRY_ALREADY_PUBLISHED') return;
    } else {
      logger.success('Entry published');
    }
  } catch (error) {
    logger.error('Publish operation failed:', error.message);
  }
};

export const updateUserProfiles = async (userUid, profiles) => {
  try {
    if (!MANAGEMENT_TOKEN) {
      logger.warn('Management token not available, profiles saved to localStorage only');
      return profiles;
    }
    const requestBody = { entry: { profiles: profiles } };
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
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_message || 'Failed to update profiles');
    }
    const data = await response.json();
    await publishEntry(userUid);
    return data.entry.profiles || [];
  } catch (error) {
    logger.error('Profile update failed:', error.message);
    throw error;
  }
};

export const getUserByUid = async (userUid) => {
  try {
    const deliveryResponse = await fetch(
      `${BASE_URL}/content_types/signup_user/entries/${userUid}?environment=${ENVIRONMENT}`,
      {
        headers: {
          'api_key': API_KEY,
          'access_token': DELIVERY_TOKEN,
        }
      }
    );
    if (deliveryResponse.ok) {
      const data = await deliveryResponse.json();
      return {
        uid: data.entry.uid,
        username: data.entry.username,
        email: data.entry.email,
        profiles: data.entry.profiles || [],
        created_on: data.entry.created_on,
        last_login: data.entry.last_login
      };
    }
    if (MANAGEMENT_TOKEN) {
      const managementResponse = await fetch(
        `${MANAGEMENT_URL}/content_types/signup_user/entries/${userUid}?locale=en-us`,
        {
          headers: {
            'api_key': API_KEY,
            'authorization': MANAGEMENT_TOKEN,
          }
        }
      );
      if (managementResponse.ok) {
        const managementData = await managementResponse.json();
        return {
          uid: managementData.entry.uid,
          username: managementData.entry.username,
          email: managementData.entry.email,
          profiles: managementData.entry.profiles || [],
          created_on: managementData.entry.created_on,
          last_login: managementData.entry.last_login
        };
      }
    }
    throw new Error('Failed to fetch user');
  } catch (error) {
    logger.error('Failed to fetch user:', error.message);
    throw error;
  }
};
