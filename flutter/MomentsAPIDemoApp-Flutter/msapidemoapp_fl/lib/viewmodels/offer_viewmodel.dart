import 'package:flutter/material.dart';
import '../service/offer_service.dart';
import 'package:url_launcher/url_launcher.dart';

/// ViewModel for managing offer-related business logic and state.
///
/// Handles loading offers from the API, tracking user actions (accept, decline, close),
/// and firing tracking beacons. Notifies listeners of state changes for UI updates.
/// Keeps all business logic separate from UI logic.
class OfferViewModel with ChangeNotifier {
  /// Service for making API and tracking requests.
  final OfferService _apiService = OfferService();

  /// Whether offers are currently being loaded.
  bool _isLoading = false;

  /// Stores the latest error message, if any.
  String? _errorMessage;

  /// Stores the latest offer response data.
  dynamic _offerResponse = {};

  /// Gets whether offers are being loaded.
  bool get isLoading => _isLoading;

  /// Gets the current error message, if any.
  String? get errorMessage => _errorMessage;

  /// Gets the current offer response data.
  dynamic get offerResponse => _offerResponse;

  /// Loads offers from the API using the provided parameters.
  /// Notifies listeners of loading, success, or error states.
  ///
  /// [apiKey] - The API key.
  /// [isDevelopment] - Whether to use development mode.
  /// [loyaltyBoost] - Loyalty boost parameter.
  /// [creative] - Creative parameter.
  /// [campaignId] - Campaign ID parameter.
  /// [payload] - Additional payload data.
  Future<void> loadOffers({
    required String apiKey,
    bool isDevelopment = false,
    String loyaltyBoost = "0",
    String creative = "0",
    String? campaignId,
    Map<String, String> payload = const {},
  }) async {
    try {
      _isLoading = true;
      notifyListeners();

      final response = await _apiService.loadOffers(
        apiKey: apiKey,
        isDevelopment: isDevelopment,
        loyaltyBoost: loyaltyBoost,
        creative: creative,
        campaignId: campaignId,
        payload: payload,
      );
      _offerResponse = response;
    } catch (e) {
      _errorMessage = e.toString();
      debugPrint('Error loading offers: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Sends a GET request to the specified URL for tracking purposes.
  /// Errors are logged but do not affect UI state.
  ///
  /// [url] - The URL to send the tracking request to.
  Future<void> sendTrackingRequest(String url) async {
    if (url.isNotEmpty) {
      try {
        await _apiService.sendRequest(url);
        debugPrint('🐤 Sent tracking request to: $url');
      } catch (e) {
        debugPrint('Error sending tracking request to $url: $e');
      }
    }
  }

  /// Handles the positive action for an offer (e.g., accepting an offer).
  /// Opens the offer's click URL if available, and sends a close beacon if this is the last offer.
  /// Returns true if the next offer should be shown, or false if the offer page should be closed.
  ///
  /// [offer] - The current offer object.
  /// [currentIndex] - The index of the current offer.
  /// [totalOffers] - The total number of offers.
  Future<bool> handlePositiveAction(dynamic offer, int currentIndex, int totalOffers) async {
    // Open the click_url in external browser if available
    if (offer['click_url'] != null && offer['click_url'].isNotEmpty) {
      final Uri url = Uri.parse(offer['click_url']);
      try {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      } catch (e) {
        debugPrint('Could not launch URL: ${offer['click_url']}. Error: $e');
      }
    }

    // If this is the last offer, send the close beacon before dismissing, without awaiting completion
    if (currentIndex >= totalOffers - 1) {
      final closeBeacon = offer?['beacons']?['close'];
      if (closeBeacon != null && closeBeacon.isNotEmpty) {
        sendTrackingRequest(closeBeacon);
      }
    }

    // Return whether to move to next offer (true) or close page (false)
    return currentIndex < totalOffers - 1;
  }

  /// Handles the negative action for an offer (e.g., declining an offer).
  /// Sends a 'no_thanks_click' beacon if available, and a close beacon if this is the last offer.
  /// Returns true if the next offer should be shown, or false if the offer page should be closed.
  ///
  /// [offer] - The current offer object.
  /// [currentIndex] - The index of the current offer.
  /// [totalOffers] - The total number of offers.
  Future<bool> handleNegativeAction(dynamic offer, int currentIndex, int totalOffers) async {
    // Send request for no_thanks_click beacon if available, without awaiting completion
    final noThanksBeacon = offer?['beacons']?['no_thanks_click'];
    if (noThanksBeacon != null && noThanksBeacon.isNotEmpty) {
      sendTrackingRequest(noThanksBeacon);
    }

    // If this is the last offer, send the close beacon before dismissing, without awaiting completion
    if (currentIndex >= totalOffers - 1) {
      final closeBeacon = offer?['beacons']?['close'];
      if (closeBeacon != null && closeBeacon.isNotEmpty) {
        sendTrackingRequest(closeBeacon);
      }
    }

    // Return whether to move to next offer (true) or close page (false)
    return currentIndex < totalOffers - 1;
  }

  /// Handles the close action for an offer page.
  /// Sends a close beacon if available.
  ///
  /// [offer] - The current offer object.
  Future<void> handleCloseAction(dynamic offer) async {
    // Send request for close beacon if available, without awaiting completion
    final closeBeacon = offer?['beacons']?['close'];
    if (closeBeacon != null && closeBeacon.isNotEmpty) {
      sendTrackingRequest(closeBeacon);
    }
  }

  /// Sends initial display tracking requests for an offer.
  /// Fires both 'pixel' and 'adv_pixel_url' beacons if available.
  ///
  /// [offer] - The current offer object.
  Future<void> handleDisplayTracking(dynamic offer) async {
    // Send request for pixel if available
    final pixel = offer?['pixel'];
    if (pixel != null && pixel.isNotEmpty) {
      sendTrackingRequest(pixel);
    }
    // Send request for adv_pixel_url if available
    final advPixelUrl = offer?['adv_pixel_url'];
    if (advPixelUrl != null && advPixelUrl.isNotEmpty) {
      sendTrackingRequest(advPixelUrl);
    }
  }
}
