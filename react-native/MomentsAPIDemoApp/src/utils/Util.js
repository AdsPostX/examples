/**
 * Util.js
 *
 * Utility functions for common operations across the application.
 * Includes device-specific operations, URL handling, and tracking functionality.
 */
import axios from 'axios';
import {Linking, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

/**
 * Generates a platform-specific unique identifier for the device
 *
 * Platform-specific implementations:
 * - iOS: Uses IDFV (Vendor Identifier)
 * - Android: Uses AndroidID
 * - Other platforms: Returns 'unknown'
 *
 * @returns {string} Unique device identifier
 */
export const generateUniqueID = () => {
  return Platform.select({
    ios: DeviceInfo.getUniqueId(), // IDFV for iOS
    android: DeviceInfo.getAndroidId(), // AndroidID for Android
    default: 'unknown',
  });
};

/**
 * Fires a tracking pixel by making a GET request to the specified URL
 * Used for analytics and tracking purposes
 *
 * Features:
 * - Silent failure (doesn't throw errors)
 * - Debug logging in development
 * - No return value (fire and forget)
 *
 * @param {string} url - The URL to send the tracking request to
 */
export const firePixel = url => {
  if (url) {
    if (__DEV__) {
      console.log('[MomentScienceAPIDemo] Inside fire pixel');
    }

    axios
      .get(url)
      .then(response => {
        if (__DEV__) {
          console.log(
            '[MomentScienceAPIDemo] fire pixel Success:',
            response.data,
          );
        }
      })
      .catch(error => {
        if (__DEV__) {
          console.log('fire pixel Error:', error);
        }
      });
  }
};

/**
 * Opens a URL in the device's default browser or appropriate app
 *
 * Process:
 * 1. Checks if URL is provided
 * 2. Verifies if URL can be opened on the device
 * 3. Opens URL if supported
 * 4. Logs error in development if URL cannot be opened
 *
 * @param {string} url - The URL to open
 * @returns {Promise<void>}
 * @throws {Error} Implicitly throws if Linking operations fail
 */
export const openURL = async url => {
  if (url) {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      if (__DEV__) {
        console.log(`[MomentScienceAPIDemo] Cannot open URL: ${url}`);
      }
    }
  }
};

/**
 * Retrieves the user agent string for the current device
 *
 * Used for:
 * - API requests
 * - Device identification
 * - Platform-specific handling
 *
 * @returns {Promise<string>} Device user agent string
 */
export const getUserAgent = async () => {
  return await DeviceInfo.getUserAgent();
};
