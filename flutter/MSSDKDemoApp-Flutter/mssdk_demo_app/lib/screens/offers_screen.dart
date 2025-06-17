import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import '../services/prefetch_service.dart';
import '../config/app_config.dart';
import '../utils/ui_utils.dart';
import 'checkout_screen.dart'; // Add this import for navigation

/// A screen that displays offers and provides prefetch functionality through API and WebSDK
class OffersScreen extends StatefulWidget {
  const OffersScreen({super.key});

  @override
  State<OffersScreen> createState() => _OffersScreenState();
}

class _OffersScreenState extends State<OffersScreen> {
  // Using default SDK ID from AppConfig
  final TextEditingController _sdkIdController = TextEditingController(text: AppConfig.api.defaultSDKId);
  final PrefetchService _prefetchService = PrefetchService();
  bool _isLoadingAPI = false;
  bool _isLoadingWebSDK = false;
  int _offerCount = 0;
  bool _showOfferCount = false;

  // Track which prefetch method was used
  bool _usedApiPrefetch = false;

  /// WebView controller for the 0x0 webview
  InAppWebViewController? _webViewController;

  @override
  void initState() {
    super.initState();

    // Set callback for WebSDK events
    _prefetchService.setWebSDKCallback((offerCount) {
      if (mounted) {
        setState(() {
          _offerCount = offerCount;
          _showOfferCount = offerCount > 0;
          _isLoadingWebSDK = false; // Hide loading when offers are received
          _usedApiPrefetch = false; // Mark that WebSDK prefetch was used
        });
      }
    });
  }

  @override
  void dispose() {
    _sdkIdController.dispose();
    super.dispose();
  }

  /// Validates the SDK ID and shows an alert if empty
  /// Returns true if valid, false otherwise
  bool _validateSdkId() {
    if (_sdkIdController.text.trim().isEmpty) {
      UIUtils.showAlert(context, 'SDK ID is required', 'Please enter a valid SDK ID to continue.');
      return false;
    }
    return true;
  }

  /// Prefetch content using API
  Future<void> _prefetchWithAPI() async {
    // Dismiss keyboard
    FocusScope.of(context).unfocus();

    if (_isLoadingAPI) return;

    // Validate SDK ID
    if (!_validateSdkId()) return;

    setState(() {
      _isLoadingAPI = true;
      _showOfferCount = false;
    });

    try {
      // Let the service handle payload creation and API calls
      await _prefetchService.prefetchWithAPI(_sdkIdController.text.trim());

      if (!mounted) return;

      // Get offer count from response
      int offerCount = _prefetchService.getOfferCount();

      setState(() {
        _offerCount = offerCount;
        _showOfferCount = offerCount > 0;
        _usedApiPrefetch = true; // Mark that API prefetch was used
      });
    } catch (e) {
      if (mounted) {
        UIUtils.showErrorSnackBar(context, 'Failed to prefetch with API: ${e.toString()}');
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingAPI = false;
        });
      }
    }
  }

  /// Prefetch content using WebSDK
  Future<void> _prefetchWithWebSDK() async {
    // Dismiss keyboard
    FocusScope.of(context).unfocus();

    if (_isLoadingWebSDK) return;

    // Validate SDK ID
    if (!_validateSdkId()) return;

    // Validate WebView controller
    if (_webViewController == null) {
      UIUtils.showErrorSnackBar(context, 'WebView not initialized. Please try again.');
      return;
    }

    setState(() {
      _isLoadingWebSDK = true;
      _showOfferCount = false;
    });

    try {
      // Pass the WebView controller to prefetchWithWebSDK
      await _prefetchService.prefetchWithWebSDK(_sdkIdController.text.trim(), _webViewController);

      // Note: We don't hide the loading indicator here
      // It will be hidden when we receive the ads_found event or timeout

      // Set a timeout to hide the loading indicator if no event is received
      Future.delayed(const Duration(seconds: 30), () {
        if (mounted && _isLoadingWebSDK) {
          setState(() {
            _isLoadingWebSDK = false;
            UIUtils.showErrorSnackBar(context, 'Timed out waiting for offers.');
          });
        }
      });
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoadingWebSDK = false; // Hide loading on error
        });
        UIUtils.showErrorSnackBar(context, 'Failed to prefetch with WebSDK: ${e.toString()}');
      }
    }
  }

  /// Handle checkout button press - navigate to the offers display screen
  void _handleCheckout() {
    debugPrint('Proceed to Checkout button pressed');

    // Check if we have offers available
    if (!_showOfferCount || _offerCount <= 0) {
      debugPrint('No offers available for checkout');
      return;
    }

    // Get the payload from the prefetch service
    final payload = _prefetchService.getLastUsedPayload();

    // Configure display screen parameters based on prefetch method
    final prefetchMethod = _usedApiPrefetch ? PrefetchMethod.api : PrefetchMethod.webSDK;
    final apiResponse = _usedApiPrefetch ? _prefetchService.getCachedApiResponse() : null;

    // Navigate to the offers display screen
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => CheckoutScreen(
          sdkId: _sdkIdController.text.trim(),
          prefetchMethod: prefetchMethod,
          apiResponse: apiResponse, // Only needed for API prefetch
          offerCount: _offerCount,
          payload: payload,
        ),
      ),
    ).then((_) => _resetState());
  }

  /// Resets the state after returning from the offers display screen
  void _resetState() {
    if (mounted) {
      setState(() {
        _showOfferCount = false;
        _offerCount = 0;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Set this property to false to prevent resizing when keyboard appears
      resizeToAvoidBottomInset: false,
      appBar: AppBar(
        title: const FittedBox(
          fit: BoxFit.scaleDown,
          alignment: Alignment.centerLeft,
          child: Text(
            'MomentScience SDK Demo App',
            style: TextStyle(
              color: Colors.black,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
      ),
      // Add a stack to overlay the loading indicator
      body: Stack(
        children: [
          // Wrap content with SingleChildScrollView to make it scrollable
          SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'SDK ID',
                    style: TextStyle(
                      fontSize: 24,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey.shade300),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                    width: double.infinity,
                    child: TextField(
                      controller: _sdkIdController,
                      style: const TextStyle(fontSize: 24),
                      decoration: const InputDecoration(
                        border: InputBorder.none,
                        hintText: 'Enter SDK ID',
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Prefetch with API will call native API first and its response will be sent to websdk on 2nd screen',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _isLoadingAPI ? null : _prefetchWithAPI,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Prefetch with API',
                        style: TextStyle(fontSize: 20),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Prefetch with WebSDK will load websdk with 0 x 0 webview on this screen first, web sdk will save response locally and when we use web sdk again on 2nd screen to display, that saved response will be used. once offers are displayed saved response will be deleted locally',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      // Disable the WebSDK button during API loading
                      onPressed: (_isLoadingAPI || _isLoadingWebSDK) ? null : _prefetchWithWebSDK,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Prefetch with WebSDK',
                        style: TextStyle(fontSize: 20),
                      ),
                    ),
                  ),

                  // Add space at the bottom to ensure content is scrollable when keyboard is open
                  SizedBox(height: _showOfferCount ? 16 : 100),

                  if (_showOfferCount) ...[
                    Center(
                      child: Text(
                        '$_offerCount offers available',
                        style: const TextStyle(
                          fontSize: 18,
                          color: Colors.grey,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: _handleCheckout,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text(
                          'Proceed to Checkout',
                          style: TextStyle(fontSize: 20),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ],
              ),
            ),
          ),
          // Center loading indicator overlay
          if (_isLoadingAPI || _isLoadingWebSDK)
            Container(
              color: Colors.black.withOpacity(0.3),
              child: const Center(
                child: CircularProgressIndicator(
                  color: Colors.blue,
                  strokeWidth: 5,
                ),
              ),
            ),
          // Add 0x0 InAppWebView that is always visible
          Positioned(
            bottom: 0,
            right: 0,
            child: SizedBox(
              width: 0,
              height: 0,
              child: InAppWebView(
                  initialUrlRequest: URLRequest(url: WebUri('about:blank')),
                  initialSettings: InAppWebViewSettings(
                    javaScriptEnabled: true,
                    domStorageEnabled: true,
                    databaseEnabled: true,
                    allowFileAccessFromFileURLs: true,
                    allowUniversalAccessFromFileURLs: true,
                  ),
                  onWebViewCreated: (controller) {
                    _webViewController = controller;
                    // Register JavaScript handler for callbacks from WebSDK
                    controller.addJavaScriptHandler(
                      handlerName: 'adpxCallback',
                      callback: (args) {
                        if (args.length >= 2) {
                          String event = args[0];
                          String payload = args[1];
                          // Forward event to business logic
                          _prefetchService.handleWebSDKEvent(event, payload);
                        }
                        return null;
                      },
                    );
                    debugPrint('0x0 WebView created');
                  },
                  onLoadStop: (controller, url) {
                    debugPrint('0x0 WebView loaded: $url');
                  }),
            ),
          ),
        ],
      ),
    );
  }
}
