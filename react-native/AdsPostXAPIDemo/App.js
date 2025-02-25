import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import axios from 'axios';
import OfferContainerView from './OfferContainerView';
import {firePixel, getUserAgent, openURL, generateUniqueID} from './Util';
import Config from 'react-native-config';

function App(props) {
  const [offers, setOffers] = useState(null);
  const [isOfferClosed, setOfferClosed] = useState(false);

  const fetchMomentOffers = async (
    apiKey,
    queryParameters = {},
    payload = {},
  ) => {
    try {
      // Get user agent if not provided in payload
      const userAgent = payload.ua ?? (await getUserAgent());

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': userAgent,
      };

      // Merge API key into query parameters and remove undefined values
      const allQueryParameters = {
        api_key: apiKey,
        ...queryParameters,
      };
      const filteredQueryParameters = Object.fromEntries(
        Object.entries(allQueryParameters).filter(
          ([key, value]) => value !== null && value !== undefined,
        ),
      );

      // Remove null values from the payload
      const filteredPayload = Object.fromEntries(
        Object.entries(payload).filter(
          ([key, value]) => value !== null && value !== undefined,
        ),
      );
      // Create the query string
      const queryString = new URLSearchParams(
        filteredQueryParameters,
      ).toString();

      // Construct the full API URL
      const apiUrl = `${Config.API_BASE_URL}/offers.json${
        queryString ? `?${queryString}` : ''
      }`;

      // Make the API request with Axios
      const response = await axios.post(apiUrl, filteredPayload, {headers});
      return response;
    } catch (error) {
      if (__DEV__) {
        console.log('Error in fetchMomentOffers:', error);
      }
      throw error; // Propagate the error for better handling upstream
    }
  };

  const fetchData = async () => {
    const queryParameters = {
      loyaltyboost: '0',
      creative: '0',
    };

    const payload = {
      // 'dev' mode enables the sandbox environment for testing purposes.
      // Use 'dev: 1' during testing only. Ensure it's set to '0' in production.
      dev: '1',

      // Replace 'adpx_fp' with a unique user identifier (e.g., customer ID, user ID).
      adpx_fp: (await generateUniqueID()).toString(),
    };

    try {
      const apiKey = Config.API_KEY; // Replace with your actual API Key
      const response = await fetchMomentOffers(
        apiKey,
        queryParameters,
        payload,
      );

      // Safely extract the offers array from the response
      const offers = response?.data?.data?.offers ?? [];
      setOffers(offers.length ? offers : null); // Handle empty array scenario
    } catch (error) {
      if (__DEV__) {
        console.log('Error while fetching offers:', error);
      }
      setOffers(null); // Clear offers on error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!isOfferClosed && offers?.length > 0 && (
        <OfferContainerView
          offers={offers}
          OnCloseOfferCTA={(currentIndex, shouldFirePixel) => {
            if (__DEV__) {
              console.log('[MomentScienceAPIDemo] close button tapped');
            }
            if (shouldFirePixel && offers[currentIndex]?.beacons?.close) {
              firePixel(offers[currentIndex].beacons.close);
            }
            setOfferClosed(true);
          }}
        />
      )}
      {isOfferClosed && (
        <TouchableOpacity
          onPress={() => {
            setOfferClosed(false);
            fetchData();
          }}
          style={{
            padding: 8,
            backgroundColor: 'green',
            position: 'absolute',
            bottom: 0,
          }}>
          <Text>Reload Offers</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
