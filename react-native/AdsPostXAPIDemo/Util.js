import axios from 'axios';
import {Linking, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const generateUniqueID = () => {
  return Platform.select({
    ios: DeviceInfo.getUniqueId(), // IDFV for iOS
    android: DeviceInfo.getAndroidId(), // AndroidID for Android
    default: 'unknown',
  });
};

export const firePixel = url => {
  if (url) {
    if (__DEV__) {
      console.log('[MomentScienceAPIDemo] Inside fire pixel');
    }
    axios
      .get(url)
      .then(response => {
        if (__DEV__) {
          console.log(
            '[MomentScienceAPIDemo] fire pixel Success:',
            response.data,
          );
        }
      })
      .catch(error => {
        if (__DEV__) {
          console.log('fire pixel Error:', error);
        }
      });
  }
};

export const openURL = async url => {
  if (url) {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      if (__DEV__) {
        console.log(`[MomentScienceAPIDemo] Cannot open URL: ${url}`);
      }
    }
  }
};

export const getUserAgent = async () => {
  return await DeviceInfo.getUserAgent();
};
