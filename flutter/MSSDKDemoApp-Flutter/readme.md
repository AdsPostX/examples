# MomentScience Flutter SDK Demo

This repository contains a demo application that demonstrates how to integrate the [MomentScience SDK](https://docs.momentscience.com/flutter-momentperks-prefetch-integration-guide) into a Flutter app.
This is an official MomentScience example app showing how to integrate the MomentScience SDK in a Flutter application.

**MomentScience** helps brands deliver the right offer at the right time, boosting conversion at key user journey moments.



## 📖 Overview

This demo app supports two integration modes that prefetch offers and display them instantly at checkout using a WebView.



## ⚙️ Integration Modes

### SDK Prefetch

* Offers are fetched and cached automatically via a hidden 0×0 WebView running in the background.
* Simplest integration path with no manual API calls.

### API Prefetch

* Offers are fetched manually via HTTPS requests.
* Pass the fetched offers response to the SDK at checkout.
* Provides full control over request timing and payload customization (e.g., user ID, cart value).

> In both modes, offers are rendered inside a WebView. If no offers are returned, the offer display screen can be skipped to ensure a smooth user experience.

---

## ✅ Requirements

| Requirement                | Value                                                                |
| -------------------------- | -------------------------------------------------------------------- |
| **Flutter Version**        | 3.29.2 or higher                                                     |
| **Dart Version**           | 3.7.2 or higher                                                      |
| **iOS Minimum Deployment** | iOS 12                                                               |
| **Android Min SDK**        | API level 19                                                         |
| **MomentScience SDK ID**   | [How to get one](https://docs.momentscience.com/getting-your-sdk-id) |

---

## 🚀 Getting Started

1. Clone the repo:

   ```bash
   git clone https://github.com/AdsPostX/examples.git
   cd examples/flutter/MSSDKDemoApp-Flutter
   ```
2. Open in your preferred Flutter IDE (e.g., VS Code, Android Studio).
3. Replace the placeholder SDK ID in the code with your own.
4. Run the app on a device or emulator running iOS 12+ or Android API 19+.


## 📚 Documentation

Full guide available at:
👉 [docs.momentscience.com/flutter-momentperks-prefetch-integration-guide](https://docs.momentscience.com/flutter-momentperks-prefetch-integration-guide)



## ❓ Need Help?

📧 [help@momentscience.com](mailto:help@momentscience.com)


**MomentScience** Personalized Perks. Smarter Journeys. More Conversions.