/**
 * OfferModel.js
 * Defines the data structure for an Offer
 */

/**
 * Represents an Offer object with properties and metadata
 * @typedef {Object} Offer
 * @property {string} id - Unique identifier for the offer
 * @property {string} title - Title of the offer
 * @property {string} description - Description of the offer
 * @property {string} image - URL to the offer image
 * @property {string} click_url - URL to open when offer is clicked
 * @property {string} cta_yes - Text for positive call to action
 * @property {string} cta_no - Text for negative call to action
 * @property {Object} beacons - Tracking beacons for various events
 * @property {string} beacons.close - URL to ping when offer is closed
 * @property {string} beacons.no_thanks_click - URL to ping when negative CTA is clicked
 * @property {string} pixel - URL to ping for impression tracking
 */

/**
 * Transforms raw API response data into a normalized Offer model
 * @param {Object} rawOffer - Raw offer data from API
 * @returns {Offer} Normalized offer object
 */
export const normalizeOffer = rawOffer => {
  return {
    id: rawOffer.id || generateOfferId(),
    title: rawOffer.title || rawOffer.name || '',
    description: rawOffer.description || '',
    image: rawOffer.image || rawOffer.creative_url || '',
    click_url: rawOffer.click_url || '',
    cta_yes: rawOffer.cta_yes || 'Yes',
    cta_no: rawOffer.cta_no || 'No, Thanks',
    beacons: {
      close: rawOffer.beacons?.close || null,
      no_thanks_click: rawOffer.beacons?.no_thanks_click || null,
    },
    pixel: rawOffer.pixel || null,
  };
};

/**
 * Generates a unique ID for an offer when one is not provided
 * @returns {string} A unique ID
 */
const generateOfferId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};
