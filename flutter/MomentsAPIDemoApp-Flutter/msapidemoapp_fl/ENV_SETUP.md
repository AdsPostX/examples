# Environment Variables Setup

## Overview
This app uses environment variables to securely store sensitive configuration like API keys. The API key is loaded from a `.env` file rather than being hardcoded.

## Setup Instructions

### 1. Create .env file
Copy the `.env.example` file to create your own `.env` file:

```bash
cp .env.example .env
```

### 2. Add Your API Key
Open the `.env` file and replace `your-api-key-here` with your actual Moments API key:

```
MOMENTS_API_KEY=your-actual-api-key-here
```

### 3. Verify Setup
The `.env` file is already configured in:
- ✅ `pubspec.yaml` - Added to assets
- ✅ `.gitignore` - Excluded from version control
- ✅ `main.dart` - Loaded before app starts
- ✅ `home_viewmodel.dart` - API key read from environment

## Important Notes

### Security
- ⚠️ **Never commit the `.env` file to version control**
- The `.env` file is already added to `.gitignore`
- Only commit `.env.example` as a template
- Each developer/environment should have their own `.env` file

### Default Behavior
- If `.env` file is not found or `MOMENTS_API_KEY` is not set, the API key will default to an empty string
- Users will need to manually enter the API key in the app UI

### Package Used
- **flutter_dotenv** (v5.2.1) - For loading environment variables from `.env` file
- Documentation: https://pub.dev/packages/flutter_dotenv

## File Structure
```
msapidemoapp_fl/
├── .env                    # Your actual API key (not in git)
├── .env.example            # Template file (committed to git)
├── pubspec.yaml            # Configured with flutter_dotenv
└── lib/
    ├── main.dart           # Loads .env on startup
    └── viewmodels/
        └── home_viewmodel.dart  # Reads API key from env
```

## Troubleshooting

### Error: "Unable to load asset: .env"
- Make sure `.env` file exists in the project root (same level as `pubspec.yaml`)
- Run `flutter clean` and `flutter pub get`
- Rebuild the app

### API Key Not Loading
- Verify `.env` file has correct format: `MOMENTS_API_KEY=your-key`
- No spaces around the `=` sign
- No quotes around the value
- File must be named exactly `.env`

### For Production Builds
For production builds, consider using:
- Platform-specific environment variables
- CI/CD secret management
- Build flavor configurations
- Flutter's `--dart-define` flag

