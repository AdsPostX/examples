# MomentScience iOS SDK Demo (Swift)

This repository contains a demo application that demonstrates how to integrate the [MomentScience SDK](https://docs.momentscience.com/ios-integration-guide-swift) into an iOS app.
This is an official MomentScience example app showing how to integrate the SDK using **Swift** and **SwiftUI**.

**MomentScience** helps brands deliver the right offer at the right time, boosting conversion at key user journey moments.


## 📖 Overview

This demo app supports two integration modes that prefetch offers and display them instantly at checkout using a WebView.



## ⚙️ Integration Modes

### SDK Prefetch

* Offers are fetched and cached automatically via a hidden 0×0 WebView on a pre-checkout screen (e.g., cart).
* Lightest and fastest integration.
* No native networking code required.

### API Prefetch

* Offers are fetched manually using a native HTTPS call.
* The response payload is passed to the SDK during checkout.
* Offers full control over fetch timing and payload customization (e.g., user ID, cart value).

> In both modes, offers are rendered in a WebView at checkout. If no offers are found, the display screen can be skipped to maintain a smooth experience.



## ✅ Requirements

| Requirement              | Value                                                                |
| ------------------------ | -------------------------------------------------------------------- |
| **Swift Version**        | 5                                                                    |
| **UI Framework**         | SwiftUI                                                              |
| **Minimum iOS Version**  | 15.6                                                                 |
| **MomentScience SDK ID** | [How to get one](https://docs.momentscience.com/getting-your-sdk-id) |



## 🚀 Getting Started

1. Clone the repo:

   ```bash
   git clone https://github.com/AdsPostX/examples.git
   cd examples/ios-native/MSSDKDemoApp-iOS
   ```
2. Open the project in **Xcode 15+**.
3. Replace the placeholder SDK ID in the code with your own.
4. Run the app on a device or simulator with iOS 15.6 or later.



## 📚 Documentation

Full guide available at:
👉 [docs.momentscience.com/ios-integration-guide-swift](https://docs.momentscience.com/ios-integration-guide-swift)



## ❓ Need Help?

📧 [help@momentscience.com](mailto:help@momentscience.com)


**MomentScience**, Personalized Perks. Smarter Journeys. More Conversions.