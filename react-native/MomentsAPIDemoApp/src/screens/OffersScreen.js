import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';
import OfferContainerView from '../components/OfferContainerView';
import {useOffers} from '../hooks/useOffers';
import {generateUniqueID, getUserAgent} from '../utils/Util';
import Logger from '../utils/logger';

/**
 * OffersScreen Component
 *
 * Main screen component for displaying offers in a modal view.
 * Manages the offer lifecycle including:
 * - Loading state
 * - Error handling
 * - Offer display
 * - User interactions
 *
 * Key Features:
 * - Uses modal presentation for full-screen display
 * - Integrates with useOffers hook for data management
 * - Handles all offer lifecycle events
 * - Provides loading and error states
 * - Supports development mode toggle
 *
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.visible - Controls modal visibility
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {string} props.apiKey - API key for offer fetching
 * @param {boolean} props.isDevelopment - Development mode flag
 */
function OffersScreen({visible, onClose, apiKey, isDevelopment}) {
  const {
    offers,
    apiStyles,
    isOfferClosed,
    isLoading,
    error,
    fetchOffers,
    handleCloseOffer,
    reloadOffers,
    resetStates,
  } = useOffers();

  /**
   * Handles offer container close event
   *
   * Performs the following actions:
   * 1. Triggers offer close handler
   * 2. Resets all states
   * 3. Calls parent onClose callback
   *
   * @param {number} currentIndex - Index of current offer
   * @param {boolean} shouldFirePixel - Whether to fire tracking pixel
   */
  const handleOfferClose = (currentIndex, shouldFirePixel) => {
    handleCloseOffer(currentIndex, shouldFirePixel);
    resetStates();
    onClose();
  };

  /**
   * Effect hook for fetching offers when screen becomes visible
   *
   * Automatically fetches offers when:
   * 1. Screen becomes visible
   * 2. API key is available
   *
   * Also handles:
   * - State reset before fetch
   * - Error logging
   */
  React.useEffect(() => {
    const fetchData = async () => {
      if (visible && apiKey) {
        try {
          resetStates();
          await fetchOffers(apiKey, '0', '0', isDevelopment, {
            adpx_fp: generateUniqueID(),
            ua: await getUserAgent(),
          });
        } catch (error) {
          Logger.log('Error fetching offers:', error);
        }
      }
    };

    fetchData();
  }, [visible, apiKey, fetchOffers, resetStates, isDevelopment]);

  /**
   * Handles modal close via back button
   *
   * Triggers offer close with:
   * - Current index 0
   * - Pixel firing enabled
   */
  const handleModalClose = () => {
    handleOfferClose(0, true);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleModalClose}
      presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Loading State */}
        {isLoading && !offers && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading offers...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !offers && (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.tryAgainButton]}
                onPress={async () => {
                  try {
                    await fetchOffers(apiKey, '0', '0', isDevelopment, {
                      adpx_fp: generateUniqueID(),
                      ua: await getUserAgent(),
                    });
                  } catch (err) {
                    Logger.log('Error:', err);
                  }
                }}>
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={handleModalClose}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Offers Display */}
        {!isOfferClosed && offers?.length > 0 && (
          <OfferContainerView
            offers={offers}
            OnCloseOfferCTA={handleOfferClose}
            apiStyles={apiStyles}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

/**
 * Component styles
 *
 * Defines all visual styles for the OffersScreen component
 *
 * @constant
 * @type {Object}
 * @property {Object} container - Main container style
 * @property {Object} header - Header area style
 * @property {Object} closeButton - Close button style
 * @property {Object} centerContainer - Centered content container
 * @property {Object} loadingText - Loading text style
 * @property {Object} errorText - Error text style
 * @property {Object} buttonContainer - Button container style
 * @property {Object} button - Base button style
 * @property {Object} tryAgainButton - Try Again button style
 * @property {Object} closeButton - Close button style
 * @property {Object} buttonText - Button text style
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16, // Space between buttons
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  tryAgainButton: {
    backgroundColor: 'green',
  },
  closeButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OffersScreen;
