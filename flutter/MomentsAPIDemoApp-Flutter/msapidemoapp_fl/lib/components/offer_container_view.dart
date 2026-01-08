import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../viewmodels/offer_viewmodel.dart';
import '../services/navigation_service.dart';
import '../models/offer.dart';
import 'offer_view.dart';

/// A widget that displays a sequence of offers, allowing the user to
/// navigate between them, accept, decline, or close offer.
///
/// Business logic (such as tracking and action handling) is delegated
/// to [OfferViewModel], keeping UI and logic separate.
class OfferContainerView extends StatefulWidget {
  /// The list of offers to display.
  final List<Offer> offers;

  const OfferContainerView({super.key, required this.offers});

  @override
  State<OfferContainerView> createState() => _OfferContainerViewState();
}

class _OfferContainerViewState extends State<OfferContainerView> {
  /// The index of the currently displayed offer.
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    // Track the display of the first offer as soon as the widget is initialized.
    Provider.of<OfferViewModel>(context, listen: false).handleDisplayTracking(widget.offers[_currentIndex]);
  }

  /// Navigates to the previous offer, if possible, and tracks its display.
  void _goToPrevious() {
    setState(() {
      _currentIndex = (_currentIndex - 1).clamp(0, widget.offers.length - 1);
      Provider.of<OfferViewModel>(context, listen: false).handleDisplayTracking(widget.offers[_currentIndex]);
    });
  }

  /// Navigates to the next offer, if possible, and tracks its display.
  void _goToNext() {
    setState(() {
      _currentIndex = (_currentIndex + 1).clamp(0, widget.offers.length - 1);
      Provider.of<OfferViewModel>(context, listen: false).handleDisplayTracking(widget.offers[_currentIndex]);
    });
  }

  /// Handles the negative (decline) action for the current offer.
  /// If [handleNegativeAction] returns true, moves to the next offer;
  /// otherwise, closes the offer container.
  void _handleNegativeCtaTap(Offer currentOffer) async {
    final offerViewModel = Provider.of<OfferViewModel>(context, listen: false);
    final navigationService = Provider.of<NavigationService>(context, listen: false);
    bool shouldMoveToNext = await offerViewModel.handleNegativeAction(
      currentOffer,
      _currentIndex,
      widget.offers.length,
    );
    if (shouldMoveToNext) {
      _goToNext();
    } else {
      navigationService.pop();
    }
  }

  /// Handles the positive (accept) action for the current offer.
  /// If [handlePositiveAction] returns true, moves to the next offer;
  /// otherwise, closes the offer container.
  void _handlePositiveCtaTap(Offer currentOffer) async {
    final offerViewModel = Provider.of<OfferViewModel>(context, listen: false);
    final navigationService = Provider.of<NavigationService>(context, listen: false);
    bool shouldMoveToNext = await offerViewModel.handlePositiveAction(
      currentOffer,
      _currentIndex,
      widget.offers.length,
    );
    if (shouldMoveToNext) {
      _goToNext();
    } else {
      navigationService.pop();
    }
  }

  /// Handles the close action for the current offer.
  /// Always closes the offer container after tracking.
  void _handleCloseTap(Offer currentOffer) async {
    final offerViewModel = Provider.of<OfferViewModel>(context, listen: false);
    final navigationService = Provider.of<NavigationService>(context, listen: false);
    await offerViewModel.handleCloseAction(currentOffer);
    navigationService.pop();
  }

  /// Safely parses a hex color string to a Color object.
  /// Returns [fallback] if parsing fails.
  ///
  /// [colorHex] - The hex color string (e.g., '#FFFFFF' or 'FFFFFF')
  /// [fallback] - The fallback color to use if parsing fails
  Color _parseColor(String colorHex, Color fallback) {
    try {
      // Remove '#' if present and add '0xFF' prefix
      final hexColor = colorHex.replaceAll('#', '');
      // Validate hex string (should be 6 or 8 characters)
      if (hexColor.length != 6 && hexColor.length != 8) {
        return fallback;
      }
      return Color(int.parse('0xFF$hexColor'));
    } catch (e) {
      // Return fallback color if parsing fails
      debugPrint('Failed to parse color: $colorHex. Using fallback. Error: $e');
      return fallback;
    }
  }

  @override
  Widget build(BuildContext context) {
    // If there are no offers, show a placeholder message.
    if (widget.offers.isEmpty) {
      return const Center(child: Text('No offers to display'));
    }

    final currentOffer = widget.offers[_currentIndex];
    final offerViewModel = Provider.of<OfferViewModel>(context, listen: false);
    // Get the styles from the API response if available
    final styles = offerViewModel.offerResponse?.data?.styles;
    // Extract background color for the popup, default to white if not available or invalid
    final backgroundColorHex = styles?.popupBackground ?? '#FFFFFF';
    final backgroundColor = _parseColor(backgroundColorHex, Colors.white);

    return Container(
      color: backgroundColor, // Set background color from API response styles.popup.background
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Row containing the close button at the top right.
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                IconButton(
                  icon: const Icon(Icons.close),
                  tooltip: 'Close offers',
                  onPressed: () {
                    _handleCloseTap(currentOffer);
                  },
                ),
              ],
            ),
            // Main content area: offer details and navigation.
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // The offer view displays the current offer's content and actions.
                  Expanded(
                    child: OfferView(
                      title: currentOffer.title,
                      description: currentOffer.description,
                      imageUrl: currentOffer.image,
                      positiveCta: currentOffer.ctaYes,
                      negativeCta: currentOffer.ctaNo,
                      onPositivePressed: () {
                        _handlePositiveCtaTap(currentOffer);
                      },
                      onNegativePressed: () {
                        _handleNegativeCtaTap(currentOffer);
                      },
                      // Pass styles to OfferView for further customization
                      styles: styles,
                    ),
                  ),
                  // Navigation buttons to move between offers.
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        onPressed: _currentIndex > 0 ? _goToPrevious : null,
                        icon: const Icon(Icons.arrow_left),
                        iconSize: 30,
                        tooltip: 'Previous offer',
                      ),
                      IconButton(
                        onPressed: _currentIndex < widget.offers.length - 1 ? _goToNext : null,
                        icon: const Icon(Icons.arrow_right),
                        iconSize: 30,
                        tooltip: 'Next offer',
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
