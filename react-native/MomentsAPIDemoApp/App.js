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
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import OffersScreen from './src/screens/OffersScreen';

const DEFAULT_API_KEY = 'b167f9d7-c479-41d8-b58f-4a5b26e561f1';

/**
 * Main App Component
 *
 * Component Lifecycle:
 * 1. Shows API key input field with default value
 * 2. Shows Load Offers button (enabled only when API key is present)
 * 3. Opens modal screen when Load Offers is tapped
 *
 * @component
 * @returns {React.ReactElement} The rendered app component
 */
function App() {
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [showOffers, setShowOffers] = useState(false);

  // Check if button should be enabled
  const isLoadButtonEnabled = apiKey.trim().length > 0;

  // Handler for Load Offers button
  const handleLoadOffers = () => {
    Keyboard.dismiss();
    setShowOffers(true);
  };

  // Handler for closing offers modal
  const handleCloseOffers = () => {
    setShowOffers(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* API Key Input */}
          <Text style={styles.label}>API Key:</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter API Key"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            defaultValue={DEFAULT_API_KEY}
          />

          {/* Load Offers Button */}
          <TouchableOpacity
            style={[
              styles.loadButton,
              !isLoadButtonEnabled && styles.loadButtonDisabled,
            ]}
            onPress={handleLoadOffers}
            disabled={!isLoadButtonEnabled}>
            <Text style={styles.buttonText}>Load Offers</Text>
          </TouchableOpacity>
        </View>

        {/* Offers Modal Screen */}
        <OffersScreen
          visible={showOffers}
          onClose={handleCloseOffers}
          apiKey={apiKey}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#666666',
  },
  loadButton: {
    backgroundColor: '#3565A9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
