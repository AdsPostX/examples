import { useState, useCallback } from 'react';
import { fetchOffers } from '../services/api';
import { PrefetchMethod } from '../utils/prefetch_method';

/**
 * Custom hook for managing offers-related business logic
 * @param {Object} params - Hook parameters
 * @param {Function} params.onStartPrefetch - Callback to notify when API prefetch starts
 * @returns {Object} Hook state and methods
 */
export const useOffers = ({ onStartPrefetch }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [prefetchMethod, setPrefetchMethod] = useState(PrefetchMethod.NONE);

  /**
   * Resets all offers-related state
   */
  const reset = useCallback(() => {
    // Reset API-related state
    setLoading(false);
    setError(null);
    setResponse(null);
    setPrefetchMethod(PrefetchMethod.NONE);
  }, []);

  /**
   * Validates SDK ID
   * @param {string} sdkId - SDK ID to validate
   * @returns {boolean} - Whether the SDK ID is valid
   */
  const validateSdkId = useCallback(sdkId => {
    if (!sdkId || sdkId.trim() === '') {
      setError('SDK ID is required');
      return false;
    }
    return true;
  }, []);

  /**
   * Fetches offers using the provided parameters
   * @param {Object} params - Parameters for fetching offers
   * @param {string} params.sdkId - SDK ID
   * @param {string} [params.loyaltyBoost='0'] - Loyalty boost value ('0', '1', or '2')
   * @param {string} [params.creative='0'] - Creative value ('0' or '1')
   * @param {string|null} [params.campaignId=null] - Optional campaign ID
   * @param {boolean} [params.isDevelopment=false] - Whether to use development mode
   * @param {Object} [params.payload={}] - Additional payload data
   */
  const getOffers = useCallback(
    async ({
      sdkId,
      loyaltyBoost = '0',
      creative = '0',
      campaignId = null,
      isDevelopment = false,
      payload = {},
    }) => {
      if (!validateSdkId(sdkId)) {
        return;
      }

      // Clear previous state
      setLoading(true);
      setError(null);
      setResponse(null);
      setPrefetchMethod(PrefetchMethod.API);

      // Notify parent to clear WebSDK errors
      onStartPrefetch?.();

      try {
        const apiResponse = await fetchOffers({
          sdkId,
          loyaltyBoost,
          creative,
          campaignId,
          isDevelopment,
          payload,
        });

        // Store the complete response
        setResponse(apiResponse);
      } catch (err) {
        setError(err.message);
        setResponse(null);
      } finally {
        setLoading(false);
      }
    },
    [validateSdkId, onStartPrefetch],
  );

  return {
    loading,
    error,
    response,
    getOffers,
    prefetchMethod,
    setError,
    reset,
  };
};
