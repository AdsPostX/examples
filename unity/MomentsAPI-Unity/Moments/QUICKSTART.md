# Moments API Unity Reusable Classes - Quick Start

Get up and running with the Moments API in Unity in **5 minutes**!

## Step 1: Install (30 seconds)

Copy the `MomentsAPI` folder into your Unity project's `Assets` folder:

```
YourProject/
└── Assets/
    └── MomentsAPI/  ← Copy this folder here
```

## Step 2: Create Manager (1 minute)

1. In your Unity scene, create an empty GameObject
2. Name it "OfferManager"
3. Add the `OfferManager` component to it
4. In the Inspector, set:
   - **API Key**: Your Moments API key
   - **Development Mode**: ✓ (for testing)
   - **adpxfp**: "test_fingerprint_123"
   - **pubUserId**: "test_user_123"
   - **placement**: "checkout"

## Step 3: Create a Script (2 minutes)

Create a new script `MyOfferLoader.cs`:

```csharp
using UnityEngine;
using MomentsAPI;
using MomentsAPI.Models;

public class MyOfferLoader : MonoBehaviour
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
            Debug.Log($"✅ Loaded {response.data.offers.Count} offers!");
            
            // Display first offer
            Offer firstOffer = response.data.offers[0];
            Debug.Log($"Title: {firstOffer.title}");
            Debug.Log($"Description: {firstOffer.description}");
        }
    }

    void OnError(string error)
    {
        Debug.LogError($"❌ Error: {error}");
    }
}
```

## Step 4: Attach Script (30 seconds)

1. Create another empty GameObject (or use an existing one)
2. Add your `MyOfferLoader` script to it
3. In the Inspector, drag the OfferManager GameObject to the `offerManager` field

## Step 5: Test (30 seconds)

1. Press Play in Unity
2. Check the Console - you should see:
   ```
   ✅ Loaded X offers!
   Title: [Offer Title]
   Description: [Offer Description]
   ```

## Done! 🎉

You've successfully integrated the Moments API!

---

## Alternative: Try the Demo App

Want to see a working example first? Open the `MSAPIDemoApp` project:

1. Open Unity Hub
2. Add the `MSAPIDemoApp` folder as a project
3. Open `TestStartScene.unity`
4. Press Play and enter your API key
5. Explore the complete implementation!

**Demo includes:**
- API key input scene (`TestStartScene`)
- Offers display scene (`TestOffersScene`)
- Scene navigation
- Full error handling

---

## Next Steps

### Display Offers in UI

See the complete UI example:
- [OfferUIExample.cs](MomentsAPI/Examples/OfferUIExample.cs)

### Handle User Actions

```csharp
// User accepts offer
offerManager.HandlePositiveAction(offer, 0, 1, (showNext) =>
{
    Debug.Log(showNext ? "Show next offer" : "All done!");
});

// User declines offer
offerManager.HandleNegativeAction(offer, 0, 1, (showNext) =>
{
    Debug.Log(showNext ? "Show next offer" : "All done!");
});

// User closes offer
offerManager.HandleCloseAction(offer);
```

### Track Display

```csharp
// Send display tracking beacons
offerManager.HandleDisplayTracking(offer);
```

### Custom Payload

```csharp
Dictionary<string, string> payload = new Dictionary<string, string>
{
    { "ua", UserAgentUtil.GetUserAgent() },
    { "adpx_fp", "unique_fingerprint" },
    { "pub_user_id", "user_12345" },
    { "placement", "main_menu" },
    { "user_level", "5" }
};

offerManager.LoadOffersWithCustomPayload(payload);
```

---

## Common Issues

### "Type 'MomentsAPI' could not be found"
- Make sure the MomentsAPI folder is in your Assets folder
- Try reimporting: Right-click folder → Reimport

### "API Key cannot be empty"
- Set your API key in the OfferManager Inspector
- Or set it in code: `offerManager.ApiKey = "your_key";`

### No offers loading
- Check your internet connection
- Verify your API key is correct
- Check Unity Console for error messages

---

## Full Documentation

For complete documentation, see:
- [README.md](MomentsAPI/README.md) - Complete API reference
- [INSTALLATION.md](INSTALLATION.md) - Detailed installation guide
- [OVERVIEW.md](OVERVIEW.md) - Architecture and design

---

## Example Projects

Check out the example scripts:
- **OfferUIExample.cs** - Full UI implementation with buttons, images, and styling
- **ProgrammaticExample.cs** - Runtime configuration and dynamic usage

---

## Support

Need help? 
- Check the [README.md](MomentsAPI/README.md) for detailed documentation
- Review the example scripts
- Email: help@momentscience.com

---

**Happy coding! 🚀**
