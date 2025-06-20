import 'dart:convert';
import 'package:ms_fl_demo_app/config/app_config.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'network_service.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import '../utils/device_utils.dart';

/// Function type for WebSDK event callbacks
typedef WebSDKEventCallback = void Function(int offerCount);

/// Service responsible for handling prefetch operations through both API and WebSDK
class PrefetchService {
  /// Singleton instance of PrefetchService
  static final PrefetchService _instance = PrefetchService._internal();

  /// Factory constructor to return the singleton instance
  factory PrefetchService() => _instance;

  /// Network service for making API calls
  final NetworkService _networkService = NetworkService();

  /// Device info plugin
  final DeviceInfoPlugin _deviceInfoPlugin = DeviceInfoPlugin();

  /// Cached API response
  Map<String, dynamic>? _cachedApiResponse;

  /// WebSDK event callback reference
  WebSDKEventCallback? _webSDKCallback;

  /// The last used payload
  Map<String, String>? _lastUsedPayload;

  /// Private constructor for singleton pattern
  PrefetchService._internal();

  /// Prefetches content using the API method
  ///
  /// [sdkId] The SDK identifier used for the API call
  /// Returns a Future that completes when the prefetch operation is done
  Future<void> prefetchWithAPI(String sdkId) async {
    try {
      // Get device user agent
      final userAgent = await DeviceUtils.getUserAgent();

      // Create payload here in the business logic layer
      final payload = await createPayload();
      _lastUsedPayload = payload;

      debugPrint('Prefetching content with API for SDK ID: $sdkId');
      debugPrint('User Agent: $userAgent');

      // Make the API call to fetch offers
      final response = await _networkService.fetchOffers(
          sdkId: sdkId,
          isDevelopment: true, // Use test mode for demo
          creative: '0',
          loyaltyboost: '0',
          payload: payload // Include user agent in payload
          );

      // Cache the API response for later use
      _cachedApiResponse = response;

      debugPrint('API prefetch successful');
      debugPrint(
          'Response: ${response.toString().substring(0, response.toString().length > 100 ? 100 : response.toString().length)}...');
    } catch (e) {
      debugPrint('Error during API prefetch: $e');
      rethrow;
    }
  }

  /// Prefetches content using the WebSDK method
  ///
  /// [sdkId] The SDK identifier used for the WebSDK
  /// [webViewController] The controller for the WebView to load content
  /// Returns a Future that completes when the prefetch operation is done
  Future<void> prefetchWithWebSDK(String sdkId, InAppWebViewController? webViewController) async {
    try {
      if (webViewController == null) {
        throw Exception("WebView controller is not initialized");
      }

      // Create payload for WebSDK (same as API for consistency)
      final payload = await createPayload();
      _lastUsedPayload = payload;

      // Get SDK CDN URL from AppConfig
      final String sdkCdnUrl = AppConfig.web.launcherScriptURL;

      // Load HTML template from assets
      final String htmlTemplate = await rootBundle.loadString('assets/html/prefetch.html');

      // Create AdpxUser script with payload
      String adpxUserConfigScript = '';
      if (payload.isNotEmpty) {
        adpxUserConfigScript = '''
        // Set AdpxUser with payload
        window.AdpxUser = {
        ''';

        payload.forEach((key, value) {
          adpxUserConfigScript += '  $key: "$value",\n';
        });

        // Remove the last comma and close the object
        adpxUserConfigScript = adpxUserConfigScript.substring(0, adpxUserConfigScript.length - 2);
        adpxUserConfigScript += '\n};\n';
      }

      // Replace placeholders with actual values
      String html = htmlTemplate.replaceAll('%%SDK_ID%%', sdkId).replaceAll('%%SDK_CDN_URL%%', sdkCdnUrl);

      // Insert the AdpxUser script if it exists
      if (adpxUserConfigScript.isNotEmpty) {
        // Add it after the AdpxConfig initialization
        html = html.replaceFirst('window.AdpxUser = {};', adpxUserConfigScript);
      }

      await webViewController.loadData(
        data: html,
        mimeType: 'text/html',
        encoding: 'utf-8',
        baseUrl: WebUri(
            'https://myapp.local'), // Use a valid URL, The browser doesn't actually try to connect to this domain - it just uses it as a reference point. please note that skipping this parameter will throw security error, and also setting it as about:blank will also throw security error.
      );

      debugPrint('WebSDK prefetch initialized with SDK ID: $sdkId');
    } catch (e) {
      debugPrint('Error during WebSDK prefetch: $e');
      rethrow;
    }
  }

  /// Get the cached API response
  Map<String, dynamic>? getCachedApiResponse() {
    return _cachedApiResponse;
  }

  /// Get the number of offers from the cached API response
  /// Returns the number of offers or 0 if no offers are available
  int getOfferCount() {
    if (_cachedApiResponse == null) return 0;

    // Get the data section of the response
    final data = _cachedApiResponse?['data'] as Map<String, dynamic>?;
    if (data == null) return 0;

    // Get the offers array from the data
    final offers = data['offers'] as List<dynamic>?;
    if (offers == null) return 0;

    return offers.length;
  }

  /// Clear the cached API response
  void clearCachedApiResponse() {
    _cachedApiResponse = null;
  }

  /// Parse WebSDK payload to extract offer count
  int getOfferCountFromWebSDKPayload(String payload) {
    try {
      // Parse payload JSON
      Map<String, dynamic> payloadObj = jsonDecode(payload);

      // Navigate through nested structure
      if (payloadObj.containsKey('response') && payloadObj['response'] is Map<String, dynamic>) {
        var response = payloadObj['response'];

        if (response.containsKey('data') && response['data'] is Map<String, dynamic>) {
          var data = response['data'];

          if (data.containsKey('offers') && data['offers'] is List) {
            List offers = data['offers'];
            return offers.length;
          }
        }
      }
    } catch (e) {
      debugPrint('Error parsing WebSDK payload: $e');
    }
    return 0;
  }

  /// Set callback for WebSDK events
  void setWebSDKCallback(WebSDKEventCallback callback) {
    _webSDKCallback = callback;
  }

  /// Handle WebSDK events
  void handleWebSDKEvent(String event, String payload) {
    debugPrint('WebSDK event received: $event');

    if (event == 'ads_found') {
      int offerCount = getOfferCountFromWebSDKPayload(payload);
      debugPrint('Offers found: $offerCount');

      // Notify UI through callback
      if (_webSDKCallback != null) {
        _webSDKCallback!(offerCount);
      }
    }
  }

  /// Get the last used payload
  Map<String, String>? getLastUsedPayload() {
    return _lastUsedPayload;
  }

  /// Set the last used payload
  void setLastUsedPayload(Map<String, String>? payload) {
    _lastUsedPayload = payload;
  }

  /// Creates a standard payload for API and WebSDK requests
  Future<Map<String, String>> createPayload() async {
    return {
      'pub_user_id': DateTime.now().millisecondsSinceEpoch.toString(), // Simple unique ID
      'adpx_fp': DateTime.now().millisecondsSinceEpoch.toString(), // unique value
      'ua': await DeviceUtils.getUserAgent(),
      'themeId': 'demo',
      'placement': 'checkout',
    };
  }
}
