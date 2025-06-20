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
 * 2. Sets up query parameters (loyaltyBoost and creative are optional)
 * 3. Generates unique user identifier
 * 4. Makes API request
 * 5. Processes and normalizes response
 * 6. Handles errors
 *
 * @param {Object} params - The parameters object
 * @param {string} params.apiKey - API key for authentication
 * @param {string} [params.loyaltyBoost] - Optional loyalty boost parameter (must be '0', '1', or '2')
 * @param {string} [params.creative] - Optional creative parameter (must be '0' or '1')
 * @param {boolean} [params.isDevelopment=false] - Development mode flag
 * @param {Object} [params.payload={}] - Additional request payload
 * @param {string|null} [params.campaignId=null] - Optional campaign ID for filtering offers
 * @returns {Promise<Object>} Object containing:
 *   @property {Array} offers - Normalized offer objects
 *   @property {Object} styles - Style configurations
 * @throws {Error} When no offers are available or API request fails
 */
export const getOffers = async ({
  apiKey,
  loyaltyBoost,
  creative,
  isDevelopment = false,
  payload = {},
  campaignId = null,
}) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  // Validate loyaltyBoost if provided and not null
  if (loyaltyBoost !== undefined) {
    if (loyaltyBoost !== null && !['0', '1', '2'].includes(loyaltyBoost)) {
      throw new Error('loyaltyBoost must be one of: "0", "1", "2", or null');
    }
  }

  // Validate creative if provided and not null
  if (creative !== undefined) {
    if (creative !== null && !['0', '1'].includes(creative)) {
      throw new Error('creative must be one of: "0", "1", or null');
    }
  }

  // Set up query parameters - only include if provided and not null
  const queryParameters = {
    ...(loyaltyBoost !== undefined &&
      loyaltyBoost !== null && {loyaltyboost: loyaltyBoost}),
    ...(creative !== undefined && creative !== null && {creative}),
    ...(campaignId !== undefined && campaignId !== null && {campaignId}),
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
