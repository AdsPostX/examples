# Moments API Unity Reusable Classes - Overview

## What is this?

This is a **complete, production-ready set of Unity reusable classes** for integrating the Moments API into Unity games and applications. It's designed to be **drag-and-drop ready** - just copy the folder into your Unity project and start using it.

## Key Features

✅ **Zero Dependencies** - Uses only Unity's built-in networking  
✅ **Drag & Drop** - No complex setup or configuration  
✅ **Type-Safe** - Strongly-typed C# models for all API data  
✅ **Well Documented** - Comprehensive XML docs and examples  
✅ **Cross-Platform** - Works on iOS, Android, WebGL, Windows, macOS  
✅ **Production Ready** - Error handling, timeouts, validation  
✅ **Unity-Friendly** - Uses coroutines, UnityEvents, and Inspector configuration  


## What's Included

### 📦 Core Components

#### 1. **OfferManager.cs** - Main Entry Point
A MonoBehaviour that you attach to a GameObject. Handles:
- Loading offers from the API
- Managing offer state
- Handling user interactions (accept, decline, close)
- Sending tracking beacons
- Exposing Unity Events for UI integration

**Usage:**
```csharp
[SerializeField] private OfferManager offerManager;

void Start()
{
    offerManager.OnOffersLoaded.AddListener(OnOffersLoaded);
    offerManager.LoadOffers();
}
```

#### 2. **OfferService.cs** - API Communication
Handles all network operations:
- POST request to load offers
- GET requests for tracking beacons
- Timeout handling (30s for offers, 10s for tracking)
- Error handling and validation

**Features:**
- Validates API key, loyaltyBoost, creative parameters
- Automatic user agent detection
- JSON serialization/deserialization
- Coroutine-based for Unity integration

#### 3. **Data Models** - Type-Safe API Responses

**Offer.cs**
```csharp
public class Offer
{
    public string id;                    // Required
    public string? title;                // Optional
    public string? description;          // Optional
    public string? image;                // Optional
    public string? click_url;            // Optional
    public string? cta_yes;              // Optional
    public string? cta_no;               // Optional
    public OfferBeacons? beacons;        // Optional
    public string? pixel;                // Optional
    public string? adv_pixel_url;        // Optional
}
```

**OfferResponse.cs**
```csharp
public class OfferResponse
{
    public OfferData? data;      // Optional
    public string? error;         // Optional
    public bool HasOffers();
    public bool HasError();
}
```

**OfferStyles.cs**
```csharp
public class OfferStyles
{
    public PopupStyles? popup;           // Optional
    public OfferTextStyles? offerText;   // Optional
    // Helper methods to extract colors, fonts, etc.
    // Default values for missing styles
}

public class PopupStyles
{
    public string background;
}

public class OfferTextStyles
{
    public string? textColor;
    public string? fontSize;
    public string? cta_text_size;
    public string? cta_text_style;
    public ButtonStyles? buttonYes;
    public ButtonStyles? buttonNo;
}

public class ButtonStyles
{
    public string? background;
    public string? color;
}
```

**OfferBeacons.cs**
```csharp
public class OfferBeacons
{
    public string? close;              // Beacon URL for close action
    public string? no_thanks_click;    // Beacon URL for decline action
}
```
```

#### 4. **UserAgentUtil.cs** - Platform Detection
Provides appropriate user agent strings for:
- iOS
- Android
- WebGL
- Windows
- macOS

### 📚 Examples

#### **OfferUIExample.cs** - Complete UI Implementation
Shows how to:
- Create a full offer UI with Unity UI
- Load and display offers
- Handle user interactions
- Navigate through multiple offers
- Apply API styles to UI
- Load and display images
- Send tracking beacons

#### **ProgrammaticExample.cs** - Runtime Configuration
Shows how to:
- Create OfferManager at runtime
- Configure API settings programmatically
- Build custom payloads
- Handle events
- Simulate user interactions

### 🎮 Demo Application

The `MSAPIDemoApp` folder contains a complete Unity project demonstrating the reusable classes:

#### **Demo Scenes**
1. **TestStartScene.unity** - API key input
   - Input field for API key entry
   - Validation and error handling
   - Stores key in PlayerPrefs
   - Navigates to TestOffersScene

2. **TestOffersScene.unity** - Offers display
   - Complete offer UI implementation
   - Loads offers using stored API key
   - Accept/decline/close buttons
   - Home button navigation
   - Loading and error states

3. **DemoScene.unity** - Additional demo scene

#### **Demo Scripts**
- **TestStart.cs** - API key input handler (130 lines)
  - TMP_InputField for API key
  - Validation logic
  - Error panel with OK button
  - Scene navigation to TestOffersScene
  - PlayerPrefs storage

- **TestOfferUIExample.cs** - Enhanced UI example (425 lines)
  - Extends OfferUIExample functionality
  - Reads API key from PlayerPrefs
  - Home button to return to TestStartScene
  - Complete error handling
  - Loading panel integration

### 📖 Documentation

#### **README.md** - Complete API Documentation
- Quick start guide
- Architecture overview
- API reference
- Code examples
- Best practices
- Troubleshooting

#### **INSTALLATION.md** - Installation Guide
- Step-by-step installation
- File structure
- Requirements
- Testing instructions
- Platform-specific notes

## How It Works

### 1. Loading Offers

```csharp
// Configure in Inspector or code
offerManager.ApiKey = "your_api_key";

// Load offers
offerManager.LoadOffers();

// Or with custom payload
Dictionary<string, string> payload = new Dictionary<string, string>
{
    { "ua", UserAgentUtil.GetUserAgent() },
    { "adpx_fp", "unique_fingerprint" },
    { "pub_user_id", "user_12345" },
    { "placement", "checkout" }
};
offerManager.LoadOffersWithCustomPayload(payload);
```

### 2. Handling Events

```csharp
void Start()
{
    // Subscribe to events
    offerManager.OnOffersLoaded.AddListener(OnOffersLoaded);
    offerManager.OnError.AddListener(OnError);
    offerManager.OnLoadingStateChanged.AddListener(OnLoadingChanged);
}

void OnOffersLoaded(OfferResponse response)
{
    if (response.HasOffers())
    {
        // Display offers
        foreach (Offer offer in response.data.offers)
        {
            DisplayOffer(offer);
        }
    }
}
```

### 3. User Interactions

```csharp
// User accepts offer - opens click_url and sends tracking
offerManager.HandlePositiveAction(offer, currentIndex, totalOffers, (showNext) =>
{
    if (showNext)
        ShowNextOffer();
    else
        CloseOfferPanel();
});

// User declines offer - sends no_thanks_click beacon
offerManager.HandleNegativeAction(offer, currentIndex, totalOffers, (showNext) =>
{
    if (showNext)
        ShowNextOffer();
    else
        CloseOfferPanel();
});

// User closes offer - sends close beacon
offerManager.HandleCloseAction(offer);

// Track when offer is displayed
offerManager.HandleDisplayTracking(offer);
```

### 4. Tracking

```csharp
// Display tracking (automatic)
offerManager.HandleDisplayTracking(offer);

// Custom tracking
offerManager.SendTrackingRequest("https://tracking.url");
```

## Methods Reference

### OfferManager Public Methods

- `LoadOffers()` - Load offers with Inspector-configured settings
- `LoadOffersWithCustomPayload(Dictionary<string, string>)` - Load with custom payload
- `HandlePositiveAction(Offer, int, int, Action<bool>)` - Handle accept action (opens URL, sends beacon)
- `HandleNegativeAction(Offer, int, int, Action<bool>)` - Handle decline action (sends beacon)
- `HandleCloseAction(Offer)` - Handle close action (sends close beacon)
- `HandleDisplayTracking(Offer)` - Send display tracking beacons
- `SendTrackingRequest(string)` - Send tracking request to custom URL

### OfferManager Properties

- `IsLoading` - Check if offers are currently being loaded
- `CurrentOfferResponse` - Access the current loaded offers response
- `ApiKey` - Get/set the API key dynamically


## Reusability

These reusable classes are designed to be **completely reusable**:

1. **No project-specific code** - Everything is generic
2. **No external dependencies** - Uses only Unity built-ins
3. **Configurable** - All settings via Inspector or code
4. **Extensible** - Easy to inherit and customize
5. **Documented** - XML docs for IntelliSense

### How to Reuse

1. **Copy the MomentsAPI folder** to any Unity project
2. **Create an OfferManager GameObject** in your scene
3. **Configure your API key** in Inspector
4. **Subscribe to events** in your scripts
5. **Done!** No other setup required

## File Size

The entire codebase is lightweight:

### Reusable Classes
- **Total**: ~50 KB of source code
- **Models**: ~10 KB
- **Services**: ~15 KB
- **Manager**: ~15 KB
- **Utils**: ~5 KB
- **Examples**: ~30 KB (optional)
- **Docs**: ~50 KB (optional)

### Demo Application
- **Demo Scripts**: ~20 KB
- **Scenes**: Unity scene files
- **Total Demo Code**: ~555 lines

## Performance

- **Memory**: Minimal - only allocates for API responses
- **CPU**: Negligible - only during API calls
- **Network**: Configurable timeouts (30s offers, 10s tracking)
- **Threading**: All on main thread (Unity requirement)

## Security

- **API Key**: Configurable, not hardcoded
- **HTTPS**: All API calls use HTTPS
- **Validation**: Input validation for all parameters
- **Error Handling**: Comprehensive error handling

## Testing

The implementation includes:
- **Example scripts** for testing
- **Debug logging** for troubleshooting
- **Development mode** flag for testing
- **Error callbacks** for monitoring


## Version History

**v1.0.0** (December 2025)
- Initial release
- Complete API integration
- Full documentation
- Example implementations
- Cross-platform support

## Support & Contribution

These reusable classes are maintained as part of the Moments API ecosystem. For:
- **Bug reports**: Email help@momentscience.com
- **Feature requests**: Email help@momentscience.com
- **Questions**: Check README.md or email help@momentscience.com

## License

Provided for use with the Moments API service.

---

## Quick Links

- [Installation Guide](INSTALLATION.md)
- [API Documentation](MomentsAPI/README.md)
- [UI Example](MomentsAPI/Examples/OfferUIExample.cs)
- [Programmatic Example](MomentsAPI/Examples/ProgrammaticExample.cs)

---

**Ready to integrate?** Start with the [Installation Guide](INSTALLATION.md)!
