import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';

/**
 * OfferView Component
 *
 * Renders an individual offer with title, image, description, and call-to-action buttons.
 * All elements are optional and will only render if the corresponding prop is provided.
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
 * @param {Object} props.apiStyles - Styles from API response
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
  // Helper function to parse pixel values
  const parsePixelValue = value => {
    if (!value) return undefined;
    // Remove 'px' and convert to number
    return parseInt(value.replace('px', ''), 10);
  };

  // Create dynamic styles based on API response
  const dynamicStyles = {
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
      {title && <Text style={styles.title}>{title}</Text>}

      {/* Image Section - Optional, clickable */}
      {imageURL && (
        <TouchableOpacity onPress={onImageCTA}>
          <Image
            source={{uri: `${imageURL}`}}
            resizeMode="contain"
            style={styles.image}
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
            style={[styles.cta, dynamicStyles.positiveCTA]}>
            <Text style={[styles.ctaText, dynamicStyles.positiveCTAText]}>
              {positiveCTA}
            </Text>
          </TouchableOpacity>
        )}

        {/* Negative CTA Button - Optional */}
        {negativeCTA && (
          <TouchableOpacity
            onPress={onNegativeCTA}
            style={[styles.cta, dynamicStyles.negativeCTA]}>
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
 * @constant
 * @type {Object}
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#3565A9',
    fontSize: 20,
    padding: 8,
    marginBottom: 16,
  },
  image: {
    height: 150,
    width: '100%',
  },
  description: {
    textAlign: 'center',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  ctaContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cta: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  ctaText: {
    color: 'white',
  },
});

export default OfferView;
