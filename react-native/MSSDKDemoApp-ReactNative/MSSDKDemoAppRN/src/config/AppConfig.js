import { API_BASE_URL, SDK_CDN_URL, SDK_DEFAULT_ID } from '@env';

/**
 * Application Configuration
 *
 * This file contains all the configuration constants used throughout the application.
 * Values are loaded from environment variables (.env file)
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  /**
   * Base URL for the API endpoints
   * @type {string}
   */
  BASE_URL: API_BASE_URL,
};

/**
 * SDK Configuration
 */
export const SDK_CONFIG = {
  /**
   * CDN URL for the SDK launcher script
   * @type {string}
   */
  CDN_URL: SDK_CDN_URL,

  /**
   * Default SDK ID used in the application
   * @type {string}
   */
  DEFAULT_ID: SDK_DEFAULT_ID,
};

/**
 * Validate environment variables
 * This ensures all required environment variables are present
 */
const validateEnvVariables = () => {
  const required = {
    API_BASE_URL,
    SDK_CDN_URL,
    SDK_DEFAULT_ID,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
};

// Run validation when the config is imported
validateEnvVariables();
