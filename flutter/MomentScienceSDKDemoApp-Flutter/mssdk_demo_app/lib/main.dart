import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'screens/offers_screen.dart';
import 'config/app_config.dart';

/// The main entry point of the MSSDK Demo App.
/// This app demonstrates the integration and usage of the MomentScience SDK.
void main() async {
  // Ensure Flutter is initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables
  await AppConfig.load();

  // Set preferred orientations to portrait only
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(const MSSDKDemoApp());
}

/// The root widget of the MSSDK Demo App.
/// This widget sets up the basic theme and navigation structure of the app.
class MSSDKDemoApp extends StatelessWidget {
  const MSSDKDemoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MSSDK Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          elevation: 0,
          titleTextStyle: TextStyle(
            color: Colors.black,
            fontSize: 42,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      home: const OffersScreen(),
    );
  }
}

/// The home page of the MSSDK Demo App.
/// This widget serves as the main screen where users can interact with
/// different features of the MomentScience SDK.
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('MSSDK Demo'), backgroundColor: Theme.of(context).colorScheme.inversePrimary),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Welcome to MSSDK Demo App', style: TextStyle(fontSize: 24)),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const OffersScreen()),
                );
              },
              child: const Text('Go to Offers'),
            ),
          ],
        ),
      ),
    );
  }
}
