import 'package:flutter/material.dart';
import 'package:msapidemoapp_fl/screens/offer_page.dart';
import 'package:provider/provider.dart';
import '../viewmodels/home_viewmodel.dart';
import '../viewmodels/offer_viewmodel.dart';
import '../services/navigation_service.dart';

/// The main home page of the app, responsible for collecting the API key,
/// toggling development mode, and navigating to the offers page.
///
/// This widget uses [HomeViewModel] for business logic and state management.
class MyHomePage extends StatelessWidget {
  /// The title displayed in the app bar.
  final String title;

  const MyHomePage({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    // Use the HomeViewModel provided at app level in main.dart
    return Scaffold(
      appBar: AppBar(backgroundColor: Theme.of(context).colorScheme.inversePrimary, title: Text(title)),
      body: const SafeArea(child: _HomePageBody()),
    );
  }
}

/// The body of the home page, containing the form and navigation logic.
///
/// This widget is stateful to manage the API key text controller and
/// listen for changes.
class _HomePageBody extends StatefulWidget {
  const _HomePageBody();

  @override
  State<_HomePageBody> createState() => _HomePageBodyState();
}

class _HomePageBodyState extends State<_HomePageBody> {
  /// Controller for the API key input field.
  final _apiKeyController = TextEditingController();

  /// Reference to the [HomeViewModel] for business logic.
  late final HomeViewModel _viewModel;

  @override
  void initState() {
    super.initState();
    // Obtain the HomeViewModel instance and initialize the API key field.
    _viewModel = Provider.of<HomeViewModel>(context, listen: false);
    _apiKeyController.text = _viewModel.apiKey; // Initialize from ViewModel
    _apiKeyController.addListener(_updateViewModel);
  }

  /// Updates the ViewModel's API key when the text field changes.
  void _updateViewModel() {
    _viewModel.updateApiKey(_apiKeyController.text);
    setState(() {}); // Rebuild to update button state
  }

  @override
  void dispose() {
    _apiKeyController.removeListener(_updateViewModel);
    _apiKeyController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          // API Key TextField
          Semantics(
            label: 'Enter your API key',
            child: TextField(
              controller: _apiKeyController,
              decoration: const InputDecoration(
                labelText: 'API Key',
                border: OutlineInputBorder(),
                helperText: 'Required to load offers',
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Development Mode Switch
          Consumer<HomeViewModel>(
            builder: (_, viewModel, __) => Semantics(
              label: viewModel.isDevelopmentMode ? 'Development mode enabled' : 'Development mode disabled',
              toggled: viewModel.isDevelopmentMode,
              child: Row(
                children: <Widget>[
                  const Text('Development Mode'),
                  Switch(
                    value: viewModel.isDevelopmentMode,
                    onChanged: viewModel.setDevelopmentMode,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Load Offers Button
          Semantics(
            button: true,
            enabled: _apiKeyController.text.isNotEmpty,
            label: _apiKeyController.text.isEmpty 
              ? 'Load offers button. Disabled. Enter API key first.'
              : 'Load offers from Moments API',
            child: ElevatedButton(
              onPressed: _apiKeyController.text.isEmpty
                  ? null
                  : () {
                      // Ensure the latest API key is set before navigation.
                      _viewModel.updateApiKey(_apiKeyController.text);
                      final navigationService = Provider.of<NavigationService>(context, listen: false);
                      navigationService.push(
                        MaterialPageRoute(
                          // HomeViewModel is available from app-level provider, just provide OfferViewModel
                          builder: (context) => ChangeNotifierProvider(
                            create: (_) => OfferViewModel(),
                            child: const OfferPage(),
                          ),
                        ),
                      );
                    },
              child: const Text('Load Offers'),
            ),
          ),

          // Error Message Display
          Consumer<HomeViewModel>(
            builder: (_, viewModel, __) => viewModel.errorMessage != null
                ? Padding(
                    padding: const EdgeInsets.only(top: 20),
                    child: Semantics(
                      liveRegion: true,
                      label: 'Error: ${viewModel.errorMessage}',
                      child: Text(
                        viewModel.errorMessage!,
                        style: TextStyle(color: Theme.of(context).colorScheme.error),
                      ),
                    ),
                  )
                : const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}
