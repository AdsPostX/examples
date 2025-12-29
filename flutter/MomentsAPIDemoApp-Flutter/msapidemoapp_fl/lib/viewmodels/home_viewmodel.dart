import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

/// ViewModel for managing the state and business logic of the Home Page.
///
/// Handles the API key, development mode toggle, and error messages.
/// Notifies listeners when any state changes, allowing the UI to react accordingly.
/// Keeps business logic separate from UI logic.
class HomeViewModel with ChangeNotifier {
  /// The API key used for authenticating API requests.
  /// Loaded from .env file if available, otherwise empty string.
  String _apiKey = dotenv.env['MOMENTS_API_KEY'] ?? '';

  /// Whether the app is in development mode.
  bool _isDevelopmentMode = false;

  /// Stores the latest error message, if any.
  String? _errorMessage;

  /// Gets the current API key.
  String get apiKey => _apiKey;

  /// Gets whether development mode is enabled.
  bool get isDevelopmentMode => _isDevelopmentMode;

  /// Gets the current error message, if any.
  String? get errorMessage => _errorMessage;

  /// Updates the API key and notifies listeners.
  ///
  /// [newKey] - The new API key to set.
  void updateApiKey(String newKey) {
    _apiKey = newKey;
    notifyListeners();
  }

  /// Sets the development mode flag and notifies listeners.
  ///
  /// [value] - True to enable development mode, false otherwise.
  void setDevelopmentMode(bool value) {
    _isDevelopmentMode = value;
    notifyListeners();
  }

  /// Sets the error message and notifies listeners.
  ///
  /// [message] - The error message to set, or null to clear.
  void setErrorMessage(String? message) {
    _errorMessage = message;
    notifyListeners();
  }

  /// Notifies listeners of any state change.
  void notify() => notifyListeners();
}
