using System.Collections.Generic;
using UnityEngine;
using MomentsAPI;
using MomentsAPI.Models;
using MomentsAPI.Utils;

namespace MomentsAPI.Examples
{
    /// <summary>
    /// Example demonstrating programmatic usage of the OfferManager without Inspector configuration.
    /// This approach is useful when you need to configure the reusable classes dynamically at runtime.
    /// </summary>
    public class ProgrammaticExample : MonoBehaviour
    {
        private OfferManager offerManager;

        void Start()
        {
            // Create OfferManager at runtime
            GameObject managerObject = new GameObject("OfferManager");
            offerManager = managerObject.AddComponent<OfferManager>();

            // Configure API key programmatically
            offerManager.ApiKey = "YOUR_API_KEY_HERE";

            // Subscribe to events
            offerManager.OnOffersLoaded.AddListener(OnOffersLoaded);
            offerManager.OnError.AddListener(OnError);
            offerManager.OnLoadingStateChanged.AddListener(OnLoadingStateChanged);

            // Load offers with custom payload
            LoadOffersWithCustomConfiguration();
        }

        void LoadOffersWithCustomConfiguration()
        {
            // Build custom payload
            Dictionary<string, string> payload = new Dictionary<string, string>
            {
                { "ua", UserAgentUtil.GetUserAgent() },
                { "adpx_fp", GenerateUniqueFingerprint() },
                { "pub_user_id", GetCurrentUserId() },
                { "placement", "main_menu" },
                { "user_level", GetUserLevel().ToString() },
                { "session_id", GetSessionId() }
            };

            // Load offers
            offerManager.LoadOffersWithCustomPayload(payload);
        }

        void OnOffersLoaded(OfferResponse response)
        {
            Debug.Log("=== Offers Loaded ===");

            if (response.HasError())
            {
                Debug.LogError($"API Error: {response.error}");
                return;
            }

            if (!response.HasOffers())
            {
                Debug.Log("No offers available");
                return;
            }

            // Log offer details
            Debug.Log($"Total Offers: {response.data.offers.Count}");

            for (int i = 0; i < response.data.offers.Count; i++)
            {
                Offer offer = response.data.offers[i];
                Debug.Log($"\n--- Offer {i + 1} ---");
                Debug.Log($"ID: {offer.id}");
                Debug.Log($"Title: {offer.title}");
                Debug.Log($"Description: {offer.description}");
                Debug.Log($"Image: {offer.image}");
                Debug.Log($"Click URL: {offer.click_url}");
                Debug.Log($"CTA Yes: {offer.cta_yes}");
                Debug.Log($"CTA No: {offer.cta_no}");
            }

            // Log style information
            if (response.data.styles != null)
            {
                Debug.Log("\n=== Styles ===");
                Debug.Log($"Popup Background: {response.data.styles.GetPopupBackground()}");
                Debug.Log($"Text Color: {response.data.styles.GetTextColor()}");
                Debug.Log($"Button Yes BG: {response.data.styles.GetButtonYesBackground()}");
                Debug.Log($"Button No BG: {response.data.styles.GetButtonNoBackground()}");
            }

            // Example: Automatically show first offer
            if (response.data.offers.Count > 0)
            {
                ShowOffer(response.data.offers[0], 0, response.data.offers.Count);
            }
        }

        void OnError(string error)
        {
            Debug.LogError($"OfferManager Error: {error}");
        }

        void OnLoadingStateChanged(bool isLoading)
        {
            Debug.Log($"Loading: {isLoading}");
        }

        void ShowOffer(Offer offer, int index, int total)
        {
            Debug.Log($"\n=== Showing Offer {index + 1}/{total} ===");
            
            // Send display tracking
            offerManager.HandleDisplayTracking(offer);

            // In a real implementation, you would display the offer UI here
            // For this example, we'll simulate user interaction after 3 seconds
            StartCoroutine(SimulateUserInteraction(offer, index, total));
        }

        System.Collections.IEnumerator SimulateUserInteraction(Offer offer, int index, int total)
        {
            // Wait 3 seconds
            yield return new WaitForSeconds(3f);

            // Simulate user accepting the offer (50% chance) or declining (50% chance)
            bool userAccepts = Random.value > 0.5f;

            if (userAccepts)
            {
                Debug.Log("User accepted the offer");
                offerManager.HandlePositiveAction(offer, index, total, (showNext) =>
                {
                    if (showNext)
                    {
                        Debug.Log("Moving to next offer...");
                        // In real implementation, show next offer
                    }
                    else
                    {
                        Debug.Log("No more offers, closing...");
                    }
                });
            }
            else
            {
                Debug.Log("User declined the offer");
                offerManager.HandleNegativeAction(offer, index, total, (showNext) =>
                {
                    if (showNext)
                    {
                        Debug.Log("Moving to next offer...");
                        // In real implementation, show next offer
                    }
                    else
                    {
                        Debug.Log("No more offers, closing...");
                    }
                });
            }
        }

        // Helper methods - implement these based on your app's needs

        string GenerateUniqueFingerprint()
        {
            // Generate a unique fingerprint for the user/device
            // In production, use a persistent identifier
            return SystemInfo.deviceUniqueIdentifier;
        }

        string GetCurrentUserId()
        {
            // Return your app's user ID
            // In production, get this from your user management system
            return "user_" + SystemInfo.deviceUniqueIdentifier.Substring(0, 8);
        }

        int GetUserLevel()
        {
            // Return user's level or progress
            // In production, get this from your game state
            return PlayerPrefs.GetInt("UserLevel", 1);
        }

        string GetSessionId()
        {
            // Generate or retrieve session ID
            // In production, create this when app starts
            return System.Guid.NewGuid().ToString();
        }

        void OnDestroy()
        {
            // Clean up event listeners
            if (offerManager != null)
            {
                offerManager.OnOffersLoaded.RemoveListener(OnOffersLoaded);
                offerManager.OnError.RemoveListener(OnError);
                offerManager.OnLoadingStateChanged.RemoveListener(OnLoadingStateChanged);
            }
        }
    }
}
