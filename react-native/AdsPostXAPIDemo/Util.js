import axios from 'axios';
import {Linking} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const firePixel = url => {
  if (url) {
    console.log('[AdsPostXAPIDemo] Inside fire pixel');
    axios
      .get(url)
      .then(response => {
        console.log('[AdsPostXAPIDemo] fire pixel Success:', response.data);
      })
      .catch(error => {
        console.log('fire pixel Error:', error);
      });
  }
};

export const openURL = async url => {
  if (url) {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`[AdsPostXAPIDemo] Cannot open URL: ${url}`);
    }
  }
};

export const getUserAgent = async () => {
  return await DeviceInfo.getUserAgent();
};
