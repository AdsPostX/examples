using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
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
    public class TestOfferUIExample : MonoBehaviour
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

        [Header("Navigation")]
        [SerializeField] private Button homeButton;
        [SerializeField] private string startSceneName = "TestStart";

        private int currentOfferIndex = 0;
        private OfferResponse currentResponse;

        private void Start()
        {
            // Validate critical references
            if (offerManager == null)
            {
                Debug.LogError("OfferManager is not assigned! Please assign it in the Inspector.");
                return;
            }

            if (offerPanel == null)
            {
                Debug.LogError("OfferPanel is not assigned! Please assign it in the Inspector.");
                return;
            }

            if (acceptButton == null || declineButton == null)
            {
                Debug.LogError("Accept or Decline button is not assigned! Please assign them in the Inspector.");
                return;
            }

            if (titleText == null || descriptionText == null)
            {
                Debug.LogError("Title or Description text is not assigned! Please assign them in the Inspector.");
                return;
            }

            if (acceptButtonText == null || declineButtonText == null)
            {
                Debug.LogError("Button texts are not assigned! Please assign them in the Inspector.");
                return;
            }

            // Hide offer panel initially
            offerPanel.SetActive(false);
            
            if (loadingPanel != null)
            loadingPanel.SetActive(false);
            
            if (errorPanel != null)
                errorPanel.SetActive(false);

            // Setup button listeners
            acceptButton.onClick.AddListener(OnAcceptClicked);
            declineButton.onClick.AddListener(OnDeclineClicked);
            
            if (closeButton != null)
            closeButton.onClick.AddListener(OnCloseClicked);
            
            // Setup home button listener if assigned
            if (homeButton != null)
                homeButton.onClick.AddListener(OnHomeClicked);

            // Subscribe to OfferManager events
            offerManager.OnOffersLoaded.AddListener(OnOffersLoaded);
            offerManager.OnError.AddListener(OnError);
            offerManager.OnLoadingStateChanged.AddListener(OnLoadingStateChanged);

            // Get API key from PlayerPrefs and set it on OfferManager
            string apiKey = PlayerPrefs.GetString("APIKey", "");
            if (!string.IsNullOrEmpty(apiKey))
            {
                offerManager.ApiKey = apiKey;
                Debug.Log($"Using API Key from PlayerPrefs: {apiKey}");
            }
            else
            {
                Debug.LogWarning("No API Key found in PlayerPrefs. Using OfferManager's configured API key.");
            }

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

            // Check if dev mode is enabled and set it on OfferManager
            int devMode = PlayerPrefs.GetInt("DevMode", 0);
            offerManager.IsDevelopmentMode = (devMode == 1);
            Debug.Log($"Dev Mode: {offerManager.IsDevelopmentMode}");

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
            // Check if it's an invalid API key error
            if (errorMessage.Contains("Invalid API Key") || errorMessage.Contains("invalid api key") || 
                errorMessage.Contains("API key") || errorMessage.Contains("Unauthorized"))
            {
                // Set the flag to disable panel in TestStartScene
                TestStart.InvalidAPIKeyDetected = true;
                
                // Navigate back to start scene
                Debug.LogError($"Invalid API Key detected: {errorMessage}");
                OnHomeClicked();
                return;
            }
            
            ShowError(errorMessage);
        }

        private void OnLoadingStateChanged(bool isLoading)
        {
            if (loadingPanel != null)
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
            if (loadingPanel != null)
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

            // Hide image initially
            if (offerImage != null)
                offerImage.gameObject.SetActive(false);

            // Load and display image if available
            if (!string.IsNullOrEmpty(currentOffer.image))
            {
                StartCoroutine(LoadImage(currentOffer.image));
            }

            // Apply styles if available
            ApplyStyles(currentResponse.data.styles);

            // Send display tracking
            offerManager.HandleDisplayTracking(currentOffer);

            // Force layout rebuild to ensure proper positioning after content changes
            Canvas.ForceUpdateCanvases();
            LayoutRebuilder.ForceRebuildLayoutImmediate(offerPanel.GetComponent<RectTransform>());
            if (offerPanel.transform.parent != null)
            {
                LayoutRebuilder.ForceRebuildLayoutImmediate(offerPanel.transform.parent.GetComponent<RectTransform>());
            }
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
            if (offerImage == null)
            {
                Debug.LogWarning("OfferImage is not assigned!");
                yield break;
            }

            using (UnityEngine.Networking.UnityWebRequest request = UnityEngine.Networking.UnityWebRequestTexture.GetTexture(imageUrl))
            {
                yield return request.SendWebRequest();

                if (request.result == UnityEngine.Networking.UnityWebRequest.Result.Success)
                {
                    Texture2D texture = UnityEngine.Networking.DownloadHandlerTexture.GetContent(request);
                    if (texture != null)
                    {
                        offerImage.sprite = Sprite.Create(
                            texture,
                            new Rect(0, 0, texture.width, texture.height),
                            new Vector2(0.5f, 0.5f)
                        );
                        offerImage.gameObject.SetActive(true);
                        
                        // Force layout rebuild after image loads to prevent overlapping
                        Canvas.ForceUpdateCanvases();
                        LayoutRebuilder.ForceRebuildLayoutImmediate(offerPanel.GetComponent<RectTransform>());
                        if (offerPanel.transform.parent != null)
                        {
                            LayoutRebuilder.ForceRebuildLayoutImmediate(offerPanel.transform.parent.GetComponent<RectTransform>());
                        }
                    }
                }
                else
                {
                    Debug.LogWarning($"Failed to load image: {imageUrl}. Error: {request.error}");
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

        /// <summary>
        /// Handles the Home button click to navigate back to the start scene.
        /// </summary>
        public void OnHomeClicked()
        {
            if (string.IsNullOrEmpty(startSceneName))
            {
                Debug.LogError("Start scene name is not configured!");
                return;
            }

            Debug.Log($"Navigating back to {startSceneName}");
            
            try
            {
                SceneManager.LoadScene(startSceneName);
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to load scene '{startSceneName}': {e.Message}");
            }
        }

        private void CloseOfferPanel()
        {
            offerPanel.SetActive(false);
            currentOfferIndex = 0;
        }

        private void ShowError(string message)
        {
            if (loadingPanel != null)
            loadingPanel.SetActive(false);
            
            offerPanel.SetActive(false);
            
            if (errorPanel != null)
            {
                if (errorText != null)
                errorText.text = message;
                errorPanel.SetActive(true);
            }
            else
            {
                // If no error panel, log to console
                Debug.LogError($"Offer Error: {message}");
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
            if (acceptButton != null)
            acceptButton.onClick.RemoveListener(OnAcceptClicked);
            
            if (declineButton != null)
            declineButton.onClick.RemoveListener(OnDeclineClicked);
            
            if (closeButton != null)
            closeButton.onClick.RemoveListener(OnCloseClicked);
            
            // Remove home button listener if assigned
            if (homeButton != null)
                homeButton.onClick.RemoveListener(OnHomeClicked);
        }
    }
}
