import {useState, useEffect, useCallback} from 'react';
import {firePixel, openURL} from '../utils/Util';

/**
 * Custom hook to manage offer container business logic
 *
 * Manages the state and interactions for a carousel of offers including:
 * - Navigation between offers
 * - Tracking via pixels/beacons
 * - URL handling
 * - CTA (Call-to-Action) interactions
 *
 * @param {Array<Object>} offers - Array of offer objects with structure:
 *   @param {string} offers[].pixel - Tracking pixel URL for offer impression
 *   @param {string} offers[].click_url - URL to open when offer is clicked
 *   @param {Object} offers[].beacons - Tracking beacon URLs
 *   @param {string} offers[].beacons.no_thanks_click - URL to fire when negative CTA clicked
 *   @param {string} offers[].beacons.close - URL to fire when offer is closed
 * @param {Function} onCloseOfferCTA - Callback when offer is closed
 *   @param {number} currentIndex - Index of current offer
 *   @param {boolean} shouldFirePixel - Whether to fire tracking pixel
 *
 * @returns {Object} Hook state and handlers
 *   @returns {Object} currentOffer - Currently displayed offer
 *   @returns {Function} goToNextOffer - Navigate to next offer
 *   @returns {Function} goToPreviousOffer - Navigate to previous offer
 *   @returns {Function} handlePositiveCTA - Handle positive button click
 *   @returns {Function} handleNegativeCTA - Handle negative button click
 *   @returns {Function} handleImageCTA - Handle image click
 *   @returns {Function} handleClose - Handle close button click
 */
export const useOfferContainer = (offers, onCloseOfferCTA) => {
  // Track current offer and its index
  const [currentOffer, setCurrentOffer] = useState(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  /**
   * Effect to update current offer and fire tracking pixel
   * Runs when current offer index changes or offers array changes
   */
  useEffect(() => {
    setCurrentOffer(offers[currentOfferIndex]);
    if (__DEV__) {
      console.log('[MomentScienceAPIDemo] firing pixel/beacon now');
    }
    firePixel(offers[currentOfferIndex]?.pixel);
  }, [currentOfferIndex, offers]);

  /**
   * Navigate to next offer or close if at end
   * @param {boolean} shouldClose - Whether to close offer after navigation
   */
  const goToNextOffer = useCallback(
    shouldClose => {
      if (__DEV__) {
        console.log('[MomentScienceAPIDemo] Go to next Offer tapped');
      }

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
   */
  const goToPreviousOffer = useCallback(() => {
    if (currentOfferIndex === 0) {
      return;
    }
    if (__DEV__) {
      console.log('[MomentScienceAPIDemo] Go to previous Offer tapped');
    }
    setCurrentOfferIndex(prev => prev - 1);
  }, [currentOfferIndex]);

  /**
   * Handle positive CTA button click
   * Opens offer URL and navigates to next offer
   */
  const handlePositiveCTA = useCallback(() => {
    if (__DEV__) {
      console.log('[MomentScienceAPIDemo] positive cta clicked');
      console.log('[MomentScienceAPIDemo] opening a link url');
    }
    if (currentOffer?.click_url) {
      openURL(currentOffer.click_url);
    }
    goToNextOffer(true);
  }, [currentOffer, goToNextOffer]);

  /**
   * Handle negative CTA button click
   * Fires tracking pixel and navigates to next offer
   */
  const handleNegativeCTA = useCallback(() => {
    if (__DEV__) {
      console.log('[MomentScienceAPIDemo] negative cta clicked');
      console.log(
        '[MomentScienceAPIDemo] fire no thanks beacon when negative cta tapped...',
      );
    }
    firePixel(currentOffer?.beacons?.no_thanks_click);
    goToNextOffer(true);
  }, [currentOffer, goToNextOffer]);

  /**
   * Handle offer image click
   * Opens offer URL if available
   */
  const handleImageCTA = useCallback(() => {
    if (currentOffer?.click_url) {
      openURL(currentOffer.click_url);
    }
  }, [currentOffer]);

  /**
   * Handle close button click
   * Triggers close callback with current index
   */
  const handleClose = useCallback(() => {
    onCloseOfferCTA(currentOfferIndex, true);
  }, [currentOfferIndex, onCloseOfferCTA]);

  return {
    currentOffer,
    goToNextOffer,
    goToPreviousOffer,
    handlePositiveCTA,
    handleNegativeCTA,
    handleImageCTA,
    handleClose,
  };
};
