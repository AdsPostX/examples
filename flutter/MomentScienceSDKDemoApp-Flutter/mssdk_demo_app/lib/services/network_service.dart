import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';

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
  /// [ua] The user agent string.
  /// [placement] (Optional) Placement identifier.
  /// [ip] (Optional) IP address.
  /// [adpxFp] (Optional) should be unique for each user.
  /// [dev] (Optional) test mode flag ("0" or "1").
  /// [subid] (Optional) Sub ID.
  /// [pubUserId] (Optional) Publisher ID.
  /// [payload] (Optional) Additional custom attributes.
  /// [loyaltyboost] (Optional) Loyalty boost flag ("0", "1", or "2").
  /// [creative] (Optional) Creative flag ("0" or "1").
  ///
  /// Returns a Map representing the JSON response.
  /// Throws [NetworkException] if any validation or network error occurs.
  Future<Map<String, dynamic>> fetchOffers({
    required String sdkId,
    required String ua,
    String? placement,
    String? ip,
    String? adpxFp,
    String? dev,
    String? subid,
    String? pubUserId,
    Map<String, String>? payload,
    String? loyaltyboost,
    String? creative,
  }) async {
    // Validate loyaltyboost parameter
    if (loyaltyboost != null && !['0', '1', '2'].contains(loyaltyboost)) {
      throw NetworkException(NetworkError.invalidParameter, 'loyaltyboost must be 0, 1, or 2');
    }

    // Validate creative parameter
    if (creative != null && !['0', '1'].contains(creative)) {
      throw NetworkException(NetworkError.invalidParameter, 'creative must be 0 or 1');
    }

    // Validate dev parameter
    if (dev != null && !['0', '1'].contains(dev)) {
      throw NetworkException(NetworkError.invalidParameter, 'dev must be 0 or 1');
    }

    try {
      // Build the URL with query parameters
      final uri = Uri.parse(AppConfig.api.baseURL);

      // Add query parameters
      final queryParams = {
        'accountId': sdkId,
        'country': 'US',
      };

      if (loyaltyboost != null) {
        queryParams['loyaltyboost'] = loyaltyboost;
      }

      if (creative != null) {
        queryParams['creative'] = creative;
      }

      final url = Uri(
        scheme: uri.scheme,
        host: uri.host,
        path: uri.path,
        queryParameters: queryParams,
      );

      // Create the request body as a map
      final requestBody = <String, dynamic>{
        'ua': ua,
      };

      // Add optional parameters to the request body if they exist
      if (placement != null) requestBody['placement'] = placement;
      if (ip != null) requestBody['ip'] = ip;
      if (adpxFp != null) requestBody['adpx_fp'] = adpxFp;
      if (dev != null) requestBody['dev'] = dev;
      if (subid != null) requestBody['subid'] = subid;
      if (pubUserId != null) requestBody['pub_user_id'] = pubUserId;
      if (payload != null) {
        requestBody.addAll(payload);
      }

      // Encode the request body as JSON
      final jsonBody = jsonEncode(requestBody);

      // Prepare and send the HTTP request
      final response = await _client.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': ua,
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
