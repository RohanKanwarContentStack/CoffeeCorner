/**
 * CoffeeCorner data service - in-memory product catalog.
 * Can use Contentstack env vars when configured for CMS.
 */

import {
  PRODUCTS,
  CATEGORIES,
  getProductBySlug as getBySlug,
  getProductByUid as getByUid,
  getProductsByCategory as getByCategory,
  getFeaturedProducts as getFeatured,
} from '../data/products';
import logger from '../utils/logger';

// Contentstack env (used when/if CMS is enabled)
const CONTENTSTACK_API_KEY = process.env.REACT_APP_CONTENTSTACK_API_KEY;
const CONTENTSTACK_DELIVERY_TOKEN = process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN;
const CONTENTSTACK_ENVIRONMENT = process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'testing';
const CONTENTSTACK_REGION = process.env.REACT_APP_CONTENTSTACK_REGION || 'us';

const validateConfig = () => {
  if (!CONTENTSTACK_API_KEY || !CONTENTSTACK_DELIVERY_TOKEN) {
    logger.info('Contentstack not configured - using in-memory product data.');
    return false;
  }
  logger.group('Contentstack Configuration (data)');
  logger.info(`Environment: ${CONTENTSTACK_ENVIRONMENT}`);
  logger.info(`Region: ${CONTENTSTACK_REGION}`);
  logger.info(`API Key: ${CONTENTSTACK_API_KEY ? 'Configured' : 'Missing'}`);
  logger.groupEnd();
  return true;
};

validateConfig();

// In-memory store for compatibility with component patterns
const dataStore = {
  products: PRODUCTS,
  categories: CATEGORIES,
  isInitialized: true,
};

export const getAllProducts = () => [...dataStore.products];

export const getFeaturedProducts = () => getFeatured();

export const getProductBySlug = (slug) => getBySlug(slug);

export const getProductByUid = (uid) => getByUid(uid);

export const getProductsByCategory = (categorySlug) =>
  getByCategory(categorySlug);

export const getAllCategories = () => [...dataStore.categories];

export const getCategoryBySlug = (slug) =>
  dataStore.categories.find((c) => c.slug === slug) || null;

/**
 * Search products by title, description, or category name.
 */
export const searchProducts = (searchTerm) => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return [];

  return dataStore.products
    .filter((product) => {
      if (product.title?.toLowerCase().includes(term)) return true;
      if (product.description?.toLowerCase().includes(term)) return true;
      if (product.category?.name?.toLowerCase().includes(term)) return true;
      return false;
    })
    .sort((a, b) => {
      const aTitle = a.title?.toLowerCase().startsWith(term);
      const bTitle = b.title?.toLowerCase().startsWith(term);
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return 0;
    });
};

export const isDataStoreReady = () => dataStore.isInitialized;

export const getDataStoreStats = () => ({
  isInitialized: dataStore.isInitialized,
  products: dataStore.products.length,
  categories: dataStore.categories.length,
});

export default {
  getAllProducts,
  getFeaturedProducts,
  getProductBySlug,
  getProductByUid,
  getProductsByCategory,
  getAllCategories,
  getCategoryBySlug,
  searchProducts,
  isDataStoreReady,
  getDataStoreStats,
};
