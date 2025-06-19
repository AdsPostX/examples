import { Platform } from 'react-native';

/**
 * Generates a unique value using timestamp and random number
 * @returns {string} A unique string value
 */
export const generateUniqueValue = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${timestamp}_${random}`;
};

/**
 * Generates a WebView-like user agent string based on the platform
 * @returns {string} Platform-specific WebView user agent string
 */
// please note here we have used static user agent value for demo purpose, you can generate dynamic user agent value based on your requirements.
export const generateUserAgent = () => {
  if (Platform.OS === 'ios') {
    // iOS WebView User Agent format
    return 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
  } else {
    // Android WebView User Agent format
    return 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36';
  }
};
