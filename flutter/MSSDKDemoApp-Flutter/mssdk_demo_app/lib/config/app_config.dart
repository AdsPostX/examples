import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Configuration constants for the app
class AppConfig {
  /// API related configuration
  static final api = _API();

  /// WebView related configuration
  static final web = _Web();

  /// Load environment variables
  static Future<void> load() async {
    await dotenv.load();
  }
}

/// API configuration constants
class _API {
  /// Base URL for the offers API endpoint
  String get baseURL => dotenv.env['API_BASE_URL'] ?? "";

  /// Default SDK ID for demo purposes
  String get defaultSDKId => dotenv.env['API_DEFAULT_SDK_ID'] ?? "";
}

/// WebView configuration constants
class _Web {
  /// CDN URL for the WebSDK launcher script
  String get launcherScriptURL => dotenv.env['WEBSDK_LAUNCHER_URL'] ?? "";
}
