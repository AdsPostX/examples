import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:device_info_plus/device_info_plus.dart';

/// Utility class for device-related operations
class DeviceUtils {
  /// Private constructor to prevent instantiation
  DeviceUtils._();

  /// Device info plugin singleton
  static final DeviceInfoPlugin _deviceInfoPlugin = DeviceInfoPlugin();

  /// Get the user agent string for the current device
  static Future<String> getUserAgent() async {
    try {
      // Default user agent
      String userAgent = 'MomentScienceSDK-Flutter/1.0';

      // Get detailed device information based on platform
      // User agent below are just for example, you can get user agent dynamically.
      if (Platform.isAndroid) {
        final androidInfo = await _deviceInfoPlugin.androidInfo;
        userAgent = 'Mozilla/5.0 (Linux; Android ${androidInfo.version.release}; ${androidInfo.model}) '
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Mobile Safari/537.36 '
            'MomentScienceSDK-Flutter/1.0';
      } else if (Platform.isIOS) {
        final iosInfo = await _deviceInfoPlugin.iosInfo;
        userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS ${iosInfo.systemVersion.replaceAll('.', '_')} like Mac OS X) '
            'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1 '
            'MomentScienceSDK-Flutter/1.0';
      }

      return userAgent;
    } catch (e) {
      debugPrint('Error getting user agent: $e');
      // Return a fallback user agent
      return 'MomentScienceSDK-Flutter/1.0 (${Platform.operatingSystem}; ${Platform.operatingSystemVersion})';
    }
  }
}
