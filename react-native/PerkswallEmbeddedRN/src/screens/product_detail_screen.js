import React, {useState, useEffect} from 'react';
import {View, Button, ActivityIndicator, StyleSheet, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PerksWallType} from '../data/product';
import {
  REGULAR_ACCOUNTID_KEY,
  MODAL_ACCOUNTID_KEY,
  INTERSTITIAL_ACCOUNTID_KEY,
  STANDALONE_ACCOUNTID_KEY,
  MODAL_THEMEID_KEY,
  INTERSTITIAL_THEMEID_KEY,
  STANDALONE_THEMEID_KEY,
  MODAL_CID_KEY,
  INTERSTITIAL_CID_KEY,
  STANDALONE_CID_KEY,
} from '../util/constants';
import Config from 'react-native-config';

const ProductDetailScreen = ({route, navigation}) => {
  const {perksWallType, deepLinkUrl} = route.params || {};
  const [embeddedWebURL, setEmbeddedWebURL] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const tabs = ['Orders', 'Offers', 'Profile', 'Contact'];
  const [selectedTabIndex, setSelectedTabIndex] = useState(1);

  useEffect(() => {
    const configureURL = async () => {
      let url = '';
      let accountId = Config.DEFAULT_ACCOUNTID;
      let themeId = '';
      let cid = Config.DEFAULT_CID;

      try {
        switch (perksWallType) {
          case PerksWallType.REGULAR:
            accountId =
              (await AsyncStorage.getItem(REGULAR_ACCOUNTID_KEY)) ||
              Config.DEFAULT_ACCOUNTID;
            themeId = '';
            break;
          case PerksWallType.MODAL:
            accountId =
              (await AsyncStorage.getItem(MODAL_ACCOUNTID_KEY)) ||
              Config.DEFAULT_ACCOUNTID;
            themeId =
              (await AsyncStorage.getItem(MODAL_THEMEID_KEY)) ||
              Config.DEFAULT_MODAL_THEMEID;
            cid =
              (await AsyncStorage.getItem(MODAL_CID_KEY)) || Config.DEFAULT_CID;
            break;
          case PerksWallType.INTERSTITIAL:
            accountId =
              (await AsyncStorage.getItem(INTERSTITIAL_ACCOUNTID_KEY)) ||
              Config.DEFAULT_ACCOUNTID;
            themeId =
              (await AsyncStorage.getItem(INTERSTITIAL_THEMEID_KEY)) ||
              Config.DEFAULT_INTERSTITIAL_THEMEID;
            cid =
              (await AsyncStorage.getItem(INTERSTITIAL_CID_KEY)) ||
              Config.DEFAULT_CID;
            break;
          case PerksWallType.STANDALONE:
            accountId =
              (await AsyncStorage.getItem(STANDALONE_ACCOUNTID_KEY)) ||
              Config.DEFAULT_ACCOUNTID;
            themeId =
              (await AsyncStorage.getItem(STANDALONE_THEMEID_KEY)) ||
              Config.DEFAULT_STANDALONE_THEMEID;
            cid =
              (await AsyncStorage.getItem(STANDALONE_CID_KEY)) ||
              Config.DEFAULT_CID;
            break;
          default:
            accountId = Config.DEFAULT_ACCOUNTID;
            cid = Config.DEFAULT_CID;
            break;
        }
      } catch (error) {
        console.log(error);
      }

      const country = Config.DEFAULT_COUNTRY;

      if (perksWallType === PerksWallType.REGULAR) {
        url = `https://dummy.com?accountId=${accountId}&country=${country}`;
      } else if (perksWallType === PerksWallType.STANDALONE) {
        url = `https://dummy.com?accountId=${accountId}&themeId=${themeId}&c_id=${cid}&country=${country}&standalone=true`;
      } else {
        url = `https://dummy.com?accountId=${accountId}&themeId=${themeId}&c_id=${cid}&country=${country}`;
      }

      if (deepLinkUrl) {
        url = deepLinkUrl;
      }
      console.log('embed url: ' + url);
      setEmbeddedWebURL(url);
    };

    configureURL();
  }, [perksWallType, deepLinkUrl]);

  const generateHTML = () => {
    if (embeddedWebURL.trim().length === 0) {
      return '';
    }

    const config = `
        accountId: '${embeddedWebURL.split('accountId=')[1].split('&')[0]}',
        themeId: '${embeddedWebURL.split('themeId=')[1]?.split('&')[0] || ''}',
        containerId: 'adpx_container'
      `;
    const userConfig = `
        c_id: '${embeddedWebURL.split('c_id=')[1]?.split('&')[0] || ''}',
        country: '${embeddedWebURL.split('country=')[1]?.split('&')[0] || ''}'
      `;

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Perkswall</title></head>
        <body>
            <div id="adpx_container"></div>
            <script>
                window.AdpxConfig = { ${config} };
                window.AdpxUser = { ${userConfig} };
                var adpx = document.createElement('script');
                adpx.type = 'text/javascript';
                adpx.async = true;
                adpx.src = '${Config.ADPX_URL}/launcher.perkswall.js';
                document.getElementsByTagName('head')[0].appendChild(adpx);
            </script>
        </body>
        </html>
      `;
  };

  const handleNavigation = event => {
    console.log('Navigation type:', event.navigationType);
    console.log('URL:', event.url);

    if (event.url.includes('offer-click')) {
      return false;
    }
    return true;
  };

  // console.log(generateHTML());

  const injectedJavaScript = `
    window.addEventListener('message', function(event) {
      // Forward any messages from the iframe to React Native
      window.ReactNativeWebView.postMessage(event.data);
    });
    true; // Note: this is needed to ensure the script is injected properly
  `;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <Button
            key={index}
            title={tab}
            onPress={() => setSelectedTabIndex(index)}
            color={selectedTabIndex === index ? 'blue' : 'gray'}
          />
        ))}
      </View>
      <View style={{flex: 1}}>
        {embeddedWebURL.trim().length > 0 ? (
          <WebView
            originWhitelist={['*']}
            source={{html: generateHTML()}}
            onLoadStart={() => setIsLoading(true)}
            onShouldStartLoadWithRequest={handleNavigation}
            onLoadEnd={() => setIsLoading(false)}
            javaScriptEnabled={true}
            injectedJavaScript={injectedJavaScript}
            domStorageEnabled={true}
            style={styles.webView}
            onMessage={event => {
              const message = event.nativeEvent.data;
              try {
                let parsedData = JSON.parse(message);

                if (
                  parsedData &&
                  typeof parsedData === 'object' &&
                  parsedData.name === 'url_clicked' &&
                  parsedData.target_url &&
                  parsedData.target_url.trim().length > 0
                ) {
                  console.log(
                    'URL clicked, navigating to:',
                    parsedData.target_url,
                  );
                  navigation.navigate('InAppWebView', {
                    url: parsedData.target_url,
                  });
                }
              } catch (e) {
                console.log('Error processing message:', e);
                console.log('Original message:', message);
              }
            }}
          />
        ) : null}

        {isLoading && (
          <ActivityIndicator
            style={styles.loadingContainer}
            size="large"
            color="#0000ff"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#e0e0e0',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductDetailScreen;
