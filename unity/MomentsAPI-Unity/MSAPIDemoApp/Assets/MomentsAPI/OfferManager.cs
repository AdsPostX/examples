using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using MomentsAPI.Models;
using MomentsAPI.Services;
using MomentsAPI.Utils;

namespace MomentsAPI
{
    /// <summary>
    /// MonoBehaviour manager for handling offer-related business logic and state in Unity.
    /// Handles loading offers from the API, tracking user actions (accept, decline, close),
    /// and firing tracking beacons. This is the main entry point for using the Moments API in Unity.
    /// Simply attach this script to a GameObject and configure it in the Inspector.
    /// </summary>
    public class OfferManager : MonoBehaviour
    {
        #region Inspector Fields

        [Header("API Configuration")]
        [Tooltip("Your Moments API key")]
        [SerializeField] private string apiKey = "";

        [Tooltip("Enable development mode")]
        [SerializeField] private bool isDevelopmentMode = false;

        [Tooltip("Loyalty boost parameter (0, 1, or 2)")]
        [SerializeField] private string loyaltyBoost = "0";

        [Tooltip("Creative parameter (0 or 1)")]
        [SerializeField] private string creative = "0";

        [Tooltip("Campaign ID (optional)")]
        [SerializeField] private string campaignId = "";

        [Header("Payload Configuration")]
        [Tooltip("Unique fingerprint for the user")]
        [SerializeField] private string adpxfp = "";

        [Tooltip("Publisher user ID")]
        [SerializeField] private string pubUserId = "";

        [Tooltip("Placement identifier (e.g., 'checkout', 'homepage')")]
        [SerializeField] private string placement = "checkout";

        [Header("Events")]
        [Tooltip("Invoked when offers are successfully loaded")]
        public UnityEvent<OfferResponse> OnOffersLoaded;

        [Tooltip("Invoked when an error occurs")]
        public UnityEvent<string> OnError;

        [Tooltip("Invoked when loading state changes")]
        public UnityEvent<bool> OnLoadingStateChanged;

        #endregion

        #region Private Fields

        private OfferService _offerService;
        private OfferResponse _currentOfferResponse;
        private bool _isLoading = false;

        #endregion

        #region Properties

        /// <summary>
        /// Gets whether offers are currently being loaded.
        /// </summary>
        public bool IsLoading => _isLoading;

        /// <summary>
        /// Gets the current offer response data.
        /// </summary>
        public OfferResponse CurrentOfferResponse => _currentOfferResponse;

        /// <summary>
        /// Gets or sets the API key.
        /// </summary>
        public string ApiKey
        {
            get => apiKey;
            set => apiKey = value;
        }

        /// <summary>
        /// Gets or sets the development mode.
        /// </summary>
        public bool IsDevelopmentMode
        {
            get => isDevelopmentMode;
            set => isDevelopmentMode = value;
        }

        #endregion

        #region Unity Lifecycle

        private void Awake()
        {
            _offerService = new OfferService();
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Loads offers from the API using the configured parameters.
        /// You can call this method directly or use LoadOffersWithCustomPayload for more control.
        /// </summary>
        public void LoadOffers()
        {
            Dictionary<string, string> payload = new Dictionary<string, string>
            {
                { "ua", UserAgentUtil.GetUserAgent() },
                { "adpx_fp", adpxfp },
                { "pub_user_id", pubUserId },
                { "placement", placement }
            };

            LoadOffersWithCustomPayload(payload);
        }

        /// <summary>
        /// Loads offers from the API with a custom payload.
        /// </summary>
        /// <param name="customPayload">Custom payload dictionary to send with the request.</param>
        public void LoadOffersWithCustomPayload(Dictionary<string, string> customPayload)
        {
            if (_isLoading)
            {
                Debug.LogWarning("Offers are already being loaded. Please wait.");
                return;
            }

            StartCoroutine(LoadOffersCoroutine(customPayload));
        }

        /// <summary>
        /// Handles the positive action for an offer (e.g., accepting an offer).
        /// Opens the offer's click URL if available, and sends a close beacon if this is the last offer.
        /// </summary>
        /// <param name="offer">The current offer object.</param>
        /// <param name="currentIndex">The index of the current offer.</param>
        /// <param name="totalOffers">The total number of offers.</param>
        /// <param name="onComplete">Callback with boolean indicating if next offer should be shown.</param>
        public void HandlePositiveAction(Offer offer, int currentIndex, int totalOffers, Action<bool> onComplete = null)
        {
            StartCoroutine(HandlePositiveActionCoroutine(offer, currentIndex, totalOffers, onComplete));
        }

        /// <summary>
        /// Handles the negative action for an offer (e.g., declining an offer).
        /// Sends a 'no_thanks_click' beacon if available, and a close beacon if this is the last offer.
        /// </summary>
        /// <param name="offer">The current offer object.</param>
        /// <param name="currentIndex">The index of the current offer.</param>
        /// <param name="totalOffers">The total number of offers.</param>
        /// <param name="onComplete">Callback with boolean indicating if next offer should be shown.</param>
        public void HandleNegativeAction(Offer offer, int currentIndex, int totalOffers, Action<bool> onComplete = null)
        {
            StartCoroutine(HandleNegativeActionCoroutine(offer, currentIndex, totalOffers, onComplete));
        }

        /// <summary>
        /// Handles the close action for an offer page.
        /// Sends a close beacon if available.
        /// </summary>
        /// <param name="offer">The current offer object.</param>
        public void HandleCloseAction(Offer offer)
        {
            StartCoroutine(HandleCloseActionCoroutine(offer));
        }

        /// <summary>
        /// Sends initial display tracking requests for an offer.
        /// Fires both 'pixel' and 'adv_pixel_url' beacons.
        /// </summary>
        /// <param name="offer">The current offer object.</param>
        public void HandleDisplayTracking(Offer offer)
        {
            StartCoroutine(HandleDisplayTrackingCoroutine(offer));
        }

        /// <summary>
        /// Sends a tracking request to the specified URL.
        /// </summary>
        /// <param name="url">The URL to send the tracking request to.</param>
        public void SendTrackingRequest(string url)
        {
            if (!string.IsNullOrEmpty(url))
            {
                StartCoroutine(_offerService.SendTrackingRequest(url));
            }
        }

        #endregion

        #region Private Coroutines

        private IEnumerator LoadOffersCoroutine(Dictionary<string, string> payload)
        {
            _isLoading = true;
            OnLoadingStateChanged?.Invoke(true);

            yield return _offerService.LoadOffers(
                apiKey: apiKey,
                loyaltyBoost: string.IsNullOrEmpty(loyaltyBoost) || loyaltyBoost == "0" ? null : loyaltyBoost,
                creative: string.IsNullOrEmpty(creative) || creative == "0" ? null : creative,
                campaignId: campaignId,
                isDevelopment: isDevelopmentMode,
                payload: payload,
                onSuccess: (response) =>
                {
                    _currentOfferResponse = response;
                    OnOffersLoaded?.Invoke(response);
                    Debug.Log($"Successfully loaded {response.data?.offers?.Count ?? 0} offers");
                },
                onError: (error) =>
                {
                    OnError?.Invoke(error);
                    Debug.LogError($"Error loading offers: {error}");
                }
            );

            _isLoading = false;
            OnLoadingStateChanged?.Invoke(false);
        }

        private IEnumerator HandlePositiveActionCoroutine(Offer offer, int currentIndex, int totalOffers, Action<bool> onComplete)
        {
            // Open the click_url in external browser if available
            if (!string.IsNullOrEmpty(offer.click_url))
            {
                Application.OpenURL(offer.click_url);
            }

            // If this is the last offer, send the close beacon (fire-and-forget, don't wait)
            if (currentIndex >= totalOffers - 1)
            {
                string closeBeacon = offer.beacons?.close;
                if (!string.IsNullOrEmpty(closeBeacon))
                {
                    StartCoroutine(_offerService.SendTrackingRequest(closeBeacon));
                }
            }

            // Return whether to move to next offer (true) or close page (false) - immediately
            bool showNextOffer = currentIndex < totalOffers - 1;
            onComplete?.Invoke(showNextOffer);
            yield break;
        }

        private IEnumerator HandleNegativeActionCoroutine(Offer offer, int currentIndex, int totalOffers, Action<bool> onComplete)
        {
            // Send request for no_thanks_click beacon (fire-and-forget, don't wait)
            string noThanksBeacon = offer.beacons?.no_thanks_click;
            if (!string.IsNullOrEmpty(noThanksBeacon))
            {
                StartCoroutine(_offerService.SendTrackingRequest(noThanksBeacon));
            }

            // If this is the last offer, send the close beacon (fire-and-forget, don't wait)
            if (currentIndex >= totalOffers - 1)
            {
                string closeBeacon = offer.beacons?.close;
                if (!string.IsNullOrEmpty(closeBeacon))
                {
                    StartCoroutine(_offerService.SendTrackingRequest(closeBeacon));
                }
            }

            // Return whether to move to next offer (true) or close page (false) - immediately
            bool showNextOffer = currentIndex < totalOffers - 1;
            onComplete?.Invoke(showNextOffer);
            yield break;
        }

        private IEnumerator HandleCloseActionCoroutine(Offer offer)
        {
            // Send request for close beacon
            string closeBeacon = offer.beacons?.close;
            if (!string.IsNullOrEmpty(closeBeacon))
            {
                yield return _offerService.SendTrackingRequest(closeBeacon);
            }
        }

        private IEnumerator HandleDisplayTrackingCoroutine(Offer offer)
        {
            // Send request for pixel
            if (!string.IsNullOrEmpty(offer.pixel))
            {
                yield return _offerService.SendTrackingRequest(offer.pixel);
            }

            // Send request for adv_pixel_url
            if (!string.IsNullOrEmpty(offer.adv_pixel_url))
            {
                yield return _offerService.SendTrackingRequest(offer.adv_pixel_url);
            }
        }

        #endregion
    }
}
