using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using MomentsAPI;
using MomentsAPI.Models;
using MomentsAPI.Utils;

namespace MomentsAPI.Examples
{
    /// <summary>
    /// Example script demonstrating how to use the OfferManager to display offers in Unity UI.
    /// This script shows how to:
    /// - Load offers from the API
    /// - Display offer content (title, description, image)
    /// - Handle user interactions (accept, decline, close)
    /// - Navigate through multiple offers
    /// - Send tracking beacons
    /// </summary>
    public class OfferUIExample : MonoBehaviour
    {
        [Header("References")]
        [SerializeField] private OfferManager offerManager;
        [SerializeField] private GameObject offerPanel;
        [SerializeField] private TextMeshProUGUI titleText;
        [SerializeField] private TextMeshProUGUI descriptionText;
        [SerializeField] private Image offerImage;
        [SerializeField] private Button acceptButton;
        [SerializeField] private Button declineButton;
        [SerializeField] private Button closeButton;
        [SerializeField] private TextMeshProUGUI acceptButtonText;
        [SerializeField] private TextMeshProUGUI declineButtonText;
        [SerializeField] private GameObject loadingPanel;
        [SerializeField] private GameObject errorPanel;
        [SerializeField] private TextMeshProUGUI errorText;

        private int currentOfferIndex = 0;
        private OfferResponse currentResponse;

        private void Start()
        {
            // Hide offer panel initially
            offerPanel.SetActive(false);
            loadingPanel.SetActive(false);
            if (errorPanel != null)
                errorPanel.SetActive(false);

            // Setup button listeners
            acceptButton.onClick.AddListener(OnAcceptClicked);
            declineButton.onClick.AddListener(OnDeclineClicked);
            closeButton.onClick.AddListener(OnCloseClicked);

            // Subscribe to OfferManager events
            offerManager.OnOffersLoaded.AddListener(OnOffersLoaded);
            offerManager.OnError.AddListener(OnError);
            offerManager.OnLoadingStateChanged.AddListener(OnLoadingStateChanged);

            // Load offers automatically
            LoadAndShowOffers();
        }

        /// <summary>
        /// Call this method to load and display offers.
        /// You can call this from a button click, on scene start, or any other trigger.
        /// </summary>
        public void LoadAndShowOffers()
        {
            currentOfferIndex = 0;
            Dictionary<string, string> customPayload = new Dictionary<string, string>
{
    { "ua", UserAgentUtil.GetUserAgent() },
    { "adpx_fp", "unique_fingerprint" },
    { "pub_user_id", "user_12345" },
    { "placement", "checkout" }
};

            offerManager.LoadOffersWithCustomPayload(customPayload);
        }

        private void OnOffersLoaded(OfferResponse response)
        {
            currentResponse = response;

            if (response.HasOffers())
            {
                currentOfferIndex = 0;
                DisplayCurrentOffer();
            }
            else if (response.HasError())
            {
                ShowError(response.error);
            }
            else
            {
                ShowError("No offers available");
            }
        }

        private void OnError(string errorMessage)
        {
            ShowError(errorMessage);
        }

        private void OnLoadingStateChanged(bool isLoading)
        {
            loadingPanel.SetActive(isLoading);
        }

        private void DisplayCurrentOffer()
        {
            if (currentResponse?.data?.offers == null || currentOfferIndex >= currentResponse.data.offers.Count)
            {
                offerPanel.SetActive(false);
                return;
            }

            Offer currentOffer = currentResponse.data.offers[currentOfferIndex];

            // Hide loading panel and error panel, show offer panel
            loadingPanel.SetActive(false);
            offerPanel.SetActive(true);
            if (errorPanel != null)
                errorPanel.SetActive(false);

            // Set offer content
            titleText.text = currentOffer.title ?? "Special Offer";
            descriptionText.text = currentOffer.description ?? "";

            // Set button labels
            acceptButtonText.text = currentOffer.cta_yes ?? "Accept";
            declineButtonText.text = currentOffer.cta_no ?? "No Thanks";

            // Load and display image
            if (!string.IsNullOrEmpty(currentOffer.image))
            {
                StartCoroutine(LoadImage(currentOffer.image));
            }

            // Apply styles if available
            ApplyStyles(currentResponse.data.styles);

            // Send display tracking
            offerManager.HandleDisplayTracking(currentOffer);
        }

        private void ApplyStyles(OfferStyles styles)
        {
            // Apply text color with fallback to black (#000000)
            string textColor = styles?.GetTextColor() ?? "#000000";
            Color titleColor = ParseColor(textColor, Color.black);
            Color descriptionColor = ParseColor(textColor, Color.black);
            titleText.color = titleColor;
            descriptionText.color = descriptionColor;

            // Apply popup background color
            string bgColor = styles?.GetPopupBackground() ?? "#FFFFFF";
            Color backgroundColor = ParseColor(bgColor, Color.white);
            Image panelImage = offerPanel.GetComponent<Image>();
            if (panelImage != null)
                panelImage.color = backgroundColor;

            // Apply positive button (accept) colors with fallback
            string yesButtonBg = styles?.GetButtonYesBackground() ?? "#1C64F2";
            Color positiveBgColor = ParseColor(yesButtonBg, new Color(0x1C / 255f, 0x64 / 255f, 0xF2 / 255f));
            Image acceptButtonImage = acceptButton.GetComponent<Image>();
            if (acceptButtonImage != null)
                acceptButtonImage.color = positiveBgColor;

            string yesButtonColor = styles?.GetButtonYesColor() ?? "#FFFFFF";
            Color positiveTextColor = ParseColor(yesButtonColor, Color.white);
            acceptButtonText.color = positiveTextColor;

            // Apply negative button (decline) colors with fallback
            string noButtonBg = styles?.GetButtonNoBackground() ?? "#FFFFFF";
            Color negativeBgColor = ParseColor(noButtonBg, Color.white);
            Image declineButtonImage = declineButton.GetComponent<Image>();
            if (declineButtonImage != null)
                declineButtonImage.color = negativeBgColor;

            string noButtonColor = styles?.GetButtonNoColor() ?? "#6B7280";
            Color negativeTextColor = ParseColor(noButtonColor, new Color(0x6B / 255f, 0x72 / 255f, 0x80 / 255f));
            declineButtonText.color = negativeTextColor;
        }

        private Color ParseColor(string colorString, Color fallbackColor)
        {
            if (string.IsNullOrEmpty(colorString))
                return fallbackColor;

            if (ColorUtility.TryParseHtmlString(colorString, out Color parsedColor))
                return parsedColor;

            return fallbackColor;
        }

        private System.Collections.IEnumerator LoadImage(string imageUrl)
        {
            using (UnityEngine.Networking.UnityWebRequest request = UnityEngine.Networking.UnityWebRequestTexture.GetTexture(imageUrl))
            {
                yield return request.SendWebRequest();

                if (request.result == UnityEngine.Networking.UnityWebRequest.Result.Success)
                {
                    Texture2D texture = UnityEngine.Networking.DownloadHandlerTexture.GetContent(request);
                    offerImage.sprite = Sprite.Create(
                        texture,
                        new Rect(0, 0, texture.width, texture.height),
                        new Vector2(0.5f, 0.5f)
                    );
                    offerImage.gameObject.SetActive(true);
                }
                else
                {
                    Debug.LogWarning($"Failed to load image: {imageUrl}");
                    offerImage.gameObject.SetActive(false);
                }
            }
        }

        private void OnAcceptClicked()
        {
            if (currentResponse?.data?.offers == null || currentOfferIndex >= currentResponse.data.offers.Count)
                return;

            Offer currentOffer = currentResponse.data.offers[currentOfferIndex];
            int totalOffers = currentResponse.data.offers.Count;

            offerManager.HandlePositiveAction(currentOffer, currentOfferIndex, totalOffers, (showNextOffer) =>
            {
                if (showNextOffer)
                {
                    currentOfferIndex++;
                    DisplayCurrentOffer();
                }
                else
                {
                    CloseOfferPanel();
                }
            });
        }

        private void OnDeclineClicked()
        {
            if (currentResponse?.data?.offers == null || currentOfferIndex >= currentResponse.data.offers.Count)
                return;

            Offer currentOffer = currentResponse.data.offers[currentOfferIndex];
            int totalOffers = currentResponse.data.offers.Count;

            offerManager.HandleNegativeAction(currentOffer, currentOfferIndex, totalOffers, (showNextOffer) =>
            {
                if (showNextOffer)
                {
                    currentOfferIndex++;
                    DisplayCurrentOffer();
                }
                else
                {
                    CloseOfferPanel();
                }
            });
        }

        private void OnCloseClicked()
        {
            if (currentResponse?.data?.offers != null && currentOfferIndex < currentResponse.data.offers.Count)
            {
                Offer currentOffer = currentResponse.data.offers[currentOfferIndex];
                offerManager.HandleCloseAction(currentOffer);
            }

            CloseOfferPanel();
        }

        private void CloseOfferPanel()
        {
            offerPanel.SetActive(false);
            currentOfferIndex = 0;
        }

        private void ShowError(string message)
        {
            loadingPanel.SetActive(false);
            offerPanel.SetActive(false);
            if (errorPanel != null)
            {
                errorText.text = message;
                errorPanel.SetActive(true);
            }
        }

        private void OnDestroy()
        {
            // Unsubscribe from events
            if (offerManager != null)
            {
                offerManager.OnOffersLoaded.RemoveListener(OnOffersLoaded);
                offerManager.OnError.RemoveListener(OnError);
                offerManager.OnLoadingStateChanged.RemoveListener(OnLoadingStateChanged);
            }

            // Remove button listeners
            acceptButton.onClick.RemoveListener(OnAcceptClicked);
            declineButton.onClick.RemoveListener(OnDeclineClicked);
            closeButton.onClick.RemoveListener(OnCloseClicked);
        }
    }
}
