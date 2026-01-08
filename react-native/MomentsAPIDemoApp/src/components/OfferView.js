import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Colors, Spacing, Typography, BorderRadius} from '../constants/theme';
import CachedImage from './CachedImage';

/**
 * OfferView Component
 *
 * Renders an individual offer with title, image, description, and call-to-action buttons.
 * All elements are optional and will only render if the corresponding prop is provided.
 *
 * Key Features:
 * - Dynamic styling based on API response
 * - Optional rendering of all UI elements (title, image, description, buttons)
 * - Click handlers for image and CTA buttons
 * - Helper function to parse pixel values from API styles
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string} [props.title] - The title of the offer
 * @param {string} [props.imageURL] - URL of the offer image
 * @param {string} [props.description] - Description text of the offer
 * @param {string} [props.clickURL] - URL to navigate to when image is clicked
 * @param {Function} [props.onImageCTA] - Callback function when image is clicked
 * @param {string} [props.positiveCTA] - Text for the positive call-to-action button
 * @param {Function} [props.onPositiveCTA] - Callback function for positive button click
 * @param {string} [props.negativeCTA] - Text for the negative call-to-action button
 * @param {Function} [props.onNegativeCTA] - Callback function for negative button click
 * @param {Object} props.apiStyles - Styles from API response (supports dynamic theming)
 */
function OfferView({
  title,
  imageURL,
  description,
  clickURL,
  onImageCTA,
  positiveCTA,
  onPositiveCTA,
  negativeCTA,
  onNegativeCTA,
  apiStyles,
}) {
  /**
   * Helper function to parse pixel values from API styles
   *
   * Safely parses pixel value strings (e.g., '16px') to numbers.
   * Includes validation to handle edge cases and invalid inputs.
   *
   * @param {string} value - The pixel value string (e.g., '16px')
   * @returns {number|undefined} - The parsed numeric value or undefined if invalid
   *
   * @example
   * parsePixelValue('16px')  // Returns: 16
   * parsePixelValue('20')    // Returns: 20
   * parsePixelValue('invalid') // Returns: undefined
   * parsePixelValue(null)    // Returns: undefined
   */
  const parsePixelValue = value => {
    // Return undefined for null, undefined, or non-string values
    if (!value || typeof value !== 'string') {
      return undefined;
    }

    // Remove 'px' suffix and any whitespace, then parse to integer
    const parsed = parseInt(value.replace(/px/gi, '').trim(), 10);

    // Return undefined if parsing resulted in NaN, otherwise return the number
    return isNaN(parsed) ? undefined : parsed;
  };

  /**
   * Dynamic styles derived from API response
   *
   * @type {Object}
   * @property {Object} title - Styles for title text
   * @property {Object} description - Styles for description text
   * @property {Object} positiveCTA - Styles for positive CTA button
   * @property {Object} positiveCTAText - Styles for positive CTA button text
   * @property {Object} negativeCTA - Styles for negative CTA button
   * @property {Object} negativeCTAText - Styles for negative CTA button text
   */
  const dynamicStyles = {
    title: {
      color: apiStyles?.textColor || '#000',
    },
    description: {
      fontSize: apiStyles?.fontSize || 16,
      color: apiStyles?.textColor || '#000',
    },
    positiveCTA: {
      backgroundColor: apiStyles?.buttonYes?.background || '#3565A9',
      fontSize: parsePixelValue(apiStyles?.cta_text_size) || 13,
      fontStyle: apiStyles?.cta_text_style || 'normal',
    },
    positiveCTAText: {
      color: apiStyles?.buttonYes?.color || '#fff',
    },
    negativeCTA: {
      backgroundColor: apiStyles?.buttonNo?.background || 'grey',
      fontSize: parsePixelValue(apiStyles?.cta_text_size) || 13,
      fontStyle: apiStyles?.cta_text_style || 'normal',
    },
    negativeCTAText: {
      color: apiStyles?.buttonNo?.color || '#fff',
    },
  };

  return (
    <View style={styles.container}>
      {/* Title Section - Optional */}
      {title && <Text style={[styles.title, dynamicStyles.title]}>{title}</Text>}

      {/* Image Section - Optional, clickable, with caching */}
      {imageURL && (
        <TouchableOpacity
          onPress={onImageCTA}
          accessibilityRole="imagebutton"
          accessibilityLabel={`Offer image: ${title || 'promotional offer'}`}
          accessibilityHint="Double tap to view offer details">
          <CachedImage
            uri={imageURL}
            resizeMode="contain"
            style={styles.image}
            priority="high"
            accessible={false}
          />
        </TouchableOpacity>
      )}

      {/* Description Section - Optional */}
      {description && (
        <Text style={[styles.description, dynamicStyles.description]}>
          {description}
        </Text>
      )}

      {/* Call-to-Action Buttons Container */}
      <View style={styles.ctaContainer}>
        {/* Positive CTA Button - Optional */}
        {positiveCTA && (
          <TouchableOpacity
            onPress={onPositiveCTA}
            style={[styles.cta, dynamicStyles.positiveCTA]}
            accessibilityLabel={positiveCTA}
            accessibilityRole="button"
            accessibilityHint="Accept this offer and open the link">
            <Text style={[styles.ctaText, dynamicStyles.positiveCTAText]}>
              {positiveCTA}
            </Text>
          </TouchableOpacity>
        )}

        {/* Negative CTA Button - Optional */}
        {negativeCTA && (
          <TouchableOpacity
            onPress={onNegativeCTA}
            style={[styles.cta, dynamicStyles.negativeCTA]}
            accessibilityLabel={negativeCTA}
            accessibilityRole="button"
            accessibilityHint="Decline this offer and continue">
            <Text style={[styles.ctaText, dynamicStyles.negativeCTAText]}>
              {negativeCTA}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

/**
 * Component styles
 *
 * Defines the base styling for the OfferView component.
 * These styles are overridden by dynamic styles from the API when provided.
 *
 * @constant
 * @type {Object}
 * @property {Object} container - Base container style
 * @property {Object} title - Title text style
 * @property {Object} image - Image style
 * @property {Object} description - Description text style
 * @property {Object} ctaContainer - CTA buttons container style
 * @property {Object} cta - Base CTA button style
 * @property {Object} ctaText - Base CTA button text style
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.transparent,
  },
  title: {
    textAlign: 'center',
    color: Colors.text,
    fontSize: Typography.h2,
    padding: Spacing.sm,
    marginBottom: Spacing.base,
  },
  image: {
    height: 150,
    width: '100%',
  },
  description: {
    textAlign: 'center',
    padding: Spacing.sm,
    fontSize: Typography.body,
    marginBottom: Spacing.base,
  },
  ctaContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cta: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderRadius: BorderRadius.md,
  },
  ctaText: {
    color: Colors.textWhite,
  },
});

export default OfferView;
