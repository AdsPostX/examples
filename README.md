# MomentScience SDK Examples

[**MomentScience**](https://momentscience.com/) helps brands maximize *key moments* in the user journey by delivering the right offer at the right time.  
Whether you're integrating with our low-code JS SDK or robust APIs, MomentScience powers personalized perks that drive engagement, conversions, and revenue.

This repository provides official example apps for integrating MomentScience across mobile, game and web platforms, including **Android (Kotlin)**, **iOS (Swift)**, **Flutter**, **React Native**, **Unity** and **Web**.

Each mobile platform ships two projects:

- **SDK demo (`MSSDKDemoApp-*`)**: prefetches offers through the MomentScience Web SDK inside a WebView, in both SDK Prefetch and API Prefetch modes.
- **API demo (`MomentsAPIDemoApp-*`)**: calls the MomentPerks API directly and renders offers in native UI.

## 🗂 Available Example Projects

| Platform         | Folder Path | Description |
|------------------|-------------|-------------|
| Android (Kotlin) | [`android-native/MSSDKDemoApp-Android`](android-native/MSSDKDemoApp-Android) | Jetpack Compose demo that prefetches offers with the Web SDK in a WebView |
| Android (Kotlin) | [`android-native/MomentsAPIDemoApp-Android`](android-native/MomentsAPIDemoApp-Android) | Native demo that calls the MomentPerks API and renders offers in Compose |
| iOS (Swift)      | [`ios-native/MSSDKDemoApp-iOS`](ios-native/MSSDKDemoApp-iOS) | SwiftUI demo that prefetches offers with the Web SDK in a WKWebView |
| iOS (Swift)      | [`ios-native/MomentsAPIDemoApp-iOS`](ios-native/MomentsAPIDemoApp-iOS) | Native demo that calls the MomentPerks API and renders offers in SwiftUI |
| Flutter          | [`flutter/MSSDKDemoApp-Flutter`](flutter/MSSDKDemoApp-Flutter) | Flutter demo supporting SDK and API prefetch modes in a WebView |
| Flutter          | [`flutter/MomentsAPIDemoApp-Flutter`](flutter/MomentsAPIDemoApp-Flutter) | Flutter demo that calls the MomentPerks API and renders offers natively |
| React Native     | [`react-native/MSSDKDemoApp-ReactNative`](react-native/MSSDKDemoApp-ReactNative) | React Native demo that prefetches offers with the Web SDK in a WebView |
| React Native     | [`react-native/MomentsAPIDemoApp`](react-native/MomentsAPIDemoApp) | React Native demo that calls the MomentPerks API and renders offers natively |
| React Native     | [`react-native/PerkswallEmbeddedRN`](react-native/PerkswallEmbeddedRN) | Embedded Perkswall in a React Native WebView, with in-app handling of offer links |
| Unity            | [`unity/MomentsAPI-Unity`](unity/MomentsAPI-Unity) | Reusable MomentPerks API classes for Unity plus a demo scene |
| Web              | [`web-native/launcher-native`](web-native/launcher-native) | Plain HTML/JS page that customizes the Web SDK offer unit template |

## 📖 Integration Guides

| Guide | Link |
|-------|------|
| Android SDK prefetch | [android-momentperks-prefetch-integration-guide](https://docs.momentscience.com/android-momentperks-prefetch-integration-guide) |
| Android API | [android-kotlin-momentperks-api-integration-guide](https://docs.momentscience.com/android-kotlin-momentperks-api-integration-guide) |
| iOS SDK prefetch | [swift-momentperks-prefetch-integration-guide](https://docs.momentscience.com/swift-momentperks-prefetch-integration-guide) |
| iOS API | [iosswift-momentperks-api-integration-guide](https://docs.momentscience.com/iosswift-momentperks-api-integration-guide) |
| Flutter SDK prefetch | [flutter-momentperks-prefetch-integration-guide](https://docs.momentscience.com/flutter-momentperks-prefetch-integration-guide) |
| Flutter API | [flutter-momentperks-api-integration-guide](https://docs.momentscience.com/flutter-momentperks-api-integration-guide) |
| React Native SDK prefetch | [react-native-momentperks-prefetch-integration-guide](https://docs.momentscience.com/react-native-momentperks-prefetch-integration-guide) |
| React Native API | [react-native-momentperks-api-integration-guide](https://docs.momentscience.com/react-native-momentperks-api-integration-guide) |
| Unity API | [unity-momentperks-api-integration-guide](https://docs.momentscience.com/unity-momentperks-api-integration-guide) |
| MomentPerks API reference | [momentperks-api](https://docs.momentscience.com/momentperks-api) |

## 📚 Documentation
Visit our official documentation portal for full SDK and API references: [https://docs.momentscience.com](https://docs.momentscience.com)


## ❓ Need Help?

For support or integration assistance, reach out to us at:  
📧 [help@momentscience.com](mailto:help@momentscience.com)
