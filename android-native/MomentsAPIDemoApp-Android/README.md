# Integrating Moments API in Android App using Kotlin

## Overview

This sample demonstrates how to integrate the Moments API into a native Android application using Kotlin. Use it as a reference for offer retrieval, UI display, and event tracking. For full details, refer to the [official Moments API Android Integration Playbook](https://docs.momentscience.com/moments-api-android-integration-playbook).

## Prerequisites

- API key ([get yours here](https://docs.momentscience.com/apis-documentation#YET9v))
- Android Studio (latest)
- Android SDK 26+
- Add to `AndroidManifest.xml`:

  ```xml
  <uses-permission android:name="android.permission.INTERNET" />
  ```


## Quick Integration Steps

1. **Fetch Offers:**
   Use the provided `fetchOffers` function to call the Moments API and retrieve offers. Adjust parameters as needed for your use case.
2. **Build Offer UI:**
   Use `OfferContainerView` and `OfferView` composables to display offers and handle user actions.
3. **Track Interactions:**
   Use `fireBeaconRequest` to fire beacons for user events (display, close, negative action).

See the demo code for implementation patterns. For advanced usage, consult the [official documentation](https://docs.momentscience.com/moments-api-android-integration-playbook).

## Getting Started

1. Clone this repository:

   ```sh
   git clone https://github.com/AdsPostX/examples.git
   ```

2. Open `android-native/MomentsAPIDemoApp-Android` in Android Studio and sync Gradle.
3. Run the app on a device or emulator.

## Project Structure

- `app/` – Main source code
- `app/src/main/java/com/momentscience/android/msapidemoapp` – Kotlin files
- `app/src/main/res/` – Resources
- `app/build.gradle.kts` – Build config