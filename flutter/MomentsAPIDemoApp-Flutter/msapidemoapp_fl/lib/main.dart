import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/home_page.dart';
import 'viewmodels/home_viewmodel.dart';

/// Entry point of the Moments API Demo App.
///
/// Sets up the root widget and provides the [HomeViewModel] to the widget tree.
void main() {
  runApp(const MyApp());
}

/// The root widget of the application.
///
/// Wraps the app in a [ChangeNotifierProvider] for [HomeViewModel] to enable
/// state management throughout the app.
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  /// Builds the MaterialApp and provides the [HomeViewModel] to all descendants.
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => HomeViewModel(),
      child: MaterialApp(
        title: 'MSAPI Demo App',
        theme: ThemeData(colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple)),
        home: const MyHomePage(title: 'Moments API Demo App'),
      ),
    );
  }
}
