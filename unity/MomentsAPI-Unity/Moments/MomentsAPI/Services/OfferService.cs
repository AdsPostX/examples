using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;
using MomentsAPI.Models;
using MomentsAPI.Utils;

namespace MomentsAPI.Services
{
    /// <summary>
    /// A service class responsible for interacting with the Moments API.
    /// This class encapsulates all network operations related to offers, such as
    /// loading offers and firing tracking requests. It is designed to be used by
    /// managers or other business logic layers, keeping networking separate from UI.
    /// </summary>
    public class OfferService
    {
        /// <summary>
        /// The base URL for the Moments API.
        /// </summary>
        private const string BASE_URL = "https://api.adspostx.com/native/v4";

        /// <summary>
        /// The endpoint for fetching offers.
        /// </summary>
        private const string OFFERS_PATH = "offers.json";

        /// <summary>
        /// Timeout duration for offer loading requests (in seconds).
        /// </summary>
        private const int LOAD_OFFERS_TIMEOUT = 30;

        /// <summary>
        /// Timeout duration for tracking requests (in seconds).
        /// </summary>
        private const int TRACKING_TIMEOUT = 10;

        /// <summary>
        /// Loads offers from the Moments API.
        /// </summary>
        /// <param name="apiKey">The API key for authentication (required).</param>
        /// <param name="loyaltyBoost">Optional parameter for loyalty boost. Must be '0', '1', or '2'.</param>
        /// <param name="creative">Optional parameter for creative. Must be '0' or '1'.</param>
        /// <param name="campaignId">Optional parameter for filtering offers by campaign ID.</param>
        /// <param name="isDevelopment">If true, adds a development flag to the payload.</param>
        /// <param name="payload">Additional payload data to send in the request body.</param>
        /// <param name="onSuccess">Callback invoked when offers are successfully loaded.</param>
        /// <param name="onError">Callback invoked when an error occurs.</param>
        /// <returns>IEnumerator for coroutine execution.</returns>
        public IEnumerator LoadOffers(
            string apiKey,
            string loyaltyBoost = null,
            string creative = null,
            string campaignId = null,
            bool isDevelopment = false,
            Dictionary<string, string> payload = null,
            Action<OfferResponse> onSuccess = null,
            Action<string> onError = null)
        {
            // Validate API key
            if (string.IsNullOrEmpty(apiKey))
            {
                onError?.Invoke("API Key cannot be empty");
                yield break;
            }

            // Validate loyaltyBoost if provided
            if (!string.IsNullOrEmpty(loyaltyBoost))
            {
                if (loyaltyBoost != "0" && loyaltyBoost != "1" && loyaltyBoost != "2")
                {
                    onError?.Invoke("loyaltyBoost must be one of these values: 0, 1, or 2");
                    yield break;
                }
            }

            // Validate creative if provided
            if (!string.IsNullOrEmpty(creative))
            {
                if (creative != "0" && creative != "1")
                {
                    onError?.Invoke("creative must be either 0 or 1");
                    yield break;
                }
            }

            // Build URL with query parameters
            string url = $"{BASE_URL}/{OFFERS_PATH}?api_key={UnityWebRequest.EscapeURL(apiKey)}";
            
            if (!string.IsNullOrEmpty(loyaltyBoost))
                url += $"&loyaltyboost={UnityWebRequest.EscapeURL(loyaltyBoost)}";
            
            if (!string.IsNullOrEmpty(creative))
                url += $"&creative={UnityWebRequest.EscapeURL(creative)}";
            
            if (!string.IsNullOrEmpty(campaignId))
                url += $"&campaignId={UnityWebRequest.EscapeURL(campaignId)}";

            // Prepare payload
            Dictionary<string, string> requestPayload = payload != null 
                ? new Dictionary<string, string>(payload) 
                : new Dictionary<string, string>();

            if (isDevelopment)
            {
                requestPayload["dev"] = "1";
            }

            // Ensure user agent is in payload
            if (!requestPayload.ContainsKey("ua"))
            {
                requestPayload["ua"] = UserAgentUtil.GetUserAgent();
            }

            // Convert payload to JSON
            string jsonPayload = JsonUtility.ToJson(new PayloadWrapper { payload = requestPayload });
            byte[] bodyRaw = Encoding.UTF8.GetBytes(ConvertDictionaryToJson(requestPayload));

            // Create UnityWebRequest
            using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
            {
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
                request.downloadHandler = new DownloadHandlerBuffer();
                request.SetRequestHeader("Content-Type", "application/json");
                request.SetRequestHeader("Accept", "application/json");
                request.SetRequestHeader("User-Agent", requestPayload["ua"]);
                request.timeout = LOAD_OFFERS_TIMEOUT;

                // Send request
                yield return request.SendWebRequest();

                // Handle response
                if (request.result == UnityWebRequest.Result.Success)
                {
                    try
                    {
                        OfferResponse response = JsonUtility.FromJson<OfferResponse>(request.downloadHandler.text);
                        onSuccess?.Invoke(response);
                    }
                    catch (Exception e)
                    {
                        onError?.Invoke($"Error parsing response: {e.Message}");
                    }
                }
                else
                {
                    string errorMessage = request.result == UnityWebRequest.Result.ConnectionError 
                        ? "Request timed out. Please check your connection and try again."
                        : $"API Error: {request.responseCode} - {request.error}";
                    
                    onError?.Invoke(errorMessage);
                }
            }
        }

        /// <summary>
        /// Fires a GET request to the specified URL without processing the response.
        /// This is useful for tracking pixels or other endpoints where the response data is not needed.
        /// </summary>
        /// <param name="url">The URL to send the GET request to.</param>
        /// <param name="onComplete">Optional callback invoked when request completes (success or failure).</param>
        /// <returns>IEnumerator for coroutine execution.</returns>
        public IEnumerator SendTrackingRequest(string url, Action<bool, string> onComplete = null)
        {
            if (string.IsNullOrEmpty(url))
            {
                onComplete?.Invoke(false, "URL cannot be empty");
                yield break;
            }
                Debug.Log($"🐤 Sending tracking request to: {url}");
            using (UnityWebRequest request = UnityWebRequest.Get(url))
            {
                request.SetRequestHeader("Accept", "application/json");
                request.timeout = TRACKING_TIMEOUT;

                yield return request.SendWebRequest();

                if (request.result == UnityWebRequest.Result.Success)
                {
                    Debug.Log($"🐤 Sent tracking request to: {url}");
                    onComplete?.Invoke(true, null);
                }
                else
                {
                    string errorMessage = request.result == UnityWebRequest.Result.ConnectionError
                        ? $"Tracking request timed out: {url}"
                        : $"Error making GET request: {request.error}";
                    
                    Debug.LogWarning(errorMessage);
                    onComplete?.Invoke(false, errorMessage);
                }
            }
        }

        /// <summary>
        /// Helper method to convert Dictionary to JSON string.
        /// </summary>
        private string ConvertDictionaryToJson(Dictionary<string, string> dictionary)
        {
            if (dictionary == null || dictionary.Count == 0)
                return "{}";

            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            
            bool first = true;
            foreach (var kvp in dictionary)
            {
                if (!first)
                    sb.Append(",");
                
                sb.Append($"\"{kvp.Key}\":\"{kvp.Value}\"");
                first = false;
            }
            
            sb.Append("}");
            return sb.ToString();
        }

        /// <summary>
        /// Wrapper class for JSON serialization of payload.
        /// </summary>
        [Serializable]
        private class PayloadWrapper
        {
            public Dictionary<string, string> payload;
        }
    }
}
