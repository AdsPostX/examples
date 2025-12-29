import 'package:flutter/material.dart';
import 'dart:async';
import '../service/offer_service.dart';
import '../models/offer_response.dart';
import '../models/offer.dart';
import 'package:url_launcher/url_launcher.dart';

/// ViewModel for managing offer-related business logic and state.
///
/// Handles loading offers from the API, tracking user actions (accept, decline, close),
/// and firing tracking beacons. Notifies listeners of state changes for UI updates.
/// Keeps all business logic separate from UI logic.
class OfferViewModel with ChangeNotifier {
  /// Service for making API and tracking requests.
  final OfferService _apiService;

  /// Creates an [OfferViewModel] with an optional [apiService].
  /// If [apiService] is not provided, a default [OfferService] instance is created.
  /// This allows for dependency injection, making the ViewModel easier to test.
  OfferViewModel({OfferService? apiService}) : _apiService = apiService ?? OfferService();

  /// Whether offers are currently being loaded.
  bool _isLoading = false;

  /// Stores the latest error message, if any.
  String? _errorMessage;

  /// Stores the latest offer response data.
  OfferResponse? _offerResponse;

  /// Gets whether offers are being loaded.
  bool get isLoading => _isLoading;

  /// Gets the current error message, if any.
  String? get errorMessage => _errorMessage;

  /// Gets the current offer response data.
  OfferResponse? get offerResponse => _offerResponse;

  /// Loads offers from the API using the provided parameters.
  /// Notifies listeners of loading, success, or error states.
  ///
  /// [apiKey] - The API key.
  /// [isDevelopment] - Whether to use development mode.
  /// [loyaltyBoost] - Optional loyalty boost parameter. Must be '0', '1', or '2' when provided.
  /// [creative] - Optional creative parameter. Must be '0' or '1' when provided.
  /// [campaignId] - Campaign ID parameter.
  /// [payload] - Additional payload data.
  Future<void> loadOffers({
    required String apiKey,
    bool isDevelopment = false,
    String? loyaltyBoost,
    String? creative,
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
  Future<bool> handlePositiveAction(Offer offer, int currentIndex, int totalOffers) async {
    // Open the click_url in external browser if available
    if (offer.clickUrl != null && offer.clickUrl!.isNotEmpty) {
      final Uri url = Uri.parse(offer.clickUrl!);
      try {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      } catch (e) {
        debugPrint('Could not launch URL: ${offer.clickUrl}. Error: $e');
      }
    }

    // If this is the last offer, send the close beacon (fire-and-forget)
    if (currentIndex >= totalOffers - 1) {
      final closeBeacon = offer.beacons?.close;
      if (closeBeacon != null && closeBeacon.isNotEmpty) {
        unawaited(sendTrackingRequest(closeBeacon));
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
  Future<bool> handleNegativeAction(Offer offer, int currentIndex, int totalOffers) async {
    // Send request for no_thanks_click beacon (fire-and-forget)
    final noThanksBeacon = offer.beacons?.noThanksClick;
    if (noThanksBeacon != null && noThanksBeacon.isNotEmpty) {
      unawaited(sendTrackingRequest(noThanksBeacon));
    }

    // If this is the last offer, send the close beacon (fire-and-forget)
    if (currentIndex >= totalOffers - 1) {
      final closeBeacon = offer.beacons?.close;
      if (closeBeacon != null && closeBeacon.isNotEmpty) {
        unawaited(sendTrackingRequest(closeBeacon));
      }
    }

    // Return whether to move to next offer (true) or close page (false)
    return currentIndex < totalOffers - 1;
  }

  /// Handles the close action for an offer page.
  /// Sends a close beacon if available (fire-and-forget).
  ///
  /// [offer] - The current offer object.
  Future<void> handleCloseAction(Offer offer) async {
    // Send request for close beacon (fire-and-forget)
    final closeBeacon = offer.beacons?.close;
    if (closeBeacon != null && closeBeacon.isNotEmpty) {
      unawaited(sendTrackingRequest(closeBeacon));
    }
  }

  /// Sends initial display tracking requests for an offer.
  /// Fires both 'pixel' and 'adv_pixel_url' beacons (fire-and-forget).
  ///
  /// [offer] - The current offer object.
  Future<void> handleDisplayTracking(Offer offer) async {
    // Send request for pixel (fire-and-forget)
    final pixel = offer.pixel;
    if (pixel != null && pixel.isNotEmpty) {
      unawaited(sendTrackingRequest(pixel));
    }
    // Send request for adv_pixel_url (fire-and-forget)
    final advPixelUrl = offer.advPixelUrl;
    if (advPixelUrl != null && advPixelUrl.isNotEmpty) {
      unawaited(sendTrackingRequest(advPixelUrl));
    }
  }
}
