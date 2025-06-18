import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/home_viewmodel.dart';
import '../../viewmodels/offer_viewmodel.dart';
import '../components/offer_container_view.dart';
import '../utils/user_agent_util.dart';

/// The OfferPage is responsible for displaying offers to the user.
/// It loads offers using the [OfferViewModel] and displays them using [OfferContainerView].
/// Handles loading, error, and empty states, and provides retry/close actions on error.
class OfferPage extends StatefulWidget {
  const OfferPage({super.key});

  @override
  State<OfferPage> createState() => _OfferPageState();
}

class _OfferPageState extends State<OfferPage> {
  /// Ensures offers are loaded only once after the first frame.
  bool _hasInitialized = false;

  @override
  void initState() {
    super.initState();
    // Use a post-frame callback to ensure context is available for Provider.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_hasInitialized) {
        _loadOffers();
        _hasInitialized = true;
      }
    });
  }

  /// Loads offers using the OfferViewModel and parameters from HomeViewModel.
  /// This method is called once after the widget is first built, and on retry.
  void _loadOffers() {
    final offerViewModel = Provider.of<OfferViewModel>(context, listen: false);
    final homeViewModel = Provider.of<HomeViewModel>(context, listen: false);
    // Get the user agent string
    final String userAgent = UserAgentUtil.getUserAgent();

    /// You need to pass a unique value for adpx_fp, pub_user_id. value passed here are just for example.
    offerViewModel.loadOffers(
      apiKey: homeViewModel.apiKey,
      isDevelopment: homeViewModel.isDevelopmentMode,
      loyaltyBoost: "0",
      creative: "0",
      payload: {'ua': userAgent, "adpx_fp": "1234567890", "pub_user_id": "1234567890", "placement": "checkout"},
    );
  }

  /// Builds a generic message view with an icon, title, message, and action buttons.
  ///
  /// [icon] is the icon to display.
  /// [iconColor] is the color of the icon.
  /// [title] is the main text or heading.
  /// [message] is the detailed description.
  Widget _buildMessageView({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String message,
  }) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: iconColor, size: 48),
            const SizedBox(height: 16),
            Text(title, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            Text(message, textAlign: TextAlign.center, style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Retry button to reload offers
                ElevatedButton(
                  onPressed: () {
                    _loadOffers(); // Retry loading offers
                  },
                  child: const Text('Try Again'),
                ),
                const SizedBox(width: 16),
                // Close button to dismiss the offer page
                OutlinedButton(
                  onPressed: () {
                    Navigator.of(context).pop(); // Dismiss the screen
                  },
                  child: const Text('Close'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  /// Builds the error view with retry and close actions.
  ///
  /// [errorMessage] is displayed to the user.
  Widget _buildErrorView(String errorMessage) {
    return _buildMessageView(icon: Icons.error_outline, iconColor: Colors.red, title: 'Error', message: errorMessage);
  }

  /// Builds the no offers view with retry and close actions.
  Widget _buildNoOffersView() {
    return _buildMessageView(
      icon: Icons.info_outline,
      iconColor: Colors.blue,
      title: 'No Offers Available',
      message: 'There are no offers to display at the moment.',
    );
  }

  @override
  Widget build(BuildContext context) {
    // Listen to OfferViewModel for offer data and loading/error state.
    final offerViewModel = Provider.of<OfferViewModel>(context);
    return Scaffold(
      body: SafeArea(
        child: offerViewModel.isLoading
            // Show loading indicator while offers are being fetched.
            ? const Center(child: CircularProgressIndicator())
            // Show error view if there is an error message.
            : offerViewModel.errorMessage != null
            ? _buildErrorView(offerViewModel.errorMessage!)
            // Show a message with retry and close buttons if there are no offers available.
            : offerViewModel.offerResponse['data']?['offers']?.isEmpty ?? true
            ? _buildNoOffersView()
            // Show the offers using OfferContainerView.
            : OfferContainerView(offers: offerViewModel.offerResponse['data']?['offers'] ?? []),
      ),
    );
  }
}
