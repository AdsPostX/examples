import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/app_config.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

/// Service responsible for handling WebView content generation and loading
class CheckoutService {
  /// Singleton instance
  static final CheckoutService _instance = CheckoutService._internal();

  /// Factory constructor to return the singleton instance
  factory CheckoutService() => _instance;

  /// Private constructor for singleton pattern
  CheckoutService._internal();

  /// Set of URLs that have been opened externally
  final Set<String> _externallyOpenedUrls = <String>{};

  /// Prepares HTML content based on prefetch method and loads it into the WebView
  ///
  /// [controller] The WebView controller to load content into
  /// [sdkId] The SDK ID to use for initialization
  /// [isPrefetchApi] Whether the prefetch method was API or WebSDK
  /// [apiResponse] The API response data (only needed for API prefetch)
  /// [offerCount] The number of offers available
  /// [payload] The custom payload used in the request
  Future<void> loadContentIntoWebView({
    required InAppWebViewController controller,
    required String sdkId,
    required bool isPrefetchApi,
    Map<String, dynamic>? apiResponse,
    required int offerCount,
    Map<String, String>? payload,
  }) async {
    try {
      // Reset the externally opened URLs when loading new content
      resetExternallyOpenedUrls();

      // Get SDK CDN URL from AppConfig
      final String sdkCdnUrl = AppConfig.web.launcherScriptURL;

      // Load HTML template from assets
      final String htmlTemplate = await rootBundle.loadString('assets/html/checkout.html');

      // Create AdpxUser script with payload key-value pairs
      String adpxUserScript = _createAdpxUserScript(payload);

      // Different config based on prefetch method
      String autoLoadConfig = _getAutoLoadConfig(isPrefetchApi);

      // Prepare response handling code - only for API prefetch method
      String responseHandling = _createResponseHandlingScript(isPrefetchApi, apiResponse);

      // Replace placeholders with actual values
      String html = htmlTemplate
          .replaceAll('%%SDK_ID%%', sdkId)
          .replaceAll('%%SDK_CDN_URL%%', sdkCdnUrl)
          .replaceAll('%%OFFERS_COUNT%%', offerCount.toString())
          .replaceAll('%%AUTOLOAD_CONFIG%%', autoLoadConfig)
          .replaceAll('%%RESPONSE_HANDLING%%', responseHandling)
          .replaceAll('window.AdpxUser = {};', adpxUserScript);

      // Load HTML content directly with a proper baseUrl
      await controller.loadData(
        data: html,
        mimeType: 'text/html',
        encoding: 'utf-8',
        baseUrl: WebUri(
            'https://myapp.local'), // Use a valid URL, The browser doesn't actually try to connect to this domain - it just uses it as a reference point. please note that skipping this parameter will throw security error, and also setting it as about:blank will also throw security error.
      );

      debugPrint('WebView initialized with SDK ID: $sdkId');
    } catch (e) {
      debugPrint('Error loading HTML content: $e');
      rethrow;
    }
  }

  /// Creates the AdpxUser script with payload key-value pairs
  String _createAdpxUserScript(Map<String, String>? payload) {
    String adpxUserScript = 'window.AdpxUser = {';
    if (payload != null && payload.isNotEmpty) {
      payload.forEach((key, value) {
        adpxUserScript += '\n  $key: "$value",';
      });
      // Remove trailing comma
      adpxUserScript = adpxUserScript.substring(0, adpxUserScript.length - 1);
    }
    adpxUserScript += '\n};';
    return adpxUserScript;
  }

  /// Gets the appropriate autoLoad configuration based on prefetch method
  String _getAutoLoadConfig(bool isPrefetchApi) {
    if (isPrefetchApi) {
      // For API prefetch: Disable auto features since we'll provide the response
      return 'autoLoad: false, prefetch: false';
    } else {
      // For WebSDK prefetch: Enable auto features to use cached data
      return 'autoLoad: true, prefetch: true';
    }
  }

  /// Creates the response handling script for API prefetch
  String _createResponseHandlingScript(bool isPrefetchApi, Map<String, dynamic>? apiResponse) {
    if (isPrefetchApi && apiResponse != null) {
      // Prepare the JSON string for the API response
      final apiResponseJson = jsonEncode(apiResponse);

      return '''
        // Add the API response to Adpx
        if (window.Adpx && window.Adpx.setApiResponse) {
          const apiResponse = $apiResponseJson;
          window.Adpx.setApiResponse(apiResponse).then(() => {
            console.log('API response set to Adpx, now reloading...');
            window.Adpx.reload();
          });
        }
      ''';
    }
    return '';
  }

  /// Normalizes a URL by removing trailing slashes
  String _normalizeUrl(String url) {
    return url.endsWith('/') ? url.substring(0, url.length - 1) : url;
  }

  /// Handles URL navigation in the WebView
  /// Returns the navigation policy (ALLOW/CANCEL)
  Future<NavigationActionPolicy> handleUrlNavigation(NavigationAction navigationAction) async {
    final uri = navigationAction.request.url;
    if (uri != null) {
      // Delay to ensure that we will have value stored in _externallyOpenedUrls
      await Future.delayed(const Duration(seconds: 1));

      final url = uri.toString();
      final normalizedUrl = _normalizeUrl(url);
      debugPrint('Intercepted URL: $normalizedUrl');

      // Compare using normalized URLs
      if (_externallyOpenedUrls.contains(normalizedUrl)) {
        debugPrint('Canceling navigation for externally opened URL: $normalizedUrl');
        return NavigationActionPolicy.CANCEL;
      }

      return NavigationActionPolicy.ALLOW;
    }

    return NavigationActionPolicy.CANCEL;
  }

  /// Handles ad callback events from the WebView
  ///
  /// [event] The event name received from the callback
  /// [payload] The payload data received with the event
  Future<void> handleAdEvent(String event, dynamic payload) async {
    debugPrint('Processing ad event: $event');

    // Handle ad_taken event that requires opening an external URL
    if (event == 'url_clicked') {
      await _processUrlEvent(payload);
    }

    // Additional event handling can be added here
  }

  /// Processes URL-related events and opens external URLs when needed
  ///
  /// [payload] The event payload which may contain a target_url
  Future<void> _processUrlEvent(dynamic payload) async {
    try {
      // Parse payload if it's a string
      Map<String, dynamic> payloadMap;
      if (payload is String) {
        try {
          payloadMap = Map<String, dynamic>.from(json.decode(payload));
        } catch (e) {
          debugPrint('Error parsing payload: $e');
          return;
        }
      } else if (payload is Map) {
        payloadMap = Map<String, dynamic>.from(payload);
      } else {
        debugPrint('Unexpected payload type: ${payload.runtimeType}');
        return;
      }

      // Extract target_url and open in external browser
      if (payloadMap.containsKey('target_url')) {
        final targetUrl = payloadMap['target_url'];
        if (targetUrl != null && targetUrl is String) {
          final normalizedUrl = _normalizeUrl(targetUrl);
          _externallyOpenedUrls.add(normalizedUrl);
          await _openExternalUrl(normalizedUrl);
        }
      }
    } catch (e) {
      debugPrint('Error processing URL event: $e');
    }
  }

  /// Opens a URL in an external browser
  ///
  /// [url] The URL to open
  Future<bool> _openExternalUrl(String url) async {
    try {
      final Uri uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        return await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        debugPrint('Could not launch URL: $url');
        return false;
      }
    } catch (e) {
      debugPrint('Error launching URL: $e');
      return false;
    }
  }

  /// Clears the record of externally opened URLs
  ///
  /// This should be called when starting a new session or reloading the WebView
  void resetExternallyOpenedUrls() {
    debugPrint('Resetting externally opened URLs tracking');
    _externallyOpenedUrls.clear();
  }
}
