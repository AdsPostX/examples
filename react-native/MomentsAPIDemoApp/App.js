/**
 * App.js
 *
 * Main application component for the AdsPostX API Demo.
 * Manages the overall application state and renders different views based on:
 * - Loading state
 * - Error state
 * - Offer display state
 * - Offer closed state
 *
 * Key Features:
 * - Input for API key with a default value
 * - Toggle for development mode
 * - Button to load offers, which opens a modal screen
 * - Handles keyboard dismissal for better UX
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
  Switch,
} from 'react-native';
import OffersScreen from './src/screens/OffersScreen';

const DEFAULT_API_KEY = '';

/**
 * Main App Component
 *
 * Manages the application state and renders the UI for:
 * - API key input
 * - Development mode toggle
 * - Load Offers button
 * - Offers modal screen
 *
 * @component
 * @returns {React.ReactElement} The rendered app component
 *
 * State:
 * @state {string} apiKey - Stores the API key entered by the user
 * @state {boolean} showOffers - Controls the visibility of the Offers modal
 * @state {boolean} isDevelopment - Toggles development mode
 *
 * Methods:
 * @method handleLoadOffers - Dismisses the keyboard and shows the Offers modal
 * @method handleCloseOffers - Closes the Offers modal
 */
function App() {
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [showOffers, setShowOffers] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  // Check if the Load Offers button should be enabled
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

          {/* Development Mode Switch */}
          <View style={[styles.switchContainer, {marginVertical: 16}]}>
            <Text style={[styles.switchLabel, {color: '#000'}]}>
              Development Mode
            </Text>
            <Switch
              value={isDevelopment}
              onValueChange={setIsDevelopment}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isDevelopment ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

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
          isDevelopment={isDevelopment}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

/**
 * Application Styles
 *
 * Defines the styling for the App component.
 *
 * Layout:
 * - Uses flex for responsive layout
 * - Centered containers for loading and error states
 * - Consistent styling for buttons and text
 *
 * Styles:
 * @style container - Main container style with white background
 * @style content - Padding for the content area
 * @style label - Styling for input labels
 * @style input - Styling for the API key input field
 * @style loadButton - Styling for the Load Offers button
 * @style loadButtonDisabled - Styling for the disabled Load Offers button
 * @style buttonText - Styling for button text
 * @style switchContainer - Styling for the development mode switch container
 * @style switchLabel - Styling for the development mode label
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});

export default App;
