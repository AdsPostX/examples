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
}) {
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
      {description && <Text style={styles.description}>{description}</Text>}

      {/* Call-to-Action Buttons Container */}
      <View style={styles.ctaContainer}>
        {/* Positive CTA Button - Optional */}
        {positiveCTA && (
          <TouchableOpacity
            onPress={onPositiveCTA}
            style={[styles.cta, {backgroundColor: '#3565A9'}]}>
            <Text style={styles.ctaText}>{positiveCTA}</Text>
          </TouchableOpacity>
        )}

        {/* Negative CTA Button - Optional */}
        {negativeCTA && (
          <TouchableOpacity
            onPress={onNegativeCTA}
            style={[styles.cta, {backgroundColor: 'grey'}]}>
            <Text style={styles.ctaText}>{negativeCTA}</Text>
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
