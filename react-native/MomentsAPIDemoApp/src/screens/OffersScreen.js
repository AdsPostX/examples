import React, {useState, useEffect} from 'react';
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
import {Colors, Spacing, Typography, BorderRadius} from '../constants/theme';

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
    resetStates,
  } = useOffers();

  const [adpx_fp, setAdpxFp] = useState('');

  /**
   * Initiates offer fetching with all required parameters
   * Extracted to avoid duplication between initial load and retry
   */
  const loadOffers = async () => {
    await fetchOffers({
      apiKey,
      loyaltyBoost: '0',
      creative: '0',
      isDevelopment,
      payload: {
        adpx_fp: adpx_fp,
        pub_user_id: '1234567890', // should be a unique identifier for the user
        placement: 'checkout',
        ua: await getUserAgent(),
      },
    });
  };

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
   * - Cleanup to prevent state updates on unmounted component
   */
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (visible && apiKey) {
        try {
          resetStates();
          await loadOffers();
        } catch (error) {
          // Only log errors if component is still mounted
          if (isMounted) {
            Logger.log('Error fetching offers:', error);
          }
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, apiKey, isDevelopment, adpx_fp]);

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

  useEffect(() => {
    const fetchUniqueID = async () => {
      try {
        const uniqueID = await generateUniqueID();
        setAdpxFp(uniqueID);
      } catch (error) {
        Logger.error('Error fetching unique ID:', error);
        setAdpxFp('unknown');
      }
    };
    fetchUniqueID();
  }, []);

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
            <ActivityIndicator size="large" color={Colors.info} />
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
                    await loadOffers();
                  } catch (err) {
                    Logger.log('Error:', err);
                  }
                }}
                accessibilityLabel="Try again"
                accessibilityRole="button"
                accessibilityHint="Retry loading offers">
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={handleModalClose}
                accessibilityLabel="Close"
                accessibilityRole="button"
                accessibilityHint="Close offers screen">
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
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.base,
  },
  loadingText: {
    marginTop: 10,
    fontSize: Typography.body,
    color: Colors.text,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.body,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.base, // Space between buttons
  },
  button: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    minWidth: 100,
    alignItems: 'center',
  },
  tryAgainButton: {
    backgroundColor: Colors.success,
  },
  closeButton: {
    backgroundColor: Colors.textLight,
  },
  buttonText: {
    color: Colors.textWhite,
    fontSize: Typography.body,
    fontWeight: 'bold',
  },
});

export default OffersScreen;
