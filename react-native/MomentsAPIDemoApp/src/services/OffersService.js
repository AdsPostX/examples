/**
 * OffersService.js
 *
 * Service module responsible for handling all API interactions related to offers.
 * Provides methods for fetching and processing offer data from the backend.
 *
 * Features:
 * - API request handling with axios
 * - Error handling and logging
 * - Request payload sanitization
 * - Response normalization
 * - Development mode support
 */
import axios from 'axios';
import Config from 'react-native-config';
import {getUserAgent, generateUniqueID} from '../utils/Util';
import {normalizeOffer} from '../models/OfferModel';
import Logger from '../utils/logger';

/**
 * Makes a direct API call to fetch offers from the backend
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
export const fetchMomentOffers = async (
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
    Logger.error('Error in fetchMomentOffers:', error);
    Logger.error(
      'Error details:',
      error.response || error.request || error.message,
    );
    throw error;
  }
};

/**
 * Fires a tracking pixel for offer-related events
 * Used for analytics and tracking in the offers flow
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
    Logger.error('Fire pixel Error:', error);
  }
};

/**
 * High-level function to fetch and process offers
 *
 * This function:
 * 1. Sets up default query parameters
 * 2. Generates unique user identifier
 * 3. Makes API request
 * 4. Processes and normalizes response
 * 5. Handles errors
 *
 * @param {string} apiKey - API key for authentication
 * @returns {Promise<Object>} Object containing normalized offers and styles
 * @throws {Error} When no offers are available or API request fails
 */
export const getOffers = async apiKey => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  // Set up default query parameters
  const queryParameters = {
    loyaltyboost: '0',
    creative: '0',
  };

  // Prepare request payload
  const payload = {
    // Development mode flag
    // WARNING: Set to '0' in production or just skip it in production
    dev: '1',

    // Generate unique identifier for user tracking
    adpx_fp: (await generateUniqueID()).toString(),
  };

  try {
    // Make API request with provided API key
    const response = await fetchMomentOffers(apiKey, queryParameters, payload);

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
    Logger.error('Error while fetching offers:', error);
    // Propagate error for upstream handling
    throw error;
  }
};

// Export the pixel firing function for offer-related tracking
export {fireOfferPixel};
