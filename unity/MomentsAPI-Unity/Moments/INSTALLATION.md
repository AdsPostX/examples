# Moments API Unity Reusable Classes - Installation Guide

This guide will help you integrate the Moments API reusable classes into your Unity project.

## Quick Installation (Drag & Drop)

The easiest way to use these reusable classes is to simply drag and drop them into your Unity project:

1. **Locate the MomentsAPI folder**
   - Path: `Moments/MomentsAPI/`

2. **Copy to your Unity project**
   - Drag the entire `MomentsAPI` folder into your Unity project's `Assets` folder
   - Or copy it manually: `Assets/MomentsAPI/`

3. **Verify installation**
   - In Unity, check that the following folders exist:
     ```
     Assets/
     └── MomentsAPI/
         ├── Models/
         ├── Services/
         ├── Utils/
         ├── Examples/
         ├── OfferManager.cs
         ├── README.md
         └── package.json
     ```

4. **Done!**
   - The reusable classes are now ready to use
   - No additional setup or dependencies required

## File Structure

```
MomentsAPI/
├── Models/                      # Data models
│   ├── Offer.cs                # Single offer model
│   ├── OfferBeacons.cs         # Tracking beacons
│   ├── OfferResponse.cs        # API response models
│   └── OfferStyles.cs          # Styling configuration
├── Services/                    # Core services
│   └── OfferService.cs         # API communication service
├── Utils/                       # Utility classes
│   └── UserAgentUtil.cs        # Platform user agents
├── Examples/                    # Example scripts
│   ├── OfferUIExample.cs       # Full UI example
│   └── ProgrammaticExample.cs  # Programmatic usage
├── OfferManager.cs             # Main MonoBehaviour manager
├── README.md                    # Complete documentation
└── package.json                 # Package metadata
```

## What's Included

### Core Components
- **OfferManager**: Main MonoBehaviour for managing offers
- **OfferService**: Handles all API communication
- **Data Models**: Type-safe models for API responses
- **UserAgentUtil**: Platform-specific user agent strings

### Examples
- **OfferUIExample**: Complete UI implementation example
- **ProgrammaticExample**: Runtime configuration example

### Documentation
- **README.md**: Comprehensive API documentation
- **XML Comments**: IntelliSense documentation in all classes

## Requirements

- **Unity Version**: 2019.4 or later
- **.NET Version**: .NET Standard 2.0 or .NET 4.x
- **Dependencies**: None (uses Unity's built-in networking)

## Optional Dependencies

For the UI example (`OfferUIExample.cs`):
- **TextMeshPro**: For text rendering (usually included by default)
- **Unity UI**: For UI components (included by default)

If you don't have TextMeshPro:
1. Go to `Window > TextMeshPro > Import TMP Essential Resources`
2. Click Import

## Next Steps

After installation, follow these steps:

### 1. Create an OfferManager GameObject

```
1. In your Unity scene, create an empty GameObject
2. Name it "OfferManager"
3. Add the OfferManager component to it
4. Configure the settings in the Inspector
```

### 2. Configure API Settings

In the Inspector, set:
- **API Key**: Your Moments API key
- **Development Mode**: Enable for testing
- **Loyalty Boost**: Set to "0", "1", or "2" (optional)
- **Creative**: Set to "0" or "1" (optional)
- **Campaign ID**: Campaign identifier (optional)
- **Payload Configuration**:
  - `adpxfp`: Unique user identifier
  - `pubUserId`: Your publisher user ID
  - `placement`: Where offers are shown

### 3. Load Offers

Create a script to load offers:

```csharp
using UnityEngine;
using MomentsAPI;

public class MyOfferLoader : MonoBehaviour
{
    [SerializeField] private OfferManager offerManager;

    void Start()
    {
        offerManager.LoadOffers();
    }
}
```

### 4. Handle Events

Subscribe to offer events:

```csharp
void Start()
{
    offerManager.OnOffersLoaded.AddListener(OnOffersLoaded);
    offerManager.OnError.AddListener(OnError);
}

void OnOffersLoaded(OfferResponse response)
{
    Debug.Log($"Loaded {response.data.offers.Count} offers");
}

void OnError(string error)
{
    Debug.LogError($"Error: {error}");
}
```

## Testing the Installation

To verify everything is working:

1. **Check for compilation errors**
   - Open Unity and check the Console
   - There should be no errors

2. **Run the programmatic example**
   - Create an empty GameObject
   - Add `ProgrammaticExample.cs` to it
   - Set your API key in the script
   - Press Play and check the Console logs

3. **Test API connectivity**
   - Create an OfferManager GameObject
   - Configure your API key
   - Call `LoadOffers()` from another script
   - Check Console for success/error messages

## Using the Demo Application

The `MSAPIDemoApp` folder contains a complete demo project:

### Opening the Demo
1. Open Unity Hub
2. Click "Add" and select the `MSAPIDemoApp` folder
3. Open the project in Unity

### Running the Demo
1. In Unity, navigate to `Assets/Scenes/`
2. Open `TestStartScene.unity`
3. Press Play
4. Enter your API key in the input field
5. Click Submit
6. The app will navigate to `TestOffersScene` and display offers
7. Use the Home button to return to the start scene

### Demo Scenes Overview
- **TestStartScene** - Entry point for API key input
- **TestOffersScene** - Main offers display with full UI
- **DemoScene** - Additional demo scene

### Demo Scripts Location
All demo scripts are in `Assets/Scripts/`:
- `TestStart.cs` - API key input handler
- `TestOfferUIExample.cs` - Enhanced UI example

## Troubleshooting

### "Type or namespace 'MomentsAPI' could not be found"
- Ensure the MomentsAPI folder is in your Assets folder
- Check that all .cs files are present
- Try reimporting: Right-click folder > Reimport

### "UnityWebRequest could not be found"
- Your Unity version might be too old
- Update to Unity 2019.4 or later

### API calls failing
- Check your API key is correct
- Verify internet connection
- Enable Development Mode for detailed logs
- Check Unity Console for error messages

### UI Example not working
- Ensure TextMeshPro is imported
- Check all UI references are assigned in Inspector
- Verify UI Canvas is set up correctly

## Platform-Specific Setup

### iOS
No additional setup required. The reusable classes handle iOS automatically.

### Android
No additional setup required. Unity adds INTERNET permission automatically.

### WebGL
No additional setup required. Ensure your API server has CORS enabled.

## Upgrading

To upgrade to a new version:

1. **Backup your project** (or use version control)
2. **Delete the old MomentsAPI folder** from Assets
3. **Copy the new MomentsAPI folder** into Assets
4. **Check for breaking changes** in the README
5. **Test your integration** to ensure everything works

## Support

For help with installation or usage:
- Check the main README.md for detailed documentation
- Review the example scripts in the Examples folder
- Try the demo application in MSAPIDemoApp folder
- Email: help@momentscience.com

## License

These reusable classes are provided for use with the Moments API service.

---

**Ready to start?** Check out the [README.md](MomentsAPI/README.md) for complete API documentation and usage examples!
