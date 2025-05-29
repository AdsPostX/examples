import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import OfferView from './OfferView';
import {useOfferContainer} from '../hooks/useOfferContainer';

/**
 * OfferContainerView Component
 *
 * A container component that manages the display and navigation of multiple offers.
 * It provides a carousel-like interface with navigation controls and close functionality.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Array<Object>} props.offers - Array of offer objects to display
 * @param {Function} props.OnCloseOfferCTA - Callback function when offer is closed
 *                                          Parameters: (currentIndex: number, shouldFirePixel: boolean)
 */
function OfferContainerView({offers, OnCloseOfferCTA}) {
  // Custom hook to handle offer container business logic
  const {
    currentOffer, // Current offer being displayed
    goToNextOffer, // Function to navigate to next offer
    goToPreviousOffer, // Function to navigate to previous offer
    handlePositiveCTA, // Handler for positive CTA button
    handleNegativeCTA, // Handler for negative CTA button
    handleImageCTA, // Handler for image click
    handleClose, // Handler for close button
  } = useOfferContainer(offers, OnCloseOfferCTA);

  return (
    <View style={styles.container}>
      {/* Close button at the top */}
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Text>Close</Text>
      </TouchableOpacity>

      {/* Render current offer if available */}
      {currentOffer && (
        <OfferView
          title={currentOffer.title}
          description={currentOffer.description}
          imageURL={currentOffer.image}
          clickURL={currentOffer.click_url}
          onImageCTA={handleImageCTA}
          positiveCTA={currentOffer.cta_yes}
          onPositiveCTA={handlePositiveCTA}
          negativeCTA={currentOffer.cta_no}
          onNegativeCTA={handleNegativeCTA}
        />
      )}

      {/* Bottom navigation toolbar */}
      <View style={styles.bottomToolBar}>
        {/* Previous offer button */}
        <TouchableOpacity
          onPress={goToPreviousOffer}
          style={styles.navigationButton}>
          <Text>{'<'}</Text>
        </TouchableOpacity>
        {/* Next offer button */}
        <TouchableOpacity
          onPress={() => goToNextOffer(false)}
          style={styles.navigationButton}>
          <Text>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * Component styles
 */
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    borderColor: 'black',
    borderRadius: 8,
    borderWidth: 1,
    margin: 8,
  },
  closeButton: {
    flexDirection: 'row-reverse', // Aligns close button to the right
    padding: 8,
  },
  bottomToolBar: {
    height: 44,
    width: '100%',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  navigationButton: {
    backgroundColor: 'grey',
    padding: 8,
    paddingStart: 16,
    paddingEnd: 16,
  },
});

export default OfferContainerView;
