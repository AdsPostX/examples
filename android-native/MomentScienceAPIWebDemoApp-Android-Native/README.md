# MomentScience Android SDK Demo (Kotlin)

This is an official MomentScience example app that shows how to integrate the MomentScience SDK in a native Android app using **Kotlin** and **Jetpack Compose**.

**MomentScience** helps brands deliver the right offer at the right time, boosting conversion at key user journey moments.


## 📖 Overview

This demo app supports both SDK and API-based integrations, allowing you to prefetch offers and show them instantly at checkout using a WebView.

## ⚙️ Integration Modes

### SDK Prefetch
- Offers are fetched and cached automatically via a background WebView.
- Fastest integration, no HTTP calls required.

### API Prefetch
- You fetch offers manually via HTTPS.
- Pass the payload to the SDK at checkout.

> In both modes, offers are rendered in a WebView. If no offers are found, the screen can be skipped for a frictionless experience.

---

## ✅ Requirements

| Requirement              | Value                           |
|--------------------------|----------------------------------|
| **Kotlin Version**       | 1.6.0 or higher                  |
| **Min Android SDK**      | 26                               |
| **Target Android SDK**   | 35                               |
| **UI Framework**         | Jetpack Compose                  |
| **MomentScience SDK ID** | [How to get one](https://docs.momentscience.com/getting-your-sdk-id) |

---

## 🚀 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/AdsPostX/examples.git
   cd examples/android-native/MomentScienceAPIWebDemoApp-Android-Native
2. Open in Android Studio.
3. Replace the placeholder SDK ID in the code.
4. Run the app on Android 8.0+ (API 26+).

## 📚 Documentation

Full guide available at:
👉 [docs.momentscience.com/android-integration-guide-kotlin](docs.momentscience.com/android-integration-guide-kotlin)

## ❓ Need Help?

📧 help@momentscience.com

MomentScience — Personalized Perks. Smarter Journeys. More Conversions.

