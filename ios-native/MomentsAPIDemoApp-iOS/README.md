# Integrating Moments API in Swift App

## Overview

This sample demonstrates how to integrate the Moments API into a native iOS application using Swift. Use it as a reference for offer retrieval, UI display, and event tracking. For full details, refer to the [official Moments API iOS Integration Playbook](https://docs.momentscience.com/moments-api-ios-swift-integration-playbook).

## Prerequisites

- API key ([get yours here]([https://adspostx.com/](https://docs.momentscience.com/apis-documentation#YET9v)))
- Xcode (latest)
- iOS 15.0 or higher

## Quick Integration Steps

1. **Fetch Offers:**
   Use the provided `fetchOffers` function to call the Moments API and retrieve offers. Adjust parameters as needed for your use case.
2. **Build Offer UI:**
   Use `OfferContainerView` and `OfferView` SwiftUI components to display offers and handle user actions.
3. **Track Interactions:**
   Use `fireBeaconRequest` to fire beacons for user events (display, close, negative action).

See the demo code for implementation patterns. For advanced usage, consult the [official documentation](https://docs.momentscience.com/moments-api-ios-swift-integration-playbook).

## Getting Started

1. Clone this repository:

   ```sh
   git clone https://github.com/AdsPostX/examples.git
   ```

2. Open [`ios-native/MomentsAPIDemoApp-iOS`](https://github.com/AdsPostX/examples/tree/main/ios-native/MomentsAPIDemoApp-iOS) in Xcode and resolve dependencies.
3. Run the app on a device or simulator (iOS 15+).

## Project Structure

- `OfferService.swift` – API integration logic
- `OfferContainerView.swift` – OfferContainer UI
- `OfferView.swift` – Individual offer UI
- `OffersViewModel.swift` – State management, business logic

