# Moments API Unity Reusable Classes

A complete, production-ready set of Unity reusable classes for the Moments API. **Drag-and-drop ready** - just copy into your project and start using!

## 🚀 Quick Start

```bash
# 1. Copy the MomentsAPI folder to your Unity project
Assets/MomentsAPI/

# 2. Create an OfferManager GameObject in your scene
# 3. Configure your API key in the Inspector
# 4. Load offers!
```

See [QUICKSTART.md](QUICKSTART.md) for a 5-minute tutorial.

## 📦 What's Included

```
Unity/
├── Moments/                        # Reusable classes (drag & drop)
│   ├── MomentsAPI/                 # Main reusable classes folder
│   │   ├── Models/                 # Data models
│   │   │   ├── Offer.cs           # Single offer
│   │   │   ├── OfferBeacons.cs    # Tracking beacons
│   │   │   ├── OfferResponse.cs   # API response
│   │   │   └── OfferStyles.cs     # Styling config
│   │   ├── Services/
│   │   │   └── OfferService.cs    # API communication
│   │   ├── Utils/
│   │   │   └── UserAgentUtil.cs   # Platform detection
│   │   ├── Examples/
│   │   │   ├── OfferUIExample.cs      # Full UI example
│   │   │   └── ProgrammaticExample.cs # Runtime config example
│   │   ├── OfferManager.cs        # Main MonoBehaviour
│   │   ├── README.md               # Complete API docs
│   │   └── package.json            # Package metadata
│   ├── QUICKSTART.md               # 5-minute tutorial
│   ├── INSTALLATION.md             # Detailed installation
│   ├── OVERVIEW.md                 # Architecture & design
│   └── README.md                   # This file
├── MSAPIDemoApp/                   # Demo Unity project
│   ├── Assets/
│   │   ├── Scenes/
│   │   │   ├── TestStartScene.unity      # API key input
│   │   │   ├── TestOffersScene.unity     # Offers display
│   │   │   └── DemoScene.unity           # Demo scene
│   │   ├── Scripts/
│   │   │   ├── TestStart.cs              # API key handler
│   │   │   └── TestOfferUIExample.cs     # Enhanced UI example
│   │   └── MomentsAPI/             # Copy of reusable classes
│   └── ...                         # Unity project files
└── README.md                       # Project root README
```

## ✨ Features

- ✅ **Zero Dependencies** - Uses only Unity built-ins
- ✅ **Drag & Drop** - No complex setup
- ✅ **Type-Safe** - Strongly-typed C# models
- ✅ **Cross-Platform** - iOS, Android, WebGL, Windows, macOS
- ✅ **Production Ready** - Error handling, timeouts, validation
- ✅ **Well Documented** - XML docs + examples
- ✅ **Unity-Friendly** - Coroutines, UnityEvents, Inspector config

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | Get started in 5 minutes |
| [INSTALLATION.md](INSTALLATION.md) | Detailed installation guide |
| [OVERVIEW.md](OVERVIEW.md) | Architecture and design decisions |
| [MomentsAPI/README.md](MomentsAPI/README.md) | Complete API reference |

## 🎯 Basic Usage

### 1. Setup

```csharp
using UnityEngine;
using MomentsAPI;
using MomentsAPI.Models;

public class MyScript : MonoBehaviour
{
    [SerializeField] private OfferManager offerManager;

    void Start()
    {
        // Subscribe to events
        offerManager.OnOffersLoaded.AddListener(OnOffersLoaded);
        offerManager.OnError.AddListener(OnError);
        
        // Load offers
        offerManager.LoadOffers();
    }

    void OnOffersLoaded(OfferResponse response)
    {
        if (response.HasOffers())
        {
            foreach (Offer offer in response.data.offers)
            {
                Debug.Log($"Offer: {offer.title}");
            }
        }
    }

    void OnError(string error)
    {
        Debug.LogError($"Error: {error}");
    }
}
```

### 2. Handle User Actions

```csharp
// User accepts offer
offerManager.HandlePositiveAction(offer, currentIndex, totalOffers, (showNext) =>
{
    if (showNext)
        ShowNextOffer();
    else
        CloseOfferPanel();
});

// User declines offer
offerManager.HandleNegativeAction(offer, currentIndex, totalOffers, (showNext) =>
{
    if (showNext)
        ShowNextOffer();
    else
        CloseOfferPanel();
});
```

### 3. Track Display

```csharp
// Send display tracking
offerManager.HandleDisplayTracking(offer);
```

## 🎨 Examples

### Full UI Implementation
See [OfferUIExample.cs](MomentsAPI/Examples/OfferUIExample.cs) for a complete example with:
- UI setup with buttons and images
- Offer navigation
- Style application
- Tracking integration

### Programmatic Usage
See [ProgrammaticExample.cs](MomentsAPI/Examples/ProgrammaticExample.cs) for:
- Runtime configuration
- Custom payloads
- Dynamic offer handling

## 🎮 Demo Application

The `MSAPIDemoApp` folder contains a complete Unity demo project showing the reusable classes in action:

### Demo Scenes
1. **TestStartScene** - API key input screen
   - Enter your API key
   - Validates input
   - Navigates to offers scene

2. **TestOffersScene** - Main offers display
   - Loads and displays offers
   - Full UI with accept/decline buttons
   - Home button to return to start

3. **DemoScene** - Additional demo scene

### Demo Scripts
- **TestStart.cs** - Handles API key input and validation
- **TestOfferUIExample.cs** - Enhanced version of OfferUIExample with scene navigation

### Running the Demo
1. Open `MSAPIDemoApp` in Unity
2. Open `TestStartScene`
3. Press Play
4. Enter your API key
5. Click Submit to see offers

## 🔧 Requirements

- **Unity**: 2019.4 or later
- **.NET**: Standard 2.0 or .NET 4.x
- **Dependencies**: None (uses Unity built-ins)

## 📱 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| iOS | ✅ Supported | Automatic user agent |
| Android | ✅ Supported | Automatic user agent |
| WebGL | ✅ Supported | CORS required on API |
| Windows | ✅ Supported | Desktop user agent |
| macOS | ✅ Supported | Desktop user agent |

## 🏗️ Architecture

```
OfferService (API calls)
    ↓
OfferManager (MonoBehaviour)
    ↓
Your UI Script
```

**Key Components:**
- **OfferManager**: Main MonoBehaviour for managing offers
- **OfferService**: Handles API communication
- **Models**: Type-safe data models
- **UserAgentUtil**: Platform detection

## 📝 API Configuration

Configure in Inspector or code:

```csharp
offerManager.ApiKey = "your_api_key";

// Optional: Configure additional parameters
// offerManager.loyaltyBoost = "1";  // or "0", "2"
// offerManager.creative = "1";       // or "0"
// offerManager.campaignId = "campaign_123";

Dictionary<string, string> payload = new Dictionary<string, string>
{
    { "ua", UserAgentUtil.GetUserAgent() },
    { "adpx_fp", "unique_fingerprint" },
    { "pub_user_id", "user_12345" },
    { "placement", "checkout" }
};

offerManager.LoadOffersWithCustomPayload(payload);
```

## 🐛 Troubleshooting

### Offers not loading
- Check API key is correct
- Verify internet connection
- Check Console for errors
- Enable Development Mode

### Type not found errors
- Ensure MomentsAPI folder is in Assets
- Try reimporting the folder

### UI example not working
- Import TextMeshPro essentials
- Check UI references in Inspector

See [INSTALLATION.md](INSTALLATION.md) for more troubleshooting.

## 🎓 Learning Resources

1. **Start here**: [QUICKSTART.md](QUICKSTART.md)
2. **Installation**: [INSTALLATION.md](INSTALLATION.md)
3. **API Reference**: [MomentsAPI/README.md](MomentsAPI/README.md)
4. **Architecture**: [OVERVIEW.md](OVERVIEW.md)
5. **Examples**: [MomentsAPI/Examples/](MomentsAPI/Examples/)

## 🔐 Security

- API key configurable (not hardcoded)
- HTTPS for all API calls
- Input validation
- Comprehensive error handling

## 📊 Performance

- **Memory**: Minimal allocation
- **CPU**: Negligible overhead
- **Network**: Configurable timeouts
- **Size**: ~50 KB source code

## 🚢 Version

**Current Version**: 1.0.0  
**Release Date**: December 2025  
**API Compatibility**: Moments API v4

## 📄 License

Provided for use with the Moments API service.

## 💬 Support

- **Documentation**: Check the docs in this folder
- **Examples**: Review example scripts
- **Email**: help@momentscience.com

---

## 🎯 Next Steps

1. **New to these reusable classes?** → Start with [QUICKSTART.md](QUICKSTART.md)
2. **Installing?** → See [INSTALLATION.md](INSTALLATION.md)
3. **Need API details?** → Read [MomentsAPI/README.md](MomentsAPI/README.md)
4. **Want to understand design?** → Check [OVERVIEW.md](OVERVIEW.md)

---

**Ready to integrate?** Copy the `MomentsAPI` folder to your Unity project and follow the [QUICKSTART.md](QUICKSTART.md)!

🚀 **Happy coding!**
