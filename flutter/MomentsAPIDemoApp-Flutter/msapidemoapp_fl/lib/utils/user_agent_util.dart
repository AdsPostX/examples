import 'dart:io' show Platform;

/// Utility class for handling user agent related operations.
class UserAgentUtil {
  /// Returns the appropriate user agent string based on the platform.
  ///
  /// Returns a String containing the user agent appropriate for the current platform.
  /// as of now it is hardcoded for iOS and Android, but you can fetch it dynamically.
  static String getUserAgent() {
    if (Platform.isIOS) {
      return 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
    } else {
      return 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36';
    }
  }
}
