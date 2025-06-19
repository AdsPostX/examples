import { prefetchTemplate } from '../templates/prefetch.js';
import { checkoutTemplate } from '../templates/checkout.js';
import { createAdpxUserScript } from './adpxUtils';
import { SDK_CONFIG } from '../config/AppConfig';

/**
 * Processes the HTML template by replacing placeholders with actual values
 * @param {string} template - The HTML template string
 * @param {Object} values - The values to replace in the template
 * @returns {string} The processed HTML string
 */
const processTemplate = (template, values) => {
  let result = template;
  Object.entries(values).forEach(([key, value]) => {
    result = result.replace(new RegExp(`%%${key}%%`, 'g'), value);
  });
  return result;
};

/**
 * Generates HTML content for WebSDK integration
 * @param {string} sdkId - The SDK ID to use for initialization
 * @param {Object} payload - The payload object for AdpxUser
 * @returns {string} The HTML content with SDK ID and CDN URL injected
 */
export const getWebSDKHtml = (sdkId, payload) => {
  let html = processTemplate(prefetchTemplate, {
    SDK_ID: sdkId,
    CDN_URL: SDK_CONFIG.CDN_URL,
  });

  // Create AdpxUser script with payload
  if (payload) {
    const adpxUserScript = createAdpxUserScript(payload);
    html = html.replace('window.AdpxUser = {};', adpxUserScript);
  }

  return html;
};

/**
 * Generates HTML content for Checkout screen
 * @param {Object} params - Parameters for checkout template
 * @param {string} params.sdkId - The SDK ID to use
 * @param {number} params.offersCount - Number of offers available
 * @param {string} params.autoLoadConfig - Auto load configuration string
 * @param {string} params.responseHandling - Response handling script
 * @param {string} params.adpxUserScript - Generated AdpxUser script
 * @returns {string} The processed HTML content
 */
export const getCheckoutHtml = ({
  sdkId,
  offersCount,
  autoLoadConfig,
  responseHandling,
  adpxUserScript,
}) => {
  // First replace all template variables
  let processedHtml = processTemplate(checkoutTemplate, {
    SDK_ID: sdkId,
    OFFERS_COUNT: offersCount,
    AUTOLOAD_CONFIG: autoLoadConfig,
    CDN_URL: SDK_CONFIG.CDN_URL,
    RESPONSE_HANDLING: responseHandling,
  });

  // Then replace the AdpxUser initialization
  processedHtml = processedHtml.replace(
    'window.AdpxUser = {};',
    adpxUserScript,
  );

  return processedHtml;
};
