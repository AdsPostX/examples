/// Model class for offer styling configuration from API.
///
/// Contains style information for customizing the offer UI.
class OfferStyles {
  /// Styles for the overall popup/container.
  final Map<String, dynamic>? popup;

  /// Styles for offer text elements (description, buttons, etc.).
  final Map<String, dynamic>? offerText;

  const OfferStyles({
    this.popup,
    this.offerText,
  });

  /// Creates an [OfferStyles] instance from JSON.
  factory OfferStyles.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const OfferStyles();
    
    return OfferStyles(
      popup: json['popup'] as Map<String, dynamic>?,
      offerText: json['offerText'] as Map<String, dynamic>?,
    );
  }

  /// Converts this [OfferStyles] instance to JSON.
  Map<String, dynamic> toJson() {
    return {
      'popup': popup,
      'offerText': offerText,
    };
  }

  /// Gets the background color for the popup.
  String get popupBackground => popup?['background'] as String? ?? '#FFFFFF';

  /// Gets the text color for offer description.
  String get textColor => offerText?['textColor'] as String? ?? '#000000';

  /// Gets the font size for offer description.
  String get fontSize => offerText?['fontSize']?.toString() ?? '14';

  /// Gets the CTA button text size.
  String get ctaTextSize => offerText?['cta_text_size']?.toString() ?? '14px';

  /// Gets the CTA button text style (e.g., 'bold', 'normal').
  String get ctaTextStyle => offerText?['cta_text_style'] as String? ?? 'normal';

  /// Gets the positive button (Yes) background color.
  String get buttonYesBackground => 
      (offerText?['buttonYes'] as Map<String, dynamic>?)?['background'] as String? ?? '#1C64F2';

  /// Gets the positive button (Yes) text color.
  String get buttonYesColor => 
      (offerText?['buttonYes'] as Map<String, dynamic>?)?['color'] as String? ?? '#FFFFFF';

  /// Gets the negative button (No) background color.
  String get buttonNoBackground => 
      (offerText?['buttonNo'] as Map<String, dynamic>?)?['background'] as String? ?? '#FFFFFF';

  /// Gets the negative button (No) text color.
  String get buttonNoColor => 
      (offerText?['buttonNo'] as Map<String, dynamic>?)?['color'] as String? ?? '#6B7280';
}

