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
import {firePixel, getUserAgent, openURL} from './Util';

function App(props) {
  const [offers, setOffers] = useState(null);
  const [isOfferClosed, setOfferClosed] = useState(false);

  const fetchMomentOffers = async (apiKey, queryParameters, payload) => {
    try {
      let userAgent = payload.ua ?? (await getUserAgent());

      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': userAgent,
      };

      const allQueryParameters = {
        api_key: apiKey,
        ...queryParameters,
      };

      // Remove undefined values from allParams
      Object.keys(allQueryParameters).forEach(
        key =>
          allQueryParameters[key] === undefined &&
          delete allQueryParameters[key],
      );

      // Remove undefined values from payload
      Object.keys(payload).forEach(
        key => payload[key] === undefined && delete payload[key],
      );

      const queryString = Object.keys(allQueryParameters)
        .map(
          key =>
            `${encodeURIComponent(key)}=${encodeURIComponent(
              allQueryParameters[key],
            )}`,
        )
        .join('&');

      const apiUrl = `http://api-staging.adspostx.com/native/v2/offers.json${
        queryString ? `?${queryString}` : ''
      }`;

      const response = await axios.post(apiUrl, payload, {headers});
      return response;
    } catch (error) {
      throw error;
    }
  };

  const fetchData = async () => {
    const queryParameters = {loyaltyboost: '0', creative: '0'};
    const payload = {country: 'usa'};
    // add any payload parameters into the payload object above

    try {
      const result = await fetchMomentOffers(
        '<api_key>', //replace with your generated API Key
        queryParameters,
        payload,
      );
      let offerArray = result.data?.data?.offers;
      setOffers(offerArray);
    } catch (error) {
      console.log('Error in while fetchOffers:', error);
      setOffers(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!isOfferClosed && offers && offers.length > 0 && (
        <OfferContainerView
          offers={offers}
          OnCloseOfferCTA={(currentIndex, shouldFirePixel) => {
            console.log('[AdsPostXAPIDemo] close button tapped');
            if (shouldFirePixel) {
              firePixel(offers[currentIndex]?.beacons?.close);
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
