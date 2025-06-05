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

  // Handler for when offer container is closed
  const handleOfferClose = (currentIndex, shouldFirePixel) => {
    handleCloseOffer(currentIndex, shouldFirePixel);
    resetStates();
    onClose();
  };

  // Reset states and fetch offers when visibility changes
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

  // Handle modal close via back button
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
