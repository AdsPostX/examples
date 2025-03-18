// src/screens/InAppWebViewScreen.js
import React, {useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import ArrowForward from '../../assets/images/forward.svg'; // Import local SVGs
import ArrowBack from '../../assets/images/back.svg';
import RefreshIcon from '../../assets/images/refresh.svg';
import StopIcon from '../../assets/images/stop.svg';

const InAppWebViewScreen = ({route, navigation}) => {
  const {url} = route.params;
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleRequest = event => {
    const isStoreUrl =
      event.url.includes('play.google.com') ||
      event.url.includes('apps.apple.com');

    if (isStoreUrl) {
      Linking.openURL(url);
      navigation.goBack();
      return false;
    }
    return true;
  };

  const handleNavigationStateChange = navState => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          onPress={() => webViewRef.current.goBack()}
          disabled={!canGoBack}>
          <ArrowBack
            width={24}
            height={24}
            fill={canGoBack ? 'blue' : 'grey'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => webViewRef.current.goForward()}
          disabled={!canGoForward}>
          <ArrowForward
            width={24}
            height={24}
            fill={canGoForward ? 'blue' : 'grey'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => webViewRef.current.reload()}>
          <RefreshIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => webViewRef.current.stopLoading()}>
          <StopIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.webViewWrapper}>
        <WebView
          ref={webViewRef}
          source={{uri: url}}
          style={styles.webView}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleRequest}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webViewWrapper: {
    flex: 1,
  },
  webView: {
    flex: 1,
    zIndex: 1,
  },
  webViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
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

export default InAppWebViewScreen;
