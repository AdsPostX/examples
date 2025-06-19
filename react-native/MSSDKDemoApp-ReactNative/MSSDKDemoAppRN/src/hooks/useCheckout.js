import { useCallback } from 'react';
import { PrefetchMethod } from '../utils/prefetch_method';
import { createAdpxUserScript } from '../utils/adpxUtils';

/**
 * Gets the autoLoad configuration based on prefetch method
 * @param {boolean} isPrefetchApi - Whether the prefetch method is API
 * @returns {string} The autoLoad configuration string
 */
const getAutoLoadConfig = isPrefetchApi => {
  if (isPrefetchApi) {
    return 'autoLoad: false, prefetch: false';
  } else {
    return 'autoLoad: true, prefetch: true';
  }
};

/**
 * Creates the response handling script based on prefetch method and API response
 * @param {boolean} isPrefetchApi - Whether the prefetch method is API
 * @param {Object|null} apiResponse - The API response data
 * @returns {string} The response handling script
 */
const createResponseHandlingScript = (isPrefetchApi, apiResponse) => {
  if (isPrefetchApi && apiResponse) {
    const apiResponseJson = JSON.stringify(apiResponse);
    return `
      if (window.Adpx && window.Adpx.setApiResponse) {
        const apiResponse = ${apiResponseJson};
        window.Adpx.setApiResponse(apiResponse).then(() => {
          console.log('API response set to Adpx, now reloading...');
          window.Adpx.reload();
        });
      }
    `;
  }
  return '';
};

/**
 * Custom hook for managing checkout functionality
 * @param {Object} params - Hook parameters
 * @param {string} params.sdkId - The SDK ID
 * @param {Object|null} params.apiResponse - API response data
 * @param {string} params.prefetchMethod - The prefetch method used
 * @param {Object} params.payload - The payload data
 * @returns {Object} Hook state and methods
 */
export const useCheckout = ({
  sdkId,
  apiResponse,
  prefetchMethod,
  payload,
}) => {
  // Get autoLoad config based on prefetch method
  const getAutoLoadConfiguration = useCallback(() => {
    const isPrefetchApi = prefetchMethod === PrefetchMethod.API;
    return getAutoLoadConfig(isPrefetchApi);
  }, [prefetchMethod]);

  // Get response handling script
  const getResponseHandlingScript = useCallback(() => {
    const isPrefetchApi = prefetchMethod === PrefetchMethod.API;
    return createResponseHandlingScript(isPrefetchApi, apiResponse);
  }, [prefetchMethod, apiResponse]);

  // Get AdpxUser script
  const getAdpxUserScript = useCallback(() => {
    return createAdpxUserScript(payload);
  }, [payload]);

  // Handle WebView messages
  const handleWebViewMessage = useCallback(event => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message received:', data);

      if (data.type === 'adpxCallback') {
        console.log('Payload from WebView:', data.payload);
      }
    } catch (error) {
      console.log('Error parsing WebView message:', error);
    }
  }, []);

  // Handle WebView load
  const handleWebViewLoad = useCallback(() => {
    console.log('WebView loaded with:', {
      sdkId,
      prefetchMethod,
      hasApiResponse: !!apiResponse,
      hasPayload: !!payload,
    });
  }, [sdkId, prefetchMethod, apiResponse, payload]);

  // Handle WebView errors
  const handleWebViewError = useCallback(syntheticEvent => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView error:', nativeEvent);
  }, []);

  return {
    getAutoLoadConfiguration,
    getResponseHandlingScript,
    getAdpxUserScript,
    handleWebViewMessage,
    handleWebViewLoad,
    handleWebViewError,
  };
};
