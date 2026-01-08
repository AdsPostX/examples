import 'offer.dart';
import 'offer_styles.dart';

/// Model class for the complete API response from the offers endpoint.
///
/// Contains the list of offers, styling information, and optional error details.
class OfferResponse {
  /// The data payload containing offers and styles.
  final OfferData? data;

  /// Optional error message from the API.
  final String? error;

  const OfferResponse({
    this.data,
    this.error,
  });

  /// Creates an [OfferResponse] instance from JSON.
  factory OfferResponse.fromJson(Map<String, dynamic> json) {
    return OfferResponse(
      data: json['data'] != null 
          ? OfferData.fromJson(json['data'] as Map<String, dynamic>) 
          : null,
      error: json['error'] as String?,
    );
  }

  /// Converts this [OfferResponse] instance to JSON.
  Map<String, dynamic> toJson() {
    return {
      'data': data?.toJson(),
      'error': error,
    };
  }

  /// Returns true if the response contains offers.
  bool get hasOffers => data?.hasOffers ?? false;

  /// Returns true if the response contains an error.
  bool get hasError => error != null && error!.isNotEmpty;
}

/// Model class for the data section of the offer response.
///
/// Contains the list of offers and styling configuration.
class OfferData {
  /// List of available offers.
  final List<Offer>? offers;

  /// Styling configuration for rendering offers.
  final OfferStyles? styles;

  const OfferData({
    this.offers,
    this.styles,
  });

  /// Creates an [OfferData] instance from JSON.
  factory OfferData.fromJson(Map<String, dynamic> json) {
    final offersList = json['offers'] as List<dynamic>?;
    
    return OfferData(
      offers: offersList != null
          ? offersList
              .map((e) => Offer.fromJson(e as Map<String, dynamic>))
              .toList()
          : null,
      styles: json['styles'] != null 
          ? OfferStyles.fromJson(json['styles'] as Map<String, dynamic>)
          : null,
    );
  }

  /// Converts this [OfferData] instance to JSON.
  Map<String, dynamic> toJson() {
    return {
      'offers': offers?.map((e) => e.toJson()).toList(),
      'styles': styles?.toJson(),
    };
  }

  /// Returns true if there are offers available.
  bool get hasOffers => offers?.isNotEmpty ?? false;
}

