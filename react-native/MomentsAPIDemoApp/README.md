# Moments API Demo App

A React Native demonstration app for integrating the Moments API to display offers.

## About MomentPerks

MomentPerks is a platform that helps you engage users with personalized offers. Learn more at the [MomentPerks Overview](https://docs.momentscience.com/momentperks).

## Prerequisites

- Node.js >= 18
- React Native development environment
- iOS/Android development tools
- MomentScience API key (get yours at [MomentScience Dashboard](https://app.momentscience.com/))

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The app uses environment variables for configuration. Copy the example file and configure your settings:

```bash
cp .env.example .env
```

Then edit `.env` and add your actual API key:

```env
# API Base URL for Moments API
API_BASE_URL=https://api.adspostx.com/native/v4

# Your API Key (replace with your actual API key)
DEFAULT_API_KEY=your-actual-api-key-here
```

**Getting Your API Key:**
- Sign in to the [MomentScience Dashboard](https://app.momentscience.com/)
- Navigate to your account settings to find or generate your API key

**⚠️ Important:** Never commit the `.env` file to version control. It's already added to `.gitignore`.

### 3. iOS Setup

```bash
cd ios
pod install
cd ..
```

### 4. Run the App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## Development

### Development Mode

Toggle the "Development Mode" switch in the app to enable:
- Test offers
- Detailed logging
- Development environment

### API Key Configuration

The app loads the API key from the `.env` file for security. The default value is used when the app starts, but you can change it in the input field.

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── OfferContainerView.js
│   └── OfferView.js
├── hooks/          # Custom React hooks
│   ├── useOfferContainer.js
│   └── useOffers.js
├── models/         # Data models
│   └── OfferModel.js
├── screens/        # Screen components
│   └── OffersScreen.js
├── services/       # API services
│   └── OffersService.js
└── utils/          # Utility functions
    ├── logger.js
    └── Util.js
```

## Features

- ✅ Fetch and display offers from Moments API
- ✅ Carousel navigation between offers
- ✅ Tracking pixel support
- ✅ Dynamic styling from API
- ✅ Development mode toggle
- ✅ Error handling and retry logic
- ✅ Clean architecture with hooks

## Documentation & Resources

### Official Documentation
- [React Native Integration Guide](https://docs.momentscience.com/react-native-moments-api-integration-guide) - Complete integration guide for React Native
- [MomentPerks API Documentation](https://docs.momentscience.com/momentperks-api) - Full API reference and specifications
- [MomentPerks Overview](https://docs.momentscience.com/momentperks) - Learn about MomentPerks platform

### Tools & Support
- [MomentScience Dashboard](https://app.momentscience.com/) - Get your API keys and manage your account
- **Support:** For help and questions, contact [help@momentscience.com](mailto:help@momentscience.com)

## Troubleshooting

### API Key Issues

If you get "Invalid API key" errors:
1. Check that `.env` file exists
2. Verify `DEFAULT_API_KEY` is set correctly
3. Rebuild the app after changing environment variables

### Environment Variables Not Loading

After changing `.env`:
- **iOS:** Clean build folder and rebuild
- **Android:** Run `./gradlew clean` and rebuild


## License

See LICENSE file for details.

## Support

Need help? We're here for you:
- 📧 Email: [help@momentscience.com](mailto:help@momentscience.com)
- 📖 Documentation: [MomentScience Docs](https://docs.momentscience.com/momentperks)
- 🚀 Integration Guide: [React Native Guide](https://docs.momentscience.com/react-native-moments-api-integration-guide)
