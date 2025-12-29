/**
 * useOffers.js
 *
 * Custom hook that manages the business logic and state for offers feature.
 * Handles offer fetching, loading states, error handling, and offer lifecycle.
 *
 * Key Features:
 * - Manages API calls to fetch offers and styles
 * - Tracks loading and error states
 * - Handles offer closure with tracking pixel support
 * - Provides state reset functionality
 * - Maintains clean state management
 */
import {useState, useCallback} from 'react';
import {getOffers, fireOfferPixel} from '../services/OffersService';
import Logger from '../utils/logger';

/**
 * Custom hook for offer management
 *
 * Provides a comprehensive interface for working with offers including:
 * - Data fetching
 * - State management
 * - Error handling
 * - Lifecycle events
 *
 * @returns {Object} Hook state and methods
 *   @returns {Array|null} offers - Array of offer objects or null if not loaded
 *   @returns {Array|null} apiStyles - Array of style objects or null if not loaded
 *   @returns {boolean} isOfferClosed - Whether the current offer is closed
 *   @returns {boolean} isLoading - Whether offers are currently being fetched
 *   @returns {string|null} error - Error message if fetch failed, null otherwise
 *   @returns {Function} fetchOffers - Function to fetch offers from API
 *   @returns {Function} handleCloseOffer - Function to handle offer closure (fires tracking pixel if configured)
 *   @returns {Function} resetStates - Function to completely reset the hook state
 */
export const useOffers = () => {
  // State Management
  /** @type {[Array|null, Function]} Offers data and setter */
  const [offers, setOffers] = useState(null);

  /** @type {[Array|null, Function]} Styles data and setter */
  const [apiStyles, setApiStyles] = useState(null);

  /** @type {[boolean, Function]} Offer closed state and setter */
  const [isOfferClosed, setOfferClosed] = useState(false);

  /** @type {[boolean, Function]} Loading state and setter */
  const [isLoading, setIsLoading] = useState(false);

  /** @type {[string|null, Function]} Error state and setter */
  const [error, setError] = useState(null);

  /**
   * Resets all hook states to initial values
   *
   * Clears:
   * - Offers data
   * - Styles data
   * - Closed state
   * - Error state
   */
  const resetStates = useCallback(() => {
    setOffers(null);
    setApiStyles(null);
    setOfferClosed(false);
    setError(null);
  }, []);

  /**
   * Fetches offers from the API
   *
   * Manages loading and error states during the fetch process:
   * 1. Sets loading state
   * 2. Clears any previous errors
   * 3. Attempts to fetch offers
   * 4. Updates state based on result
   * 5. Clears loading state
   *
   * @async
   * @param {string} apiKey - API key for authentication
   * @param {string} [loyaltyBoost] - Optional loyalty boost parameter
   * @param {string} [creative] - Optional creative parameter
   * @param {boolean} [isDevelopment=false] - Development mode flag
   * @param {Object} [payload={}] - Additional payload data
   * @param {string|null} [campaignId=null] - Campaign ID
   * @returns {Promise<void>}
   */
  const fetchOffers = useCallback(
    async ({
      apiKey,
      loyaltyBoost,
      creative,
      isDevelopment = false,
      payload = {},
      campaignId = null,
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getOffers({
          apiKey,
          loyaltyBoost,
          creative,
          isDevelopment,
          payload,
          campaignId,
        });
        setOffers(response.offers);
        setApiStyles(response.styles);
      } catch (err) {
        Logger.log('Error in fetchOffers:', err);
        setError('Failed to load offers');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Handles the closure of an offer
   *
   * Performs the following actions:
   * 1. Fires tracking pixel if required
   * 2. Updates offer closed state
   * 3. Logs debug information in development
   *
   * @param {number} currentIndex - Index of the offer being closed
   * @param {boolean} shouldFirePixel - Whether to fire tracking pixel
   */
  const handleCloseOffer = useCallback(
    (currentIndex, shouldFirePixel) => {
      Logger.log('Close button tapped');

      if (shouldFirePixel && offers && offers[currentIndex]?.beacons?.close) {
        fireOfferPixel(offers[currentIndex].beacons.close);
      }

      setOfferClosed(true);
    },
    [offers],
  );


  // Return state and handlers
  return {
    // State
    offers, // Current offers data
    apiStyles, // Current styles data
    isOfferClosed, // Whether offers are closed
    isLoading, // Loading state
    error, // Error state

    // Handlers
    fetchOffers, // Fetch offers from API
    handleCloseOffer, // Handle offer closure
    resetStates, // Reset function for clearing state
  };
};
