import 'offer_beacons.dart';

/// Model class for a single offer.
///
/// Contains all offer details including content, images, and tracking information.
class Offer {
  /// Unique identifier for the offer.
  final String id;

  /// The title of the offer.
  final String? title;

  /// The description or details of the offer.
  final String? description;

  /// The URL of the image to display for the offer.
  final String? image;

  /// The URL to open when the user accepts the offer.
  final String? clickUrl;

  /// The label for the positive (accept) call-to-action button.
  final String? ctaYes;

  /// The label for the negative (decline) call-to-action button.
  final String? ctaNo;

  /// Tracking beacons for various user actions.
  final OfferBeacons? beacons;

  /// Optional pixel tracking URL.
  final String? pixel;

  /// Optional advertiser pixel tracking URL.
  final String? advPixelUrl;

  Offer({
    required this.id,
    this.title,
    this.description,
    this.image,
    this.clickUrl,
    this.ctaYes,
    this.ctaNo,
    this.beacons,
    this.pixel,
    this.advPixelUrl,
  });

  /// Creates an [Offer] instance from JSON.
  factory Offer.fromJson(Map<String, dynamic> json) {
    return Offer(
      id: json['id']?.toString() ?? '',
      title: json['title'] as String?,
      description: json['description'] as String?,
      image: json['image'] as String?,
      clickUrl: json['click_url'] as String?,
      ctaYes: json['cta_yes'] as String?,
      ctaNo: json['cta_no'] as String?,
      beacons: json['beacons'] != null 
          ? OfferBeacons.fromJson(json['beacons'] as Map<String, dynamic>)
          : null,
      pixel: json['pixel'] as String?,
      advPixelUrl: json['adv_pixel_url'] as String?,
    );
  }

  /// Converts this [Offer] instance to JSON.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'image': image,
      'click_url': clickUrl,
      'cta_yes': ctaYes,
      'cta_no': ctaNo,
      'beacons': beacons?.toJson(),
      'pixel': pixel,
      'adv_pixel_url': advPixelUrl,
    };
  }
}

