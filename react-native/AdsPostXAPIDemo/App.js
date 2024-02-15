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

  const fetchMomentOffers = async (
    apiKey,
    headers,
    queryParameters,
    bodyParameters,
  ) => {
    try {
      const allParams = {
        accountId: apiKey,
        ...queryParameters,
      };

      // Remove undefined values from allParams
      Object.keys(allParams).forEach(
        key => allParams[key] === undefined && delete allParams[key],
      );

      // Remove undefined values from bodyParameters
      Object.keys(bodyParameters).forEach(
        key => bodyParameters[key] === undefined && delete bodyParameters[key],
      );

      const postData = {
        ...bodyParameters,
      };

      const queryString = Object.keys(allParams)
        .map(
          key =>
            `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`,
        )
        .join('&');

      const apiUrl = `https://api.adspostx.com/native/v2/offers.json${
        queryString ? `?${queryString}` : ''
      }`;

      const response = await axios.post(apiUrl, postData, {headers});
      return response;
    } catch (error) {
      throw error;
    }
  };

  const fetchData = async () => {
    const queryParameters = {loyaltyboost: '0', creative: '0'};
    const payload = {country: 'usa'};

    const bodyParameters = {
      adpx_fp: 'react_native_api_demo',
      ...payload,
    };

    let userAgent = await getUserAgent();

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': userAgent,
    };

    try {
      const result = await fetchMomentOffers(
        '<account_id/api_key>', // use your accountId/api key here..
        headers,
        queryParameters,
        bodyParameters,
      );
      let offerArray = result.data?.data?.offers;
      setOffers(offerArray);
    } catch (error) {
      console.error('Error in while fetchOffers:', error);
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
          closeOfferCTAAction={(shouldFirePixel, currentIndex) => {
            console.log('[AdsPostXAPIDemo] close button tapped');
            let currentOffer = offers[currentIndex];
            if (shouldFirePixel && currentOffer) {
              firePixel(currentOffer?.pixel);
            }
            setOfferClosed(true);
          }}
          goToPreviousOfferCTAAction={index => {
            let updatedCurrentOffer = offers[index];
            console.log(
              '[AdsPostXAPIDemo] fire pixel when previous offer is displayed',
            );
            firePixel(updatedCurrentOffer?.pixel);
          }}
          goToNextOfferCTAAction={index => {
            let updatedCurrentOffer = offers[index];
            console.log(
              '[AdsPostXAPIDemo] fire pixel when next offer is displayed',
            );
            firePixel(updatedCurrentOffer?.pixel);
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
