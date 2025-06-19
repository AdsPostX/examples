import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useOffers } from '../hooks/useOffers';
import { useWebPrefetch } from '../hooks/useWebPrefetch';
import { PrefetchMethod } from '../utils/prefetch_method';
import { generateUniqueValue, generateUserAgent } from '../utils/helpers';
import { SDK_CONFIG } from '../config/AppConfig';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * HomeScreen Component
 *
 * This component displays the main interface for the MomentScience SDK Demo App.
 * It includes:
 * - A title header
 * - An SDK ID input field
 * - Two buttons for different prefetch methods (API and WebSDK)
 * - Explanatory text for each prefetch method
 * - Loading indicator during API calls
 * - Error messages
 * - Offer count display
 * - Proceed to checkout button when offers are available
 */
const HomeScreen = ({ navigation }) => {
  const [sdkId, setSdkId] = useState(SDK_CONFIG.DEFAULT_ID);
  const [selectedPrefetchMethod, setSelectedPrefetchMethod] = useState(
    PrefetchMethod.NONE,
  );
  const [currentPayload, setCurrentPayload] = useState(null);
  const webViewRef = useRef(null);

  // API-related hooks
  const {
    loading,
    error,
    response,
    getOffers,
    setError: setApiError,
    reset: resetAPIState,
  } = useOffers({
    onStartPrefetch: () => {
      setWebSDKError(null);
    },
  });

  // WebSDK-related hooks
  const {
    isLoading: isWebSDKLoading,
    error: webSDKError,
    webViewHtml,
    offersCount: webSDKOffersCount,
    handleMessage: handleWebViewMessage,
    startPrefetch: handlePrefetchWithWebSDK,
    setError: setWebSDKError,
    reset: resetWebSDKState,
  } = useWebPrefetch({
    onStartPrefetch: () => {
      setApiError(null);
    },
  });

  const generatePayload = useCallback(() => {
    return {
      adpx_fp: generateUniqueValue(),
      pub_user_id: generateUniqueValue(),
      placement: 'checkout',
      themeId: 'demo',
      ua: generateUserAgent(),
    };
  }, []);

  const handlePrefetchWithApi = useCallback(async () => {
    resetAPIState();
    resetWebSDKState();
    setSelectedPrefetchMethod(PrefetchMethod.API);

    const newPayload = generatePayload();
    setCurrentPayload(newPayload);

    await getOffers({
      sdkId,
      isDevelopment: false,
      payload: newPayload,
    });
  }, [sdkId, getOffers, generatePayload]);

  const handleWebSDKPrefetch = useCallback(() => {
    resetAPIState();
    resetWebSDKState();
    setSelectedPrefetchMethod(PrefetchMethod.WEB_SDK);

    const newPayload = generatePayload();
    setCurrentPayload(newPayload);

    handlePrefetchWithWebSDK(sdkId, newPayload);
  }, [sdkId, handlePrefetchWithWebSDK, generatePayload]);

  // Get offers count based on selected prefetch method
  const getOffersCount = useCallback(() => {
    switch (selectedPrefetchMethod) {
      case PrefetchMethod.API:
        return response?.data?.offers?.length || 0;
      case PrefetchMethod.WEB_SDK:
        return webSDKOffersCount;
      default:
        return 0;
    }
  }, [selectedPrefetchMethod, response, webSDKOffersCount]);

  const offersCount = getOffersCount();

  const handleWebViewLoad = useCallback(() => {
    // WebSDK hook now handles the loading state
  }, []);

  const handleWebViewError = useCallback(syntheticEvent => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView error:', nativeEvent);
  }, []);

  const handleProceedToCheckout = useCallback(() => {
    const params = {
      sdkId,
      apiResponse:
        selectedPrefetchMethod === PrefetchMethod.API ? response : null,
      prefetchMethod: selectedPrefetchMethod,
      offersCount: getOffersCount(),
      payload: currentPayload,
      userAgent: generateUserAgent(),
    };
    navigation.navigate('Checkout', params);
  }, [
    navigation,
    sdkId,
    response,
    selectedPrefetchMethod,
    getOffersCount,
    currentPayload,
  ]);

  // Reset payload when SDK ID changes
  useEffect(() => {
    setCurrentPayload(null);
  }, [sdkId]);

  const renderOffersSection = () => {
    if (offersCount <= 0) {
      return null;
    }

    return (
      <View style={styles.offersSection}>
        <Text style={styles.offersCount}>
          {offersCount} Offer{offersCount > 1 ? 's' : ''} Available
        </Text>
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleProceedToCheckout}
        >
          <Text style={styles.buttonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sdkSection}>
          <Text style={styles.sdkLabel}>SDK ID</Text>
          <TextInput
            style={[
              styles.sdkInput,
              (error || webSDKError) && styles.inputError,
            ]}
            placeholder="Enter SDK ID"
            placeholderTextColor="#000"
            value={sdkId}
            onChangeText={text => {
              setSdkId(text);
              setSelectedPrefetchMethod(PrefetchMethod.NONE); // Reset selected method when SDK ID changes
            }}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          {webSDKError && <Text style={styles.errorText}>{webSDKError}</Text>}
        </View>

        <View style={styles.prefetchSection}>
          <Text style={styles.descriptionText}>
            Prefetch with API will call native API first and its response will
            be sent to websdk on 2nd screen
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              selectedPrefetchMethod === PrefetchMethod.API &&
                styles.selectedButton,
            ]}
            onPress={handlePrefetchWithApi}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Prefetch with API</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.prefetchSection}>
          <Text style={styles.descriptionText}>
            Prefetch with WebSDK will load websdk with 0 x 0 webview on this
            screen first, web sdk will save response locally and when we use web
            sdk again on 2nd screen to display, that saved response will be
            used. once offers are displayed saved response will be deleted
            locally
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              selectedPrefetchMethod === PrefetchMethod.WEB_SDK &&
                styles.selectedButton,
            ]}
            onPress={handleWebSDKPrefetch}
            disabled={isWebSDKLoading}
          >
            <Text style={styles.buttonText}>Prefetch with WebSDK</Text>
          </TouchableOpacity>
        </View>

        {(loading || isWebSDKLoading) && (
          <ActivityIndicator style={styles.loader} size="large" color="#000" />
        )}

        {renderOffersSection()}

        {/* Hidden WebView for prefetching */}
        {webViewHtml && (
          <WebView
            ref={webViewRef}
            source={{
              html: webViewHtml,
              baseUrl: 'http://localhost',
            }}
            style={styles.hiddenWebView}
            onMessage={handleWebViewMessage}
            onLoad={handleWebViewLoad}
            onError={handleWebViewError}
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
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  sdkSection: {
    marginBottom: 30,
  },
  sdkLabel: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
  },
  sdkInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    marginTop: 5,
    fontSize: 14,
  },
  prefetchSection: {
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  loader: {
    marginTop: 20,
  },
  offersSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  offersCount: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  offersMetadata: {
    marginBottom: 15,
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 14,
    color: '#666',
  },
  proceedButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  hiddenWebView: {
    width: 0,
    height: 0,
    opacity: 0,
    position: 'absolute',
  },
  selectedButton: {
    backgroundColor: '#1976D2', // Darker blue to show selected state
  },
});

export default HomeScreen;
