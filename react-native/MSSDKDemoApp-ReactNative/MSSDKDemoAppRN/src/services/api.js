/**
 * API Service for handling offer-related API calls
 */

import { API_CONFIG } from '../config/AppConfig';
import { generateUserAgent } from '../utils/helpers';

/**
 * Fetches offers from the API
 * @param {Object} params - Parameters for the API call
 * @param {string} params.sdkId - SDK ID
 * @param {string} [params.loyaltyBoost='0'] - Loyalty boost value ('0', '1', or '2')
 * @param {string} [params.creative='0'] - Creative value ('0' or '1')
 * @param {string|null} [params.campaignId=null] - Optional campaign ID, defaults to null
 * @param {boolean} [params.isDevelopment=false] - Whether to use development mode
 * @param {Object} [params.payload={}] - Additional payload data
 * @returns {Promise<Object>} API response
 */
export const fetchOffers = async ({
  sdkId,
  loyaltyBoost = '0',
  creative = '0',
  campaignId = null,
  isDevelopment = false,
  payload = {},
}) => {
  if (!sdkId) {
    throw new Error('SDK ID is required');
  }

  // Validate loyaltyBoost
  if (!['0', '1', '2'].includes(loyaltyBoost)) {
    throw new Error('Invalid loyaltyBoost value. Must be "0", "1", or "2"');
  }

  // Validate creative
  if (!['0', '1'].includes(creative)) {
    throw new Error('Invalid creative value. Must be "0" or "1"');
  }

  try {
    // Create base query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('api_key', sdkId);
    queryParams.append('loyaltyboost', loyaltyBoost);
    queryParams.append('creative', creative);

    // Add campaignId if provided
    if (campaignId !== null) {
      queryParams.append('campaignId', campaignId);
    }

    // Get user agent from payload or generate it
    const userAgent = payload.ua || generateUserAgent();

    // Construct request options
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
      },
      body: JSON.stringify({
        ...(isDevelopment ? { dev: 1 } : {}),
        ...payload,
      }),
    };

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/offers.json?${queryParams.toString()}`,
      requestOptions,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `API request failed with status ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch offers: ${error.message}`);
  }
};
