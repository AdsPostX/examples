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
    // Enhanced error logging in development
    if (__DEV__) {
      console.log('Error in fetchMomentOffers:', error);
      console.log(
        'Error details:',
        error.response || error.request || error.message,
      );
    }
    // Propagate error for upstream handling
    throw error;
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
 * Default Configuration:
 * - loyaltyboost: '0'
 * - creative: '0'
 * - dev: '1' (sandbox mode)
 *
 * @returns {Promise<Array>} Array of normalized offer objects
 * @throws {Error} When no offers are available or API request fails
 */
export const getOffers = async () => {
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
    // Get API key from environment config
    const apiKey = Config.API_KEY;

    // Make API request
    const response = await fetchMomentOffers(apiKey, queryParameters, payload);

    // Extract offers array with fallback to empty array
    const rawOffers = response?.data?.data?.offers ?? [];

    // Throw error if no offers received
    if (rawOffers.length === 0) {
      throw new Error('No offers available');
    }

    // Normalize and return offers
    return rawOffers.map(offer => normalizeOffer(offer));
  } catch (error) {
    // Log error in development
    if (__DEV__) {
      console.log('Error while fetching offers:', error);
    }
    // Propagate error for upstream handling
    throw error;
  }
};
