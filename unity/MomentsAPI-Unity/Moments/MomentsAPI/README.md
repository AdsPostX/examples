# Moments API Unity Reusable Classes

A complete set of reusable Unity classes for integrating the Moments API into your Unity projects. These reusable classes provide a clean, drag-and-drop solution for displaying offers and tracking user interactions.

**📚 [Moments API Documentation](https://docs.momentscience.com/momentperks-api)**

## Features

- ✅ **Drag-and-Drop Ready**: Simply copy the `MomentsAPI` folder into your Unity project
- ✅ **Complete API Integration**: Load offers, handle tracking, and manage user interactions
- ✅ **Type-Safe Models**: Strongly-typed C# classes for all API responses
- ✅ **Unity-Friendly**: Uses coroutines and UnityEvents for seamless integration
- ✅ **Platform Support**: Works on iOS, Android, WebGL, Windows, and macOS
- ✅ **Customizable**: Full control over styling and behavior
- ✅ **Well-Documented**: Comprehensive XML documentation and examples

## Installation

1. Copy the entire `MomentsAPI` folder into your Unity project's `Assets` folder
2. That's it! The reusable classes are ready to use.

## Quick Start

### 1. Basic Setup

1. Create an empty GameObject in your scene (e.g., "OfferManager")
2. Add the `OfferManager` component to it
3. Configure the component in the Inspector:
   - **API Key**: Your Moments API key
   - **Development Mode**: Enable for testing
   - **Loyalty Boost**: Set to "0", "1", or "2"
   - **Creative**: Set to "0" or "1"
   - **Payload Configuration**:
     - `adpxfp`: Unique user fingerprint
     - `pubUserId`: Your publisher user ID
     - `placement`: Where the offer is shown (e.g., "checkout")

### 2. Load Offers

```csharp
using MomentsAPI;

public class MyScript : MonoBehaviour
{
    [SerializeField] private OfferManager offerManager;

    void Start()
    {
        // Load offers with configured settings
        offerManager.LoadOffers();
    }
}
```

### 3. Handle Offer Events

```csharp
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
        offerManager.OnLoadingStateChanged.AddListener(OnLoadingChanged);
    }

    void OnOffersLoaded(OfferResponse response)
    {
        if (response.HasOffers())
        {
            Debug.Log($"Loaded {response.data.offers.Count} offers");
            // Display your offers here
        }
    }

    void OnError(string error)
    {
        Debug.LogError($"Error: {error}");
    }

    void OnLoadingChanged(bool isLoading)
    {
        // Show/hide loading indicator
    }
}
```

## Architecture

### Core Components

#### 1. **OfferManager** (MonoBehaviour)
The main entry point for using these reusable classes. Attach this to a GameObject and configure it in the Inspector.

**Methods:**
- `LoadOffers()` - Load offers with configured settings
- `LoadOffersWithCustomPayload(Dictionary<string, string>)` - Load with custom payload
- `HandlePositiveAction(Offer, int, int, Action<bool>)` - Handle accept button (opens click_url, sends close beacon on last offer)
- `HandleNegativeAction(Offer, int, int, Action<bool>)` - Handle decline button (sends no_thanks_click beacon)
- `HandleCloseAction(Offer)` - Handle close button (sends close beacon)
- `HandleDisplayTracking(Offer)` - Send display tracking beacons (pixel and adv_pixel_url)
- `SendTrackingRequest(string)` - Send tracking request to custom URL

**Properties:**
- `IsLoading` - Check if offers are being loaded
- `CurrentOfferResponse` - Access the current offer data
- `ApiKey` - Get/set the API key

**Events:**
- `OnOffersLoaded` - Invoked when offers are loaded
- `OnError` - Invoked when an error occurs
- `OnLoadingStateChanged` - Invoked when loading state changes

#### 2. **OfferService** (Service Class)
Handles all network operations. You typically don't need to use this directly.

**Key Methods:**
- `LoadOffers()` - Coroutine to load offers from API
- `SendTrackingRequest()` - Coroutine to send tracking beacons

#### 3. **Data Models**

**Offer**
```csharp
public class Offer
{
    public string id;
    public string? title;
    public string? description;
    public string? image;
    public string? click_url;
    public string? cta_yes;
    public string? cta_no;
    public OfferBeacons? beacons;
    public string? pixel;
    public string? adv_pixel_url;
}
```

**OfferResponse**
```csharp
public class OfferResponse
{
    public OfferData? data;
    public string? error;
    
    public bool HasOffers();
    public bool HasError();
}
```

**OfferData**
```csharp
public class OfferData
{
    public List<Offer>? offers;
    public OfferStyles? styles;
    
    public bool HasOffers();
}
```

**OfferBeacons**
```csharp
public class OfferBeacons
{
    public string? close;              // Beacon URL fired when offer is closed
    public string? no_thanks_click;    // Beacon URL fired when user declines
}
```

**OfferStyles**
```csharp
public class OfferStyles
{
    public PopupStyles? popup;
    public OfferTextStyles? offerText;
    
    // Helper methods
    public string GetPopupBackground();
    public string GetTextColor();
    public string GetFontSize();
    public string GetButtonYesBackground();
    public string GetButtonYesColor();
    public string GetButtonNoBackground();
    public string GetButtonNoColor();
    // ... and more
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

#### 4. **UserAgentUtil** (Utility Class)
Provides platform-specific user agent strings.

```csharp
string userAgent = UserAgentUtil.GetUserAgent();
```

## Advanced Usage

### Custom Payload

```csharp
Dictionary<string, string> customPayload = new Dictionary<string, string>
{
    { "ua", UserAgentUtil.GetUserAgent() },
    { "adpx_fp", "unique_fingerprint" },
    { "pub_user_id", "user_12345" },
    { "placement", "checkout" }
};

offerManager.LoadOffersWithCustomPayload(customPayload);
```

### Handling User Actions

```csharp
// When user clicks accept button
void OnAcceptClicked()
{
    Offer currentOffer = GetCurrentOffer();
    int currentIndex = GetCurrentIndex();
    int totalOffers = GetTotalOffers();

    offerManager.HandlePositiveAction(currentOffer, currentIndex, totalOffers, (showNext) =>
    {
        if (showNext)
        {
            // Show next offer
            ShowNextOffer();
        }
        else
        {
            // Close offer panel (last offer)
            CloseOfferPanel();
        }
    });
}

// When user clicks decline button
void OnDeclineClicked()
{
    Offer currentOffer = GetCurrentOffer();
    int currentIndex = GetCurrentIndex();
    int totalOffers = GetTotalOffers();

    offerManager.HandleNegativeAction(currentOffer, currentIndex, totalOffers, (showNext) =>
    {
        if (showNext)
        {
            // Show next offer
            ShowNextOffer();
        }
        else
        {
            // Close offer panel (last offer)
            CloseOfferPanel();
        }
    });
}

// When user clicks close button
void OnCloseClicked()
{
    Offer currentOffer = GetCurrentOffer();
    offerManager.HandleCloseAction(currentOffer);
    CloseOfferPanel();
}
```

### Display Tracking

```csharp
void DisplayOffer(Offer offer)
{
    // Show offer UI
    ShowOfferUI(offer);
    
    // Send display tracking beacons
    offerManager.HandleDisplayTracking(offer);
}
```

### Applying Styles

```csharp
void ApplyStyles(OfferStyles styles)
{
    if (styles == null) return;

    // Apply background color
    string bgColor = styles.GetPopupBackground();
    if (ColorUtility.TryParseHtmlString(bgColor, out Color backgroundColor))
    {
        panelImage.color = backgroundColor;
    }

    // Apply text color
    string textColor = styles.GetTextColor();
    if (ColorUtility.TryParseHtmlString(textColor, out Color textColorValue))
    {
        titleText.color = textColorValue;
        descriptionText.color = textColorValue;
    }

    // Apply button colors
    string yesButtonBg = styles.GetButtonYesBackground();
    if (ColorUtility.TryParseHtmlString(yesButtonBg, out Color yesBgColor))
    {
        acceptButtonImage.color = yesBgColor;
    }
}
```

## Example Scene

Check out the `Examples/OfferUIExample.cs` script for a complete implementation showing:
- Loading offers
- Displaying offer content
- Handling user interactions
- Navigating through multiple offers
- Applying styles
- Sending tracking beacons

## API Reference

### OfferManager Configuration

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `apiKey` | string | Your Moments API key | Yes |
| `isDevelopmentMode` | bool | Enable development mode | No |
| `loyaltyBoost` | string | Loyalty boost (0, 1, or 2) | No |
| `creative` | string | Creative parameter (0 or 1) | No |
| `campaignId` | string | Campaign ID filter | No |
| `adpxfp` | string | Unique user fingerprint | Yes |
| `pubUserId` | string | Publisher user ID | Yes |
| `placement` | string | Placement identifier | Yes |

### Tracking Beacons

The implementation automatically handles tracking for:
- **Display**: Fired when offer is shown (`pixel`, `adv_pixel_url`)
- **Accept**: Fired when user accepts offer (opens `click_url`)
- **Decline**: Fired when user declines (`no_thanks_click`)
- **Close**: Fired when offer is closed (`close`)

## Best Practices

1. **API Key Security**: Store your API key securely, don't hardcode it in scripts
2. **Unique Identifiers**: Use unique values for `adpxfp` and `pubUserId`
3. **Error Handling**: Always subscribe to `OnError` event
4. **Loading States**: Show loading indicators using `OnLoadingStateChanged`
5. **Memory Management**: Unsubscribe from events in `OnDestroy()`
6. **Testing**: Use development mode during testing

## Troubleshooting

### Offers not loading
- Check your API key is correct
- Verify internet connection
- Check Unity console for error messages
- Enable development mode for detailed logs

### Tracking not working
- Ensure beacons are present in the offer data
- Check network requests in Unity console
- Verify URLs are valid

### Styling not applying
- Check if styles are present in the response
- Verify color format is valid hex (e.g., "#FFFFFF")
- Ensure UI components are properly referenced

## Platform-Specific Notes

### iOS
- Requires `NSAppTransportSecurity` configuration for HTTP requests
- Add to `Info.plist` if needed

### Android
- Requires `INTERNET` permission in manifest
- Unity adds this automatically

### WebGL
- CORS must be enabled on the API server
- Some tracking beacons may be blocked by browsers

## Requirements

- Unity 2019.4 or later
- .NET Standard 2.0 or .NET 4.x
- TextMeshPro (for UI examples)

## Support

For issues, questions, or feature requests, please email: help@momentscience.com

## License

These reusable classes are provided as-is for use with the Moments API service.

## Version

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Compatible with**: Moments API v4
