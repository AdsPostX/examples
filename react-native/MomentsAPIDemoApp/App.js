/**
 * App.js
 *
 * Main application component for the AdsPostX API Demo.
 * Manages the overall application state and renders different views based on:
 * - Loading state
 * - Error state
 * - Offer display state
 * - Offer closed state
 */
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import OfferContainerView from './src/components/OfferContainerView';
import {useOffers} from './src/hooks/useOffers';

/**
 * Main App Component
 *
 * Component Lifecycle:
 * 1. Initializes with useOffers
 * 2. Fetches offers on mount
 * 3. Renders appropriate UI based on state
 *
 * States:
 * - Loading: Shows loading indicator
 * - Error: Shows error message with retry option
 * - Offers Available: Shows offer container
 * - Offers Closed: Shows reload button
 *
 * @component
 * @returns {React.ReactElement} The rendered app component
 */
function App() {
  // Initialize offers view model with all required states and handlers
  const {
    offers, // Array of offer objects
    isOfferClosed, // Boolean flag for offer closed state
    isLoading, // Boolean flag for loading state
    error, // Error message string if any
    fetchOffers, // Function to fetch offers
    handleCloseOffer, // Function to handle offer closure
    reloadOffers, // Function to reload offers
  } = useOffers();

  /**
   * Effect to fetch offers when component mounts
   * Dependency on fetchOffers ensures consistent function reference
   */
  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  /**
   * Loading State View
   * Rendered when:
   * - Initial load
   * - Reloading offers
   * - No offers available yet
   */
  if (isLoading && !offers) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading offers...</Text>
      </SafeAreaView>
    );
  }

  /**
   * Error State View
   * Rendered when:
   * - API call fails
   * - No offers available
   * - Network errors
   */
  if (error && !offers) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.reloadButton} onPress={fetchOffers}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Main Application View
   * Conditionally renders:
   * - Offer container when offers are available and not closed
   * - Reload button when offers are closed
   */
  return (
    <SafeAreaView style={styles.container}>
      {/* Render offer container when offers are available and not closed */}
      {!isOfferClosed && offers?.length > 0 && (
        <OfferContainerView
          offers={offers}
          OnCloseOfferCTA={handleCloseOffer}
        />
      )}
      {/* Render reload button when offers are closed */}
      {isOfferClosed && (
        <TouchableOpacity onPress={reloadOffers} style={styles.reloadButton}>
          <Text style={styles.buttonText}>Reload Offers</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

/**
 * Application Styles
 *
 * Layout:
 * - Uses flex for responsive layout
 * - Centered containers for loading and error states
 * - Consistent styling for buttons and text
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  reloadButton: {
    padding: 12,
    backgroundColor: 'green',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
