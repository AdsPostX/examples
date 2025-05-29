/**
 * useOffers.js
 *
 * Custom hook that manages the business logic and state for offers feature.
 * Handles offer fetching, loading states, error handling, and offer lifecycle.
 */
import {useState, useCallback} from 'react';
import {getOffers} from '../services/OffersService';
import {firePixel} from '../utils/Util';

/**
 * Custom hook for offer management
 *
 * @returns {Object} Hook state and methods
 *   @returns {Array|null} offers - Array of offer objects or null if not loaded
 *   @returns {boolean} isOfferClosed - Whether the current offer is closed
 *   @returns {boolean} isLoading - Whether offers are currently being fetched
 *   @returns {string|null} error - Error message if fetch failed, null otherwise
 *   @returns {Function} fetchOffers - Function to fetch offers from API
 *   @returns {Function} handleCloseOffer - Function to handle offer closure
 *   @returns {Function} reloadOffers - Function to reload offers and reset state
 */
export const useOffers = () => {
  // State Management
  /** @type {[Array|null, Function]} Offers data and setter */
  const [offers, setOffers] = useState(null);

  /** @type {[boolean, Function]} Offer closed state and setter */
  const [isOfferClosed, setOfferClosed] = useState(false);

  /** @type {[boolean, Function]} Loading state and setter */
  const [isLoading, setIsLoading] = useState(false);

  /** @type {[string|null, Function]} Error state and setter */
  const [error, setError] = useState(null);

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
   * @returns {Promise<void>}
   */
  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const offersData = await getOffers();
      setOffers(offersData);
    } catch (err) {
      setError('Failed to load offers');
      if (__DEV__) {
        console.log('Error in fetchOffers:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      if (__DEV__) {
        console.log('[MomentScienceAPIDemo] close button tapped');
      }

      // Fire tracking pixel if required and available
      if (shouldFirePixel && offers && offers[currentIndex]?.beacons?.close) {
        firePixel(offers[currentIndex].beacons.close);
      }

      setOfferClosed(true);
    },
    [offers],
  );

  /**
   * Reloads offers and resets the view state
   *
   * Performs the following actions in sequence:
   * 1. Resets the closed state
   * 2. Clears existing offers
   * 3. Shows loading indicator
   * 4. Initiates new offer fetch
   *
   * This ensures a clean slate when reloading offers and
   * provides immediate feedback to the user via loading state.
   */
  const reloadOffers = useCallback(() => {
    setOfferClosed(false); // Reset closed state
    setOffers(null); // Clear existing offers
    setIsLoading(true); // Show loading immediately
    fetchOffers(); // Fetch new offers
  }, [fetchOffers]);

  // Return state and handlers
  return {
    // State
    offers, // Current offers data
    isOfferClosed, // Whether offers are closed
    isLoading, // Loading state
    error, // Error state

    // Handlers
    fetchOffers, // Fetch offers from API
    handleCloseOffer, // Handle offer closure
    reloadOffers, // Reload offers and reset state
  };
};
