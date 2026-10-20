# Moments API Demo App - Flutter

A comprehensive Flutter demo application showcasing the integration of the [Moments API](https://docs.momentscience.com/) for displaying personalized offers to users.

## 📖 Official Documentation

This demo implements the patterns described in the official MomentScience documentation:

- **[Flutter - Moments API Integration Guide](https://docs.momentscience.com/flutter-momentperks-api-integration-guide)** - Complete integration guide
- **[MomentPerks API](https://docs.momentscience.com/momentperks-api)** - API reference documentation
- **[Getting Your API Key](https://app.momentscience.com/)** - How to obtain your API credentials
- **[MomentPerks Overview](https://docs.momentscience.com/momentperks)** - Understanding MomentPerks

## ✨ Features

- 🔑 Secure API key management using environment variables
- 📱 Clean MVVM architecture with Provider state management
- 🎨 Customizable offer UI with API-driven styling
- 🔄 Complete offer lifecycle tracking
- 🖼️ Optimized image caching for better performance
- ♿ Comprehensive accessibility support
- 🛡️ Robust null safety and error handling
- 🌐 HTTP request timeouts and retry logic

## 🎯 What This Demo Covers

This demo application demonstrates:

1. **API Integration** - Making requests to the Moments API with proper headers and payloads
2. **Offer Display** - Rendering personalized offers with custom UI components
3. **User Interactions** - Handling accept/decline/close actions
4. **Tracking** - Implementing impression and interaction tracking beacons
5. **State Management** - Using Provider for reactive state updates
6. **Error Handling** - Graceful handling of network errors and timeouts
7. **Security** - Environment-based API key management
8. **Accessibility** - Screen reader support and semantic labels

## 📋 Prerequisites

- Flutter SDK 3.8.0 or higher
- Dart SDK 3.8.0 or higher
- A valid Moments API key ([Get one here](https://app.momentscience.com/))

## 🔧 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/adspostx/examples.git
cd examples/flutter/MomentsAPIDemoApp-Flutter/msapidemoapp_fl
```

### 2. Install Dependencies

```bash
flutter pub get
```

### 3. Configure Environment Variables

**Important:** Set up your API key before running the app.

1. Copy the `.env.example` file to create `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Moments API key:
   ```
   MOMENTS_API_KEY=your-actual-api-key-here
   ```

**Note:** The `.env` file is excluded from version control for security. See [ENV_SETUP.md](msapidemoapp_fl/ENV_SETUP.md) for detailed instructions.

### 4. Run the App

```bash
flutter run
```

## 📂 Project Structure

### Repository Structure

```
MomentsAPIDemoApp-Flutter/
├── msapidemoapp_fl/          # Main Flutter application
│   ├── lib/                  # Application source code
│   ├── android/              # Android-specific configuration
│   ├── ios/                  # iOS-specific configuration
│   ├── ENV_SETUP.md          # Environment setup guide
│   └── pubspec.yaml          # Dependencies
├── docs/                     # Additional documentation (optional)
└── README.md                 # This file
```

### Application Structure

```
msapidemoapp_fl/lib/
├── main.dart                 # App entry point, loads .env
├── models/                   # Data models with null safety
│   ├── offer.dart
│   ├── offer_beacons.dart
│   ├── offer_response.dart
│   └── offer_styles.dart
├── viewmodels/              # Business logic layer
│   ├── home_viewmodel.dart
│   └── offer_viewmodel.dart
├── screens/                 # UI screens
│   ├── home_page.dart
│   └── offer_page.dart
├── components/              # Reusable UI components
│   ├── offer_view.dart
│   └── offer_container_view.dart
├── service/                 # API service layer
│   └── offer_service.dart
├── services/                # App services
│   └── navigation_service.dart
└── utils/                   # Utility functions
    └── user_agent_util.dart
```

## 🚀 Usage

1. **Enter API Key**: On the home screen, your API key will be pre-populated from the `.env` file
2. **Development Mode**: Toggle development mode to receive test offers
3. **Load Offers**: Tap "Load Offers" to fetch offers from the API
4. **Navigate Offers**: Use arrow buttons to browse through multiple offers
5. **Interact**: Accept, decline, or close offers (all actions are tracked)

## 🏗️ Architecture

This app follows **MVVM (Model-View-ViewModel)** architecture:

- **Models**: Type-safe data classes for API responses (`lib/models/`)
- **Views**: Flutter UI components (`lib/screens/`, `lib/components/`)
- **ViewModels**: Business logic and state management (`lib/viewmodels/`)
- **Services**: API communication and navigation (`lib/service/`, `lib/services/`)

### Benefits of MVVM

- ✅ Clear separation of concerns
- ✅ Improved testability
- ✅ Better code maintainability
- ✅ Reusable business logic

## 🔑 Key Features Implementation

### State Management
- Uses `Provider` for reactive state management
- Separate ViewModels for Home and Offer screens
- Dependency injection for testability
- Proper disposal of resources

### Null Safety
- All model fields are optional except required ones (e.g., `id`)
- Safe navigation operators (`?.`) throughout
- Fallback values for missing data
- Comprehensive null checks prevent runtime crashes

### Error Handling
- HTTP request timeouts (30s for offers, 10s for tracking)
- User-friendly error messages
- Retry functionality built-in
- Network error handling
- Graceful degradation

### Accessibility
- Semantic labels for screen readers
- Button state announcements (enabled/disabled)
- Image descriptions
- Tooltips for icon buttons
- Live region updates for dynamic content

### Performance
- Image caching with `cached_network_image`
- Optimized widget rebuilds with `Consumer`
- Fire-and-forget tracking requests (non-blocking)
- Efficient state updates

### Security
- Environment variables for sensitive data (API keys)
- `.env` file excluded from version control
- No hardcoded credentials in source code

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `flutter_dotenv` | Environment variable management |
| `provider` | State management |
| `http` | API networking |
| `url_launcher` | Opening external URLs |
| `cached_network_image` | Image caching |
| `tinycolor2` | Safe color parsing |

## 📱 Supported Platforms

- ✅ iOS (10.0+)
- ✅ Android (API 21+)

## ⚙️ Configuration

### API Configuration
- **Base URL**: `https://api.adspostx.com/native/v4/offers.json`
- **Authentication**: API key via query parameter
- **Content-Type**: `application/json`

For complete API documentation, see: [Flutter Integration Guide](https://docs.momentscience.com/flutter-momentperks-api-integration-guide)

### Environment Variables

See [ENV_SETUP.md](msapidemoapp_fl/ENV_SETUP.md) for detailed environment variable setup.

**Required variables:**
- `MOMENTS_API_KEY` - Your Moments API key from the dashboard

## 🔧 Troubleshooting

### API Key Issues
- Ensure `.env` file exists in `msapidemoapp_fl/` directory
- Verify `MOMENTS_API_KEY` is set correctly
- Run `flutter clean` and `flutter pub get` if needed
- Check [ENV_SETUP.md](msapidemoapp_fl/ENV_SETUP.md) for details

### Build Issues
- Ensure Flutter SDK is updated: `flutter upgrade`
- Clear cache: `flutter clean`
- Re-fetch packages: `flutter pub get`
- For Android: Check that `google-services.json` is in `android/app/`
- For iOS: Run `pod install` in the `ios/` directory if needed

### Network Issues
- Check internet connectivity
- Verify API key is valid at [app.momentscience.com](https://app.momentscience.com/)
- Enable development mode to test with sample offers
- Check console logs for detailed error messages

## 🤝 Contributing

This is a demo application provided for integration reference. For suggestions or improvements:

1. Check the [official documentation](https://docs.momentscience.com/flutter-momentperks-api-integration-guide)
2. Create an issue in this repository
3. Contact MomentScience support at [help@momentscience.com](mailto:help@momentscience.com)

## 📧 Support & Resources

### Support
- **📚 Official Documentation**: [Flutter - Moments API Integration Guide](https://docs.momentscience.com/flutter-momentperks-api-integration-guide)
- **🔑 Getting API Key**: [MomentScience Dashboard](https://app.momentscience.com/)
- **💬 Moments API Support**: [help@momentscience.com](mailto:help@momentscience.com)
- **🐛 Demo App Issues**: Create an issue in this repository

### Additional Resources
- [MomentPerks Overview](https://docs.momentscience.com/momentperks)
- [MomentPerks API](https://docs.momentscience.com/momentperks-api)
- [MomentPerks Integration Checklist](https://docs.momentscience.com/momentperks-integration-checklist)
- [MomentScience Dashboard](https://app.momentscience.com/)

## 📄 License

This is a demo application provided by MomentScience for integration reference purposes.

---

**Ready to integrate?** Start with the [official Flutter integration guide](https://docs.momentscience.com/flutter-momentperks-api-integration-guide) and use this demo as a reference implementation. 🚀
