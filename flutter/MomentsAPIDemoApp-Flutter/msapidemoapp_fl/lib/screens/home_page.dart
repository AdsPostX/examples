import 'package:flutter/material.dart';
import 'package:msapidemoapp_fl/screens/offer_page.dart';
import 'package:provider/provider.dart';
import '../viewmodels/home_viewmodel.dart';
import '../viewmodels/offer_viewmodel.dart';

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
    // Provide HomeViewModel to the widget subtree.
    return ChangeNotifierProvider(
      create: (_) => HomeViewModel(),
      child: Scaffold(
        appBar: AppBar(backgroundColor: Theme.of(context).colorScheme.inversePrimary, title: Text(title)),
        body: const SafeArea(child: _HomePageBody()),
      ),
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
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          // API Key TextField
          TextField(
            controller: _apiKeyController,
            decoration: const InputDecoration(labelText: 'API Key', border: OutlineInputBorder()),
          ),
          const SizedBox(height: 20),

          // Development Mode Switch
          Consumer<HomeViewModel>(
            builder: (_, viewModel, __) => Row(
              children: <Widget>[
                const Text('Development Mode'),
                Switch(value: viewModel.isDevelopmentMode, onChanged: viewModel.setDevelopmentMode),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Load Offers Button
          Consumer<HomeViewModel>(
            builder: (_, viewModel, __) => ElevatedButton(
              onPressed: _apiKeyController.text.isEmpty
                  ? null
                  : () {
                      // Ensure the latest API key is set before navigation.
                      viewModel.updateApiKey(_apiKeyController.text);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          // Use the existing HomeViewModel instance instead of creating a new one.
                          builder: (context) => ChangeNotifierProvider.value(
                            value: viewModel, // Pass the existing viewModel instance.
                            child: ChangeNotifierProvider(create: (_) => OfferViewModel(), child: const OfferPage()),
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
                    child: Text(viewModel.errorMessage!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                  )
                : const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}
