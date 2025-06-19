import React, { useRef, useMemo } from 'react';
import { StyleSheet, SafeAreaView, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { useCheckout } from '../hooks/useCheckout';
import { getCheckoutHtml } from '../utils/webSDKUtils';

/**
 * CheckoutScreen Component
 *
 * This screen is responsible for displaying the checkout interface
 * where users can view and interact with their selected offers.
 *
 * @component
 * @param {Object} route - Route object containing navigation params
 * @param {Object} route.params - Navigation parameters
 * @param {string} route.params.sdkId - The SDK ID used for fetching offers
 * @param {Object|null} route.params.apiResponse - API response data (only present if API prefetch was used)
 * @param {string} route.params.prefetchMethod - The prefetch method used (API or WebSDK)
 * @param {number} route.params.offersCount - Total number of offers available
 * @param {Object} route.params.payload - The payload used for API calls
 * @param {string} route.params.userAgent - The user agent string
 */
const CheckoutScreen = ({ route }) => {
  const {
    sdkId,
    apiResponse,
    prefetchMethod,
    offersCount,
    payload,
    userAgent,
  } = route.params;

  const webViewRef = useRef(null);

  // Use the checkout hook
  const {
    getAutoLoadConfiguration,
    getResponseHandlingScript,
    getAdpxUserScript,
    handleWebViewMessage,
    handleWebViewLoad,
    handleWebViewError,
  } = useCheckout({
    sdkId,
    apiResponse,
    prefetchMethod,
    payload,
  });

  // Generate the HTML content with all replacements
  const htmlContent = useMemo(() => {
    return getCheckoutHtml({
      sdkId,
      offersCount,
      autoLoadConfig: getAutoLoadConfiguration(),
      responseHandling: getResponseHandlingScript(),
      adpxUserScript: getAdpxUserScript(),
    });
  }, [
    sdkId,
    offersCount,
    getAutoLoadConfiguration,
    getResponseHandlingScript,
    getAdpxUserScript,
  ]);

  // Handle navigation state changes
  const handleNavigationStateChange = navState => {
    // If the URL is not about:blank or your base URL, open in external browser
    if (
      navState.url &&
      navState.url !== 'about:blank' &&
      !navState.url.startsWith('http://localhost')
    ) {
      Linking.openURL(navState.url).catch(err => {
        console.error('Failed to open URL:', err);
      });
      return false; // Prevent WebView from loading the URL
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{
          html: htmlContent,
          baseUrl: 'http://localhost',
        }}
        style={styles.webview}
        onMessage={handleWebViewMessage}
        onLoad={handleWebViewLoad}
        onError={handleWebViewError}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        debuggingEnabled={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        allowsInspection={true}
        webviewDebuggingEnabled={true}
        setBuiltInZoomControls={true}
        setDisplayZoomControls={false}
        originWhitelist={['*']}
        mixedContentMode="always"
        userAgent={userAgent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
});

export default CheckoutScreen;
