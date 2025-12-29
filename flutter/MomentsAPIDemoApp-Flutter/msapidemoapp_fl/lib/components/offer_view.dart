import 'package:flutter/material.dart';
import 'package:tinycolor2/tinycolor2.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/offer_styles.dart';

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
  final OfferStyles? styles;

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

  /// Safely parses a color string using TinyColor.
  /// Returns [fallback] if parsing fails.
  ///
  /// [colorString] - The color string to parse (hex, rgb, etc.)
  /// [fallback] - The fallback color to use if parsing fails
  Color _parseColor(String colorString, Color fallback) {
    try {
      final tinyColor = TinyColor.fromString(colorString);
      return tinyColor.color;
    } catch (e) {
      debugPrint('Failed to parse color: $colorString. Using fallback. Error: $e');
      return fallback;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Extract style values from the API response styles or use defaults with safe color parsing
    final descriptionColor = _parseColor(styles?.textColor ?? '#000000', Colors.black);
    final titleColor = _parseColor(styles?.textColor ?? '#000000', Colors.black);
    final descriptionFontSize = double.tryParse(styles?.fontSize ?? '14') ?? 14.0;
    final ctaFontSizeStr = styles?.ctaTextSize ?? '14px';
    final ctaFontSize = double.tryParse(ctaFontSizeStr.replaceAll('px', '')) ?? 14.0;
    final ctaFontStyle = styles?.ctaTextStyle ?? 'normal';
    final positiveBgColor = _parseColor(styles?.buttonYesBackground ?? '#1C64F2', const Color(0xFF1C64F2));
    final negativeBgColor = _parseColor(styles?.buttonNoBackground ?? '#FFFFFF', Colors.white);
    final positiveTextColor = _parseColor(styles?.buttonYesColor ?? '#FFFFFF', Colors.white);
    final negativeTextColor = _parseColor(styles?.buttonNoColor ?? '#6B7280', const Color(0xFF6B7280));
    final ctaFontWeight = _getFontWeight(ctaFontStyle);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Display the offer title if provided and not empty.
        if (title != null && title!.isNotEmpty)
          Semantics(
            header: true,
            child: Text(
              title!,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: titleColor, // Set title color from styles.offerText.textColor
              ),
              textAlign: TextAlign.center,
            ),
          ),
        if (title != null && title!.isNotEmpty) const SizedBox(height: 8),

        // Display the offer description if provided and not empty with API styles.
        if (description != null && description!.isNotEmpty)
          Semantics(
            label: 'Offer description: $description',
            child: Text(
              description!,
              style: TextStyle(
                color: descriptionColor, // Set description color from styles.offerText.textColor
                fontSize: descriptionFontSize, // Set description font size from styles.offerText.fontSize
              ),
              textAlign: TextAlign.center,
            ),
          ),
        if (description != null && description!.isNotEmpty) const SizedBox(height: 16),

        // Display the offer image if a URL is provided and not empty with caching.
        if (imageUrl != null && imageUrl!.isNotEmpty)
          Semantics(
            image: true,
            label: 'Offer promotional image',
            child: CachedNetworkImage(
              imageUrl: imageUrl!,
              fit: BoxFit.contain,
              height: 200,
              placeholder: (context, url) => Center(
                child: Semantics(
                  label: 'Loading image',
                  child: const CircularProgressIndicator(),
                ),
              ),
              errorWidget: (context, url, error) => Semantics(
                label: 'Image failed to load',
                child: const Icon(Icons.error, size: 50),
              ),
            ),
          ),
        if ((imageUrl ?? '').isNotEmpty) const SizedBox(height: 16),

        // Column of action buttons for positive and negative CTAs with API styles, arranged vertically.
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (positiveCta != null && positiveCta!.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 8.0), // Add spacing between buttons
                child: Semantics(
                  button: true,
                  label: 'Accept offer: $positiveCta',
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: positiveBgColor, foregroundColor: positiveTextColor),
                    onPressed: onPositivePressed,
                    child: Text(
                      positiveCta!,
                      style: TextStyle(fontSize: ctaFontSize, fontWeight: ctaFontWeight),
                    ),
                  ),
                ),
              ),
            if (negativeCta != null && negativeCta!.isNotEmpty)
              Semantics(
                button: true,
                label: 'Decline offer: $negativeCta',
                child: TextButton(
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
              ),
          ],
        ),
      ],
    );
  }
}
