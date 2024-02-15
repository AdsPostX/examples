import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import axios from 'axios';
import OffersContainer from './OffersContainer';

function App(props) {
  const [offers, setOffers] = useState(null);
  const [isOfferClosed, setOfferClosed] = useState(false);

  const fetchOffers = async (
    accountId,
    headers,
    queryParameters,
    bodyParameters,
  ) => {
    try {
      const allParams = {
        accountId,
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
      // ua: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36',
      adpx_fp: 'react_native_api_demo',
      sub_id: 'mobile_android_app_post_transaction',
      ...payload,
    };
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36',
    };

    try {
      const result = await fetchOffers(
        '<account_id>', // use your accountId/api key here..
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
        <OffersContainer
          offers={offers}
          closeOfferCTAAction={() => {
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
