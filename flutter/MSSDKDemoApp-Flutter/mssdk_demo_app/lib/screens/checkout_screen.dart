import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import '../services/checkout_service.dart';

/// Enum to track which prefetch method was used
enum PrefetchMethod {
  api,
  webSDK,
}

/// A screen to display offers after they have been prefetched
class CheckoutScreen extends StatefulWidget {
  /// The SDK ID used for the prefetch
  final String sdkId;

  /// The method used to prefetch the offers
  final PrefetchMethod prefetchMethod;

  /// The API response data (for API prefetch method)
  final Map<String, dynamic>? apiResponse;

  /// The number of offers available
  final int offerCount;

  /// Custom payload used in API prefetch or webSDK prefetch
  final Map<String, String>? payload;

  /// Constructor for OffersDisplayScreen
  const CheckoutScreen({
    super.key,
    required this.sdkId,
    required this.prefetchMethod,
    this.apiResponse,
    this.offerCount = 0,
    this.payload,
  });

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  /// Flag to track if WebView is loading
  bool _isWebViewLoading = true;

  /// Service for handling WebView content
  final CheckoutService _checkoutService = CheckoutService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
      ),
      body: _buildWebView(),
    );
  }

  /// Builds the WebView for displaying content
  Widget _buildWebView() {
    return Stack(
      children: [
        InAppWebView(
          initialSettings: InAppWebViewSettings(
            javaScriptEnabled: true,
            domStorageEnabled: true,
            databaseEnabled: true,
            allowFileAccessFromFileURLs: true,
            allowUniversalAccessFromFileURLs: true,
          ),
          onWebViewCreated: (controller) {
            // Register JavaScript handler for callbacks
            _setupJavaScriptHandler(controller);

            // Load the content into the WebView
            _loadContent(controller);
          },
          shouldOverrideUrlLoading: (controller, navigationAction) async {
            return _handleUrlLoading(navigationAction);
          },
          onLoadStop: (controller, url) {
            setState(() {
              _isWebViewLoading = false;
            });
            debugPrint('WebView loaded: $url');
          },
          onReceivedError: (controller, request, error) {
            setState(() {
              _isWebViewLoading = false;
            });
            debugPrint('WebView error: ${error.description}');
          },
          onConsoleMessage: (controller, consoleMessage) {
            debugPrint('WebView console: ${consoleMessage.message}');
          },
        ),
        if (_isWebViewLoading)
          Container(
            width: double.infinity,
            height: double.infinity,
            color: Colors.black.withOpacity(0.3),
            child: const Center(
              child: CircularProgressIndicator(
                color: Colors.blue,
                strokeWidth: 5,
              ),
            ),
          ),
      ],
    );
  }

  /// Set up JavaScript handler for WebView callbacks
  void _setupJavaScriptHandler(InAppWebViewController controller) {
    controller.addJavaScriptHandler(
      handlerName: 'adpxCallback',
      callback: (args) {
        if (args.length >= 2) {
          String event = args[0];
          dynamic payload = args[1];
          debugPrint('WebView callback: $event, $payload');

          // Delegate event handling to the service
          _checkoutService.handleAdEvent(event, payload);
        }
        return null;
      },
    );
  }

  /// Handle URL loading in the WebView
  Future<NavigationActionPolicy> _handleUrlLoading(NavigationAction navigationAction) async {
    // Pass the full NavigationAction to the service
    return await _checkoutService.handleUrlNavigation(navigationAction);
  }

  /// Load content into the WebView
  Future<void> _loadContent(InAppWebViewController controller) async {
    try {
      await _checkoutService.loadContentIntoWebView(
        controller: controller,
        sdkId: widget.sdkId,
        isPrefetchApi: widget.prefetchMethod == PrefetchMethod.api,
        apiResponse: widget.apiResponse,
        offerCount: widget.offerCount,
        payload: widget.payload,
      );
    } catch (e) {
      debugPrint('Error loading content: $e');
      setState(() {
        _isWebViewLoading = false;
      });
    }
  }
}
