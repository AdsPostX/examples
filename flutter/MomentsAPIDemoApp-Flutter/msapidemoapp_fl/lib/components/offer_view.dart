import 'package:flutter/material.dart';
import 'package:tinycolor2/tinycolor2.dart';

/// A stateless widget that displays the details of a single offer,
/// including title, description, image, and action buttons.
///
/// All fields are optional. If a field is not provided, its section
/// will be omitted or a default will be used. This widget is purely
/// presentational and receives all data and callbacks from its parent,
/// ensuring business logic is kept separate.
class OfferView extends StatelessWidget {
  /// The title of the offer.
  final String? title;

  /// The description or details of the offer.
  final String? description;

  /// The URL of the image to display for the offer.
  final String? imageUrl;

  /// The label for the positive (accept) call-to-action button.
  final String? positiveCta;

  /// The label for the negative (decline) call-to-action button.
  final String? negativeCta;

  /// Callback when the positive (accept) button is pressed.
  final VoidCallback? onPositivePressed;

  /// Callback when the negative (decline) button is pressed.
  final VoidCallback? onNegativePressed;

  /// Styles from API response to customize UI elements.
  final Map<String, dynamic>? styles;

  /// Creates an [OfferView] widget.
  ///
  /// All fields are optional. If a field is not provided, its section
  /// will be omitted or a default will be used.
  const OfferView({
    super.key,
    this.title,
    this.description,
    this.imageUrl,
    this.positiveCta,
    this.negativeCta,
    this.onPositivePressed,
    this.onNegativePressed,
    this.styles,
  });

  /// Converts font style string to TextStyle fontWeight.
  FontWeight _getFontWeight(String style) {
    switch (style.toLowerCase()) {
      case 'bold':
        return FontWeight.bold;
      case 'normal':
        return FontWeight.normal;
      default:
        return FontWeight.normal;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Extract style values from the API response styles or use defaults
    final offerTextStyles = styles?['offerText'] ?? {};
    final descriptionColor = TinyColor.fromString(offerTextStyles['textColor'] ?? '#000000').color;
    final descriptionFontSize = double.tryParse(offerTextStyles['fontSize']?.toString() ?? '14') ?? 14.0;
    final ctaFontSizeStr = offerTextStyles['cta_text_size']?.toString() ?? '14px';
    final ctaFontSize = double.tryParse(ctaFontSizeStr.replaceAll('px', '')) ?? 14.0;
    final ctaFontStyle = offerTextStyles['cta_text_style'] ?? 'normal';
    final positiveBgColor = TinyColor.fromString(offerTextStyles['buttonYes']?['background'] ?? '#1C64F2').color;
    final negativeBgColor = TinyColor.fromString(offerTextStyles['buttonNo']?['background'] ?? '#FFFFFF').color;
    final positiveTextColor = TinyColor.fromString(offerTextStyles['buttonYes']?['color'] ?? '#FFFFFF').color;
    final negativeTextColor = TinyColor.fromString(offerTextStyles['buttonNo']?['color'] ?? '#6B7280').color;
    final ctaFontWeight = _getFontWeight(ctaFontStyle);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Display the offer title if provided and not empty.
        if (title != null && title!.isNotEmpty)
          Text(title!, style: Theme.of(context).textTheme.titleLarge, textAlign: TextAlign.center),
        if (title != null && title!.isNotEmpty) const SizedBox(height: 8),

        // Display the offer description if provided and not empty with API styles.
        if (description != null && description!.isNotEmpty)
          Text(
            description!,
            style: TextStyle(
              color: descriptionColor, // Set description color from styles.offerText.textColor
              fontSize: descriptionFontSize, // Set description font size from styles.offerText.fontSize
            ),
            textAlign: TextAlign.center,
          ),
        if (description != null && description!.isNotEmpty) const SizedBox(height: 16),

        // Display the offer image if a URL is provided and not empty.
        if (imageUrl != null && imageUrl!.isNotEmpty)
          Image.network(
            imageUrl!,
            fit: BoxFit.contain,
            height: 200,
            loadingBuilder: (context, child, loadingProgress) {
              if (loadingProgress == null) return child;
              // Show a loading indicator while the image is loading.
              return const Center(child: CircularProgressIndicator());
            },
            // Show an error icon if the image fails to load.
            errorBuilder: (context, error, stackTrace) => const Icon(Icons.error, size: 50),
          ),
        if ((imageUrl ?? '').isNotEmpty) const SizedBox(height: 16),

        // Column of action buttons for positive and negative CTAs with API styles, arranged vertically.
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (positiveCta != null && positiveCta!.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 8.0), // Add spacing between buttons
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: positiveBgColor, foregroundColor: positiveTextColor),
                  onPressed: onPositivePressed,
                  child: Text(
                    positiveCta!,
                    style: TextStyle(fontSize: ctaFontSize, fontWeight: ctaFontWeight),
                  ),
                ),
              ),
            if (negativeCta != null && negativeCta!.isNotEmpty)
              TextButton(
                style: TextButton.styleFrom(
                  backgroundColor:
                      negativeBgColor, // Set negative CTA background color from styles.offerText.buttonNo.background
                ),
                onPressed: onNegativePressed,
                child: Text(
                  negativeCta!,
                  style: TextStyle(
                    color: negativeTextColor, // Set negative CTA text color from styles.offerText.buttonNo.color
                    fontSize: ctaFontSize, // Set CTA font size from styles.offerText.cta_text_size, converted from px
                    fontWeight: ctaFontWeight, // Set CTA font weight from styles.offerText.cta_text_style
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }
}
