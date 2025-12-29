/// Model class for offer tracking beacons.
///
/// Contains URLs for various tracking events.
class OfferBeacons {
  /// Beacon URL to fire when the offer is closed.
  final String? close;

  /// Beacon URL to fire when user clicks "no thanks" or declines.
  final String? noThanksClick;

  const OfferBeacons({
    this.close,
    this.noThanksClick,
  });

  /// Creates an [OfferBeacons] instance from JSON.
  factory OfferBeacons.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const OfferBeacons();
    
    return OfferBeacons(
      close: json['close'] as String?,
      noThanksClick: json['no_thanks_click'] as String?,
    );
  }

  /// Converts this [OfferBeacons] instance to JSON.
  Map<String, dynamic> toJson() {
    return {
      'close': close,
      'no_thanks_click': noThanksClick,
    };
  }
}

