/**
 * Creates the AdpxUser script with payload key-value pairs
 * @param {Object} payload - The payload object containing key-value pairs
 * @returns {string} The generated AdpxUser script
 */
export const createAdpxUserScript = payload => {
  let adpxUserScript = 'window.AdpxUser = {';

  if (payload && Object.keys(payload).length > 0) {
    Object.entries(payload).forEach(([key, value]) => {
      // Ensure value is properly escaped for JavaScript string
      const escapedValue = String(value).replace(/"/g, '\\"');
      adpxUserScript += `\n  ${key}: "${escapedValue}",`;
    });
    // Remove trailing comma
    adpxUserScript = adpxUserScript.slice(0, -1);
  }

  adpxUserScript += '\n};';
  return adpxUserScript;
};
