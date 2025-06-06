/**
 * OffersService.js
 *
 * Service module responsible for handling all API interactions related to offers.
 * Provides methods for fetching and processing offer data from the backend.
 *
 * Key Features:
 * - API request handling with axios
 * - Error handling and logging
 * - Request payload sanitization
 * - Response normalization
 * - Development mode support
 * - Tracking pixel implementation
 * - Offer data transformation
 */
import axios from 'axios';
import Config from 'react-native-config';
import {getUserAgent, generateUniqueID} from '../utils/Util';
import {normalizeOffer} from '../models/OfferModel';
import Logger from '../utils/logger';

/**
 * Makes a direct API call to fetch offers from the backend
 *
 * Handles the complete request lifecycle including:
 * - Header configuration
 * - Query parameter processing
 * - Payload sanitization
 * - Error handling
 *
 * @param {string} apiKey - Authentication key for API access
 * @param {Object} queryParameters - URL query parameters
 *   @param {string} [queryParameters.loyaltyboost] - Loyalty boost parameter
 *   @param {string} [queryParameters.creative] - Creative parameter
 *   @param {string} [queryParameters.api_key] - Added automatically from apiKey
 * @param {Object} payload - Request body payload
 *   @param {string} [payload.ua] - User agent string
 *   @param {string} [payload.dev] - Development mode flag
 *   @param {string} [payload.adpx_fp] - Unique user identifier
 *
 * @returns {Promise<Object>} API response object
 * @throws {Error} When API request fails
 */
const fetchMomentOffers = async (
  apiKey,
  queryParameters = {},
  payload = {},
) => {
  try {
    // Fetch or use provided user agent
    const userAgent = payload.ua ?? (await getUserAgent());

    // Set up request headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': userAgent,
    };

    // Process query parameters
    const allQueryParameters = {
      api_key: apiKey,
      ...queryParameters,
    };

    // Remove null/undefined values from query parameters
    const filteredQueryParameters = Object.fromEntries(
      Object.entries(allQueryParameters).filter(
        ([key, value]) => value !== null && value !== undefined,
      ),
    );

    // Remove null/undefined values from payload
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(
        ([key, value]) => value !== null && value !== undefined,
      ),
    );

    // Build query string for URL
    const queryString = new URLSearchParams(filteredQueryParameters).toString();

    // Construct complete API URL
    const apiUrl = `${Config.API_BASE_URL}/offers.json${
      queryString ? `?${queryString}` : ''
    }`;

    // Execute API request
    const response = await axios.post(apiUrl, filteredPayload, {headers});
    return response;
  } catch (error) {
    // Enhanced error logging
    Logger.log('Error in fetchMomentOffers:', error);
    Logger.log(
      'Error details:',
      error.response || error.request || error.message,
    );
    throw error;
  }
};

/**
 * Fires a tracking pixel for offer-related events
 *
 * Used for analytics and tracking in the offers flow.
 * Silently fails if URL is invalid or request fails.
 *
 * @param {string} url - The tracking pixel URL
 * @returns {Promise<void>}
 */
const fireOfferPixel = async url => {
  if (!url) return;

  try {
    Logger.log('Inside fire pixel:', url);

    const response = await axios.get(url);
    Logger.log('Fire pixel Success:', response.data);
  } catch (error) {
    Logger.log('Fire pixel Error:', error);
  }
};

/**
 * High-level function to fetch and process offers
 *
 * This function orchestrates the complete offer fetching process:
 * 1. Validates API key
 * 2. Sets up default query parameters
 * 3. Generates unique user identifier
 * 4. Makes API request
 * 5. Processes and normalizes response
 * 6. Handles errors
 *
 * @param {string} apiKey - API key for authentication
 * @param {string} loyaltyBoost - Loyalty boost parameter
 * @param {string} creative - Creative parameter
 * @param {boolean} isDevelopment - Development mode flag
 * @param {Object} payload - Additional request payload
 * @returns {Promise<Object>} Object containing:
 *   @property {Array} offers - Normalized offer objects
 *   @property {Object} styles - Style configurations
 * @throws {Error} When no offers are available or API request fails
 */
export const getOffers = async (
  apiKey,
  loyaltyBoost = '0',
  creative = '0',
  isDevelopment = false,
  payload = {},
) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  // Set up query parameters
  const queryParameters = {
    loyaltyboost: loyaltyBoost,
    creative: creative,
  };

  // Prepare request payload
  const requestPayload = {
    ...(isDevelopment && {dev: '1'}),
    ...payload,
  };

  try {
    // Make API request with provided API key
    const response = await fetchMomentOffers(
      apiKey,
      queryParameters,
      requestPayload,
    );

    // Extract offers array and styles
    const rawOffers = response?.data?.data?.offers ?? [];
    const styles = response?.data?.data?.styles ?? {}; // Extract styles

    // Throw error if no offers received
    if (rawOffers.length === 0) {
      throw new Error('No offers available');
    }

    // Return both normalized offers and styles
    return {
      offers: rawOffers.map(offer => normalizeOffer(offer)),
      styles: styles, // Return styles along with offers
    };
  } catch (error) {
    // Log error in development
    Logger.log('Error while fetching offers:', error);
    // Propagate error for upstream handling
    throw error;
  }
};

// Export the pixel firing function for offer-related tracking
export {fireOfferPixel};
