import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/user_agent_util.dart';

/// A service class responsible for interacting with the Moments API.
///
/// This class encapsulates all network operations related to offers, such as
/// loading offers and firing tracking requests. It is designed to be used by
/// view models or other business logic layers, keeping networking separate from UI.
class OfferService {
  /// The base URL for the Moments API.
  static const String _baseUrl = 'https://api.adspostx.com/native/v4';

  /// The endpoint for fetching offers.
  static const String _path = 'offers.json';

  /// Loads offers from the Moments API.
  ///
  /// [apiKey] - The API key for authentication (required).
  /// [loyaltyBoost] - Optional parameter for loyalty boost. Must be '0', '1', or '2'.
  /// [creative] - Optional parameter for creative. Must be '0' or '1'.
  /// [campaignId] - Optional parameter for filtering offers by campaign ID.
  /// [isDevelopment] - If true, adds a development flag to the payload.
  /// [payload] - Additional payload data to send in the request body.
  ///
  /// Returns a [Map] representing the decoded JSON response.
  /// Throws an [Exception] if the API key is empty, or if the request fails,
  /// or if loyaltyBoost/creative values are invalid.
  Future<Map<String, dynamic>> loadOffers({
    required String apiKey,
    String? loyaltyBoost,
    String? creative,
    String? campaignId,
    bool isDevelopment = false,
    Map<String, String> payload = const {},
  }) async {
    if (apiKey.isEmpty) {
      throw Exception('API Key cannot be empty');
    }

    // Validate loyaltyBoost if provided
    if (loyaltyBoost != null) {
      final validLoyaltyBoostValues = ['0', '1', '2'];
      if (!validLoyaltyBoostValues.contains(loyaltyBoost)) {
        throw Exception('loyaltyBoost must be one of these values: 0, 1, or 2');
      }
    }

    // Validate creative if provided
    if (creative != null) {
      final validCreativeValues = ['0', '1'];
      if (!validCreativeValues.contains(creative)) {
        throw Exception('creative must be either 0 or 1');
      }
    }

    // Construct the URI with query parameters.
    final queryParams = {'api_key': apiKey};

    // Add optional parameters only if they are provided
    if (loyaltyBoost != null) {
      queryParams['loyaltyboost'] = loyaltyBoost;
    }
    if (creative != null) {
      queryParams['creative'] = creative;
    }
    if (campaignId != null) {
      queryParams['campaignId'] = campaignId;
    }

    final Uri uri = Uri.parse('$_baseUrl/$_path').replace(queryParameters: queryParams);

    // Prepare the payload, adding the development flag if needed.
    final Map<String, String> updatedPayload = Map.from(payload);
    if (isDevelopment) {
      updatedPayload['dev'] = '1';
    }

    try {
      // Prepare headers with user agent
      final headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': payload['ua'] ?? UserAgentUtil.getUserAgent(),
      };

      // Make the POST request to the offers API.
      final response = await http.post(uri, headers: headers, body: jsonEncode(updatedPayload));

      // If the response is successful, decode and return the JSON.
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        // Throw an exception for non-200 responses.
        throw Exception('API Error: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      // Catch and rethrow any errors during the request.
      throw Exception('Error making API call: $e');
    }
  }

  /// Fires a GET request to the specified URL without processing the response.
  ///
  /// This is useful for tracking pixels or other endpoints where the response data is not needed.
  ///
  /// [url] - The URL to send the GET request to.
  ///
  /// Throws an [Exception] if the URL is empty or if the request encounters an error.
  Future<void> sendRequest(String url) async {
    if (url.isEmpty) {
      throw Exception('URL cannot be empty');
    }

    final Uri uri = Uri.parse(url);

    try {
      // Make the GET request for tracking or similar purposes.
      await http.get(uri, headers: {'Accept': 'application/json'});
      // No response processing or return value needed.
    } catch (e) {
      // Catch and rethrow any errors during the request.
      throw Exception('Error making GET request: $e');
    }
  }
}
