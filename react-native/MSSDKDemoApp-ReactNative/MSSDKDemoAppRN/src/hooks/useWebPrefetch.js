import { useState, useCallback, useEffect, useRef } from 'react';
import { getWebSDKHtml } from '../utils/webSDKUtils';
import { PrefetchMethod } from '../utils/prefetch_method';

/**
 * Custom hook for managing WebSDK integration
 * @param {Object} params - Hook parameters
 * @param {Function} params.onStartPrefetch - Callback to notify when WebSDK prefetch starts
 * @returns {Object} Hook state and methods
 */
export const useWebPrefetch = ({ onStartPrefetch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [webViewHtml, setWebViewHtml] = useState(null);
  const [offersCount, setOffersCount] = useState(0);
  const [prefetchMethod, setPrefetchMethod] = useState(PrefetchMethod.NONE);
  const timeoutRef = useRef(null);

  /**
   * Validates SDK ID
   * @param {string} sdkId - SDK ID to validate
   * @returns {string|null} Error message if invalid, null if valid
   */
  const validateSdkId = useCallback(id => {
    if (!id || id.trim() === '') {
      return 'SDK ID is required';
    }
    return null;
  }, []);

  // Clear timeout on unmount or when loading state changes
  useEffect(() => {
    if (!isLoading && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [isLoading]);

  /**
   * Starts the prefetch process
   * @param {string} sdkId - SDK ID to use for prefetch
   * @param {Object} payload - Payload to pass to getWebSDKHtml
   */
  const startPrefetch = useCallback(
    async (sdkId, payload) => {
      // Clear previous state
      setError(null);
      setOffersCount(0);
      setPrefetchMethod(PrefetchMethod.WEB_SDK);

      // Notify parent to clear API errors
      onStartPrefetch?.();

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Validate SDK ID
      const validationError = validateSdkId(sdkId);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsLoading(true);
      try {
        // Pass payload to getWebSDKHtml
        const html = getWebSDKHtml(sdkId, payload);
        setWebViewHtml(html);

        // Start timeout to handle invalid SDK IDs
        timeoutRef.current = setTimeout(() => {
          setError('WebSDK initialization timeout. Please check your SDK ID.');
          setIsLoading(false);
        }, 10000);
      } catch (err) {
        setError('Failed to get offers');
        setIsLoading(false);
      }
    },
    [validateSdkId, onStartPrefetch],
  );

  /**
   * Handles messages from the WebView
   * @param {Object} message - The message received from WebView
   */
  const handleMessage = useCallback(message => {
    try {
      const data = JSON.parse(message.nativeEvent.data);
      console.log('Parsed WebView message:', data);

      if (data.name === 'ads_found') {
        setOffersCount(data.total || 0);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error parsing WebView message:', err);
      setError('Failed to process WebView message');
      setIsLoading(false);
    }
  }, []);

  /**
   * Resets the WebSDK state
   */
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setError(null);
    setWebViewHtml(null);
    setOffersCount(0);
    setPrefetchMethod(PrefetchMethod.NONE);
  }, []);

  return {
    isLoading,
    error,
    webViewHtml,
    offersCount,
    prefetchMethod,
    startPrefetch,
    handleMessage,
    reset,
    setError,
  };
};
