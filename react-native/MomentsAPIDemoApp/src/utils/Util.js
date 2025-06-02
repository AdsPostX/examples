/**
 * Util.js
 *
 * Utility functions for common operations across the application.
 * Includes device-specific operations, URL handling, and tracking functionality.
 */
import {Linking, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Logger from './logger';

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
      Logger.warn(`Cannot open URL: ${url}`);
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
