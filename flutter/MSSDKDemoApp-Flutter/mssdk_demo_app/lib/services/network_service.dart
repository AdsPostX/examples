import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';
import '../utils/device_utils.dart';

/// Represents possible errors that can occur during network requests.
/// These provide specific error information for better debugging and user feedback.
enum NetworkError {
  invalidURL, // The URL couldn't be constructed properly
  noData, // No data was returned from the server
  decodingError, // Error when parsing the JSON response
  serverError, // Error returned from the server
  invalidParameter, // Parameter validation failed
  connectionError // Network connection error
}

/// Exception class for network related errors
class NetworkException implements Exception {
  final NetworkError error;
  final String message;

  NetworkException(this.error, this.message);

  @override
  String toString() => 'NetworkException: $message';
}

/// Singleton service responsible for making network requests to fetch offers.
/// Provides a clean API for fetching offers with proper parameter validation
/// and error handling, hiding the networking complexity from view models.
class NetworkService {
  /// Shared singleton instance for global access throughout the app.
  static final NetworkService _instance = NetworkService._internal();

  /// Factory constructor to return the singleton instance
  factory NetworkService() => _instance;

  /// HTTP client for making network requests
  final http.Client _client = http.Client();

  /// Private constructor for singleton pattern
  NetworkService._internal();

  /// Fetches offers from the API using the provided parameters.
  ///
  /// [sdkId] The account ID for the SDK.
  /// [isDevelopment] (Optional) When true, sets dev=1 in payload for test mode. Defaults to false.
  /// [payload] (Optional) Additional custom attributes. If it contains 'ua', it will be used as User-Agent.
  /// [loyaltyboost] (Optional) Loyalty boost flag ("0", "1", or "2").
  /// [creative] (Optional) Creative flag ("0" or "1").
  /// [campaignId] (Optional) Campaign identifier. Defaults to null.
  ///
  /// Returns a Map representing the JSON response.
  /// Throws [NetworkException] if any validation or network error occurs.
  Future<Map<String, dynamic>> fetchOffers({
    required String sdkId,
    bool isDevelopment = false,
    Map<String, String>? payload,
    String? loyaltyboost,
    String? creative,
    String? campaignId,
  }) async {
    // Validate loyaltyboost parameter
    if (loyaltyboost != null && !['0', '1', '2'].contains(loyaltyboost)) {
      throw NetworkException(NetworkError.invalidParameter, 'loyaltyboost must be 0, 1, or 2');
    }

    // Validate creative parameter
    if (creative != null && !['0', '1'].contains(creative)) {
      throw NetworkException(NetworkError.invalidParameter, 'creative must be 0 or 1');
    }

    try {
      // Build the URL with query parameters
      final uri = Uri.parse(AppConfig.api.baseURL);

      // Add query parameters
      final queryParams = {
        'api_key': sdkId,
        'country': 'US',
      };

      // Add loyaltyboost to query parameters if provided
      if (loyaltyboost != null) {
        queryParams['loyaltyboost'] = loyaltyboost;
      }

      // Add creative to query parameters if provided
      if (creative != null) {
        queryParams['creative'] = creative;
      }

      // Add campaignId to query parameters if provided
      if (campaignId != null) {
        queryParams['campaignId'] = campaignId;
      }

      final url = Uri(
        scheme: uri.scheme,
        host: uri.host,
        path: uri.path,
        queryParameters: queryParams,
      );

      // Create the request body as a map
      final requestBody = <String, dynamic>{};

      // Add dev parameter only if isDevelopment is true
      if (isDevelopment) {
        requestBody['dev'] = '1';
      }

      // Add optional payload parameters if they exist
      if (payload != null) {
        requestBody.addAll(payload);
      }

      // Get User-Agent either from payload or DeviceUtils
      final String userAgent = payload?['ua'] ?? await DeviceUtils.getUserAgent();

      // Encode the request body as JSON
      final jsonBody = jsonEncode(requestBody);

      // Prepare and send the HTTP request
      final response = await _client.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
        },
        body: jsonBody,
      );

      // Handle the response based on status code
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final jsonResponse = jsonDecode(response.body) as Map<String, dynamic>;
        return jsonResponse;
      } else {
        throw NetworkException(
          NetworkError.serverError,
          'Server returned error: ${response.statusCode}',
        );
      }
    } catch (e) {
      if (e is NetworkException) {
        rethrow;
      }

      debugPrint('Network error: $e');
      throw NetworkException(
        NetworkError.connectionError,
        'Failed to connect to the server: ${e.toString()}',
      );
    }
  }

  /// Closes the HTTP client when the service is no longer needed
  void dispose() {
    _client.close();
  }
}
