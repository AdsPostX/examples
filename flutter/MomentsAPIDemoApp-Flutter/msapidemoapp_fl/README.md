# Moments API Demo App - Flutter

A Flutter demo application for integrating with the Moments API. This app demonstrates how to load and display offers from the Moments API with proper state management, error handling, and user interaction tracking.

## Features

- 🔑 Secure API key management using environment variables
- 📱 Clean MVVM architecture with Provider state management
- 🎨 Customizable offer UI with API-driven styling
- 🔄 Offer navigation and tracking
- 🖼️ Image caching for better performance
- ♿ Comprehensive accessibility support
- 🛡️ Robust null safety and error handling
- 🌐 HTTP request timeouts and retry logic

## Prerequisites

- Flutter SDK (3.8.0 or higher)
- Dart SDK (3.8.0 or higher)
- A valid Moments API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MomentsAPIDemoApp-Flutter/msapidemoapp_fl
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

**Note:** The `.env` file is excluded from version control for security. See [ENV_SETUP.md](ENV_SETUP.md) for detailed instructions.

### 4. Run the App

```bash
flutter run
```

## Project Structure

```
lib/
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

## Usage

1. **Enter API Key**: On the home screen, your API key will be pre-populated from the `.env` file
2. **Development Mode**: Toggle development mode if needed
3. **Load Offers**: Tap "Load Offers" to fetch offers from the API
4. **Navigate Offers**: Use arrow buttons to browse through multiple offers
5. **Interact**: Accept, decline, or close offers (actions are tracked)

## Configuration

### Environment Variables
See [ENV_SETUP.md](ENV_SETUP.md) for detailed environment variable setup.

### API Configuration
The app connects to: `https://api.adspostx.com/native/v4/offers.json`

## Architecture

This app follows **MVVM (Model-View-ViewModel)** architecture:

- **Models**: Type-safe data classes for API responses
- **Views**: Flutter widgets (screens and components)
- **ViewModels**: Business logic and state management with Provider
- **Services**: API communication and navigation

## Key Features Implementation

### State Management
- Uses Provider for reactive state management
- Separate ViewModels for Home and Offer screens
- Dependency injection for testability

### Null Safety
- All model fields are optional except required ones
- Safe navigation operators throughout
- Fallback values for missing data
- See [NULL_SAFETY_IMPROVEMENTS.md](../NULL_SAFETY_IMPROVEMENTS.md)

### Error Handling
- HTTP request timeouts (30s for offers, 10s for tracking)
- User-friendly error messages
- Retry functionality
- Network error handling

### Accessibility
- Semantic labels for screen readers
- Button state announcements
- Image descriptions
- Tooltips for icon buttons

### Performance
- Image caching with `cached_network_image`
- Optimized widget rebuilds
- Fire-and-forget tracking requests

## Dependencies

- **flutter_dotenv**: Environment variable management
- **provider**: State management
- **http**: API networking
- **url_launcher**: Opening external URLs
- **cached_network_image**: Image caching
- **tinycolor2**: Color parsing

## Troubleshooting

### API Key Issues
- Ensure `.env` file exists and contains `MOMENTS_API_KEY`
- Run `flutter clean` and `flutter pub get` if needed
- Check [ENV_SETUP.md](ENV_SETUP.md) for details

### Build Issues
- Ensure Flutter SDK is updated: `flutter upgrade`
- Clear cache: `flutter clean`
- Re-fetch packages: `flutter pub get`

### Firebase/Google Services
- Firebase dependencies are included for app distribution
- Ensure `google-services.json` is present for Android builds

## Documentation

- [ENV_SETUP.md](ENV_SETUP.md) - Environment variables setup guide
- [NULL_SAFETY_IMPROVEMENTS.md](../NULL_SAFETY_IMPROVEMENTS.md) - Null safety documentation
- [CODE_REVIEW.md](../CODE_REVIEW.md) - Comprehensive code review

## License

This is a demo application for Moments API integration.

## Support

For issues with:
- **Moments API**: Contact Moments API support
- **This Demo App**: Refer to documentation files or create an issue
