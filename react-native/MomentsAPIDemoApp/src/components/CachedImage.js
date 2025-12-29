import React, {useState} from 'react';
import {View, ActivityIndicator, StyleSheet, Image} from 'react-native';
import {Colors} from '../constants/theme';

/**
 * CachedImage Component
 *
 * A wrapper around React Native's Image component that provides:
 * - Loading indicators
 * - Error handling with fallback UI
 * - Multiple resize modes
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.uri - Image URI to load
 * @param {Object} [props.style] - Style object for the image container
 * @param {string} [props.resizeMode='contain'] - Resize mode: 'contain', 'cover', 'stretch', 'center'
 * @param {string} [props.priority='normal'] - Loading priority (ignored, kept for compatibility)
 * @param {boolean} [props.showLoader=true] - Whether to show loading indicator
 * @param {Function} [props.onLoad] - Callback when image loads successfully
 * @param {Function} [props.onError] - Callback when image fails to load
 * @param {boolean} [props.accessible=false] - Whether the image is accessible
 * @param {string} [props.accessibilityLabel] - Accessibility label for screen readers
 */
const CachedImage = ({
  uri,
  style,
  resizeMode = 'contain',
  priority = 'normal',
  showLoader = true,
  onLoad,
  onError,
  accessible = false,
  accessibilityLabel,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  /**
   * Handle successful image load
   */
  const handleLoad = () => {
    setLoading(false);
    setError(false);
    if (onLoad) {
      onLoad();
    }
  };

  /**
   * Handle image load error
   * @param {Error} e - Error object
   */
  const handleError = e => {
    setLoading(false);
    setError(true);
    if (onError) {
      onError(e);
    }
  };

  // Don't render anything if no URI provided
  if (!uri) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        style={StyleSheet.absoluteFill}
        source={{uri: uri}}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
      />

      {/* Loading Indicator */}
      {loading && showLoader && !error && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}

      {/* Error State - show empty background */}
      {error && <View style={styles.errorContainer} />}
    </View>
  );
};

/**
 * Preload images into cache
 * @param {Array<Object>} images - Array of image objects with {uri} property
 * @returns {Promise} Promise that resolves when preloading is complete
 *
 * @example
 * await CachedImage.preload([
 *   {uri: 'https://example.com/image1.jpg'},
 *   {uri: 'https://example.com/image2.jpg'}
 * ]);
 */
CachedImage.preload = images => {
  return Image.prefetch(images.map(img => img.uri));
};

/**
 * Clear all cached images from disk
 * @returns {Promise} Promise that resolves when cache is cleared
 *
 * @example
 * await CachedImage.clearCache();
 */
CachedImage.clearCache = () => {
  // React Native Image doesn't have a clear cache method
  return Promise.resolve();
};

/**
 * Clear cached images from memory only
 * @returns {Promise} Promise that resolves when memory cache is cleared
 *
 * @example
 * await CachedImage.clearMemoryCache();
 */
CachedImage.clearMemoryCache = () => {
  // React Native Image doesn't have a clear memory cache method
  return Promise.resolve();
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
  },
});

export default CachedImage;
