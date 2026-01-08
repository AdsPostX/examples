import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'screens/home_page.dart';
import 'viewmodels/home_viewmodel.dart';
import 'services/navigation_service.dart';

/// Entry point of the Moments API Demo App.
///
/// Sets up the root widget and provides the [HomeViewModel] and [NavigationService] to the widget tree.
/// Loads environment variables from .env file before running the app.
Future<void> main() async {
  // Load environment variables from .env file
  await dotenv.load(fileName: ".env");
  
  runApp(MyApp());
}

/// The root widget of the application.
///
/// Wraps the app in a [MultiProvider] for [HomeViewModel] and [NavigationService]
/// to enable state management and navigation throughout the app.
class MyApp extends StatelessWidget {
  /// The navigation service for managing app navigation.
  final NavigationService navigationService = NavigationService();

  MyApp({super.key});

  /// Builds the MaterialApp and provides the [HomeViewModel] and [NavigationService] to all descendants.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => HomeViewModel()),
        Provider<NavigationService>.value(value: navigationService),
      ],
      child: MaterialApp(
        title: 'MSAPI Demo App',
        theme: ThemeData(colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple)),
        navigatorKey: navigationService.navigatorKey,
        home: const MyHomePage(title: 'Moments API Demo App'),
      ),
    );
  }
}
