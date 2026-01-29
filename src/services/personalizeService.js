/**
 * Personalize service - same env vars as CineVerse.
 * REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID, edge API URL.
 * When configured, could integrate Contentstack Personalize; for now just reads and logs.
 */

import logger from '../utils/logger';

const PERSONALIZE_PROJECT_UID = process.env.REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID;
const PERSONALIZE_EDGE_API_URL =
  process.env.REACT_APP_PERSONALIZE_EDGE_API_URL ||
  process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL ||
  'https://personalize-edge.contentstack.com';

if (!PERSONALIZE_PROJECT_UID) {
  logger.info('[Personalize] REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID not set - personalization disabled.');
}

logger.group('Personalize Configuration');
logger.info(`Project UID: ${PERSONALIZE_PROJECT_UID ? 'Configured' : 'Missing'}`);
logger.info(`Edge API URL: ${PERSONALIZE_EDGE_API_URL}`);
logger.groupEnd();

/**
 * Get variant alias string for Contentstack .variants() API.
 * Returns empty string when not configured (same pattern as CineVerse).
 */
export const getVariantAlias = () => {
  if (!PERSONALIZE_PROJECT_UID) return '';
  // When SDK is integrated, return variant alias from SDK
  return '';
};

export default {
  getVariantAlias,
};
