# Integrating Moments API in iOS App using Swift

## Overview

This sample demonstrates how to integrate the Moments API into a native iOS application using Swift. Use it as a reference for offer retrieval, UI display, and event tracking.

Learn more about [MomentPerks](https://docs.momentscience.com/momentperks) and how it can help you engage your users with personalized offers.

## Prerequisites

- API key ([get yours here](https://app.momentscience.com/))
- Xcode (latest)
- iOS 15.0 or higher

## Documentation

- **Integration Guide:** [Swift Moments API Integration Guide](https://docs.momentscience.com/swift-moments-api-integration-guide)
- **API Reference:** [MomentPerks API Documentation](https://docs.momentscience.com/momentperks-api)
- **Overview:** [MomentPerks Platform](https://docs.momentscience.com/momentperks)

## Quick Integration Steps

1. **Fetch Offers:**
   Use the provided `fetchOffers` function to call the Moments API and retrieve offers. Adjust parameters as needed for your use case.
2. **Build Offer UI:**
   Use `OfferContainerView` and `OfferView` SwiftUI components to display offers and handle user actions.
3. **Track Interactions:**
   Use `fireBeaconRequest` to fire beacons for user events (display, close, negative action).

For detailed implementation patterns and advanced usage, refer to the [Swift Integration Guide](https://docs.momentscience.com/swift-moments-api-integration-guide).

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

## Support

Need help? Have questions?

- **Email:** [help@momentscience.com](mailto:help@momentscience.com)
- **Documentation:** [MomentPerks Docs](https://docs.momentscience.com/momentperks)
- **Dashboard:** [Get your API key](https://app.momentscience.com/)

## License

See LICENSE file for details.
