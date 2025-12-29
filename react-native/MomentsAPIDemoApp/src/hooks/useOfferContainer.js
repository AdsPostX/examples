import {useState, useEffect, useCallback} from 'react';
import {openURL} from '../utils/Util';
import {fireOfferPixel} from '../services/OffersService';
import Logger from '../utils/logger';

/**
 * Custom hook to manage offer container business logic
 *
 * Manages the state and interactions for a carousel of offers including:
 * - Navigation between offers
 * - Tracking via pixels/beacons
 * - URL handling
 * - CTA (Call-to-Action) interactions
 *
 * Key Features:
 * - Tracks current offer and its index in the carousel
 * - Automatically fires tracking pixels on offer change
 * - Handles navigation (next/previous) with boundary checks
 * - Manages all user interactions (positive/negative CTA, image click, close)
 * - Integrates with external services for URL opening and pixel firing
 *
 * @param {Array<Object>} offers - Array of offer objects with structure:
 *   @param {string} offers[].pixel - Tracking pixel URL for offer impression
 *   @param {string} offers[].click_url - URL to open when offer is clicked
 *   @param {Object} offers[].beacons - Tracking beacon URLs
 *   @param {string} offers[].beacons.no_thanks_click - URL to fire when negative CTA clicked
 *   @param {string} offers[].beacons.close - URL to fire when offer is closed
 * @param {Function} onCloseOfferCTA - Callback when offer is closed
 *   @param {number} currentIndex - Index of current offer
 *   @param {boolean} shouldClose - Whether to close the offer container
 *
 * @returns {Object} Hook state and handlers
 *   @returns {Object} currentOffer - Currently displayed offer
 *   @returns {number} currentIndex - Index of current offer
 *   @returns {Function} goToNextOffer - Navigate to next offer or close if at end
 *   @returns {Function} goToPreviousOffer - Navigate to previous offer if not at start
 *   @returns {Function} handlePositiveCTA - Handle positive button click (opens URL and navigates)
 *   @returns {Function} handleNegativeCTA - Handle negative button click (fires beacon and navigates)
 *   @returns {Function} handleImageCTA - Handle image click (opens URL if available)
 *   @returns {Function} handleClose - Handle close button click (triggers close callback)
 */
export const useOfferContainer = (offers, onCloseOfferCTA) => {
  // Track current offer and its index
  const [currentOffer, setCurrentOffer] = useState(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  /**
   * Effect to update current offer and fire tracking pixels
   *
   * Fires both the main pixel and additional advertiser pixel (if available)
   * whenever the current offer index changes.
   *
   * Includes boundary check to prevent invalid index access if the offers
   * array changes while the user is viewing offers.
   */
  useEffect(() => {
    // Boundary check: Reset to first offer if index is out of bounds
    if (currentOfferIndex >= offers.length) {
      Logger.log('Offer index out of bounds, resetting to 0');
      setCurrentOfferIndex(0);
      return;
    }

    // Additional safety check: Ensure offers array is not empty
    if (offers.length === 0) {
      Logger.log('No offers available');
      setCurrentOffer(null);
      return;
    }

    // Update current offer and fire tracking pixels
    setCurrentOffer(offers[currentOfferIndex]);
    Logger.log('Firing pixel/beacon now');
    fireOfferPixel(offers[currentOfferIndex]?.pixel);
    fireOfferPixel(offers[currentOfferIndex]?.adv_pixel_url);
  }, [currentOfferIndex, offers]);

  /**
   * Navigate to next offer or close if at end
   *
   * @param {boolean} shouldClose - Whether to trigger close callback when at end
   */
  const goToNextOffer = useCallback(
    shouldClose => {
      Logger.log('Go to next Offer tapped');

      if (currentOfferIndex === offers.length - 1) {
        if (shouldClose) {
          onCloseOfferCTA(currentOfferIndex, shouldClose);
        }
        return;
      }
      setCurrentOfferIndex(prev => prev + 1);
    },
    [currentOfferIndex, offers.length, onCloseOfferCTA],
  );

  /**
   * Navigate to previous offer if not at start
   *
   * No action taken if already at first offer
   */
  const goToPreviousOffer = useCallback(() => {
    if (currentOfferIndex === 0) {
      return;
    }
    Logger.log('Go to previous Offer tapped');
    setCurrentOfferIndex(prev => prev - 1);
  }, [currentOfferIndex]);

  /**
   * Handle positive CTA button click
   *
   * Opens the offer URL (if available) and navigates to next offer
   */
  const handlePositiveCTA = useCallback(() => {
    Logger.log('Positive CTA clicked');
    Logger.log('Opening link URL');

    if (currentOffer?.click_url) {
      openURL(currentOffer.click_url);
    }
    goToNextOffer(true);
  }, [currentOffer, goToNextOffer]);

  /**
   * Handle negative CTA button click
   *
   * Fires the 'no thanks' beacon and navigates to next offer
   */
  const handleNegativeCTA = useCallback(() => {
    Logger.log('Negative CTA clicked');
    Logger.log('Firing no thanks beacon');

    fireOfferPixel(currentOffer?.beacons?.no_thanks_click);
    goToNextOffer(true);
  }, [currentOffer, goToNextOffer]);

  /**
   * Handle offer image click
   *
   * Opens the offer URL if available
   */
  const handleImageCTA = useCallback(() => {
    if (currentOffer?.click_url) {
      openURL(currentOffer.click_url);
    }
  }, [currentOffer]);

  /**
   * Handle close button click
   *
   * Triggers the close callback with current index
   */
  const handleClose = useCallback(() => {
    onCloseOfferCTA(currentOfferIndex, true);
  }, [currentOfferIndex, onCloseOfferCTA]);

  return {
    currentOffer: offers[currentOfferIndex],
    currentIndex: currentOfferIndex,
    goToNextOffer,
    goToPreviousOffer,
    handlePositiveCTA,
    handleNegativeCTA,
    handleImageCTA,
    handleClose,
  };
};
