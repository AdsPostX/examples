package com.momentscience.apiwebdemoapp.viewmodels

import android.content.Context
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.momentscience.apiwebdemoapp.di.AppModule
import com.momentscience.apiwebdemoapp.services.NetworkService
import com.google.gson.JsonElement
import com.google.gson.JsonParser
import com.momentscience.apiwebdemoapp.templates.AdpxHtmlTemplate
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONObject
import com.momentscience.apiwebdemoapp.PrefetchMode
import com.momentscience.apiwebdemoapp.config.AppConfig
import com.momentscience.apiwebdemoapp.utils.UserAgentUtil

/**
 * ViewModel responsible for managing the state and business logic related to offers.
 * Handles data fetching, state management, and interaction with the WebView.
 */
class OffersViewModel : ViewModel() {
    // StateFlow to indicate if a network request is in progress
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    // StateFlow to hold error messages, if any
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    // StateFlow to hold the JSON response from the offers API
    private val _jsonResponse = MutableStateFlow<JsonElement?>(null)
    val jsonResponse: StateFlow<JsonElement?> = _jsonResponse.asStateFlow()

    // StateFlow to track if a fetch attempt has been made
    private val _hasAttemptedFetch = MutableStateFlow(false)
    val hasAttemptedFetch: StateFlow<Boolean> = _hasAttemptedFetch.asStateFlow()

    // StateFlow to control whether the checkout screen should be shown
    private val _showCheckout = MutableStateFlow(false)
    val showCheckout: StateFlow<Boolean> = _showCheckout.asStateFlow()

    // StateFlow to track the number of offers available
    private val _offerCount = MutableStateFlow(0)
    val offerCount: StateFlow<Int> = _offerCount.asStateFlow()

    // StateFlow to hold the current SDK ID
    private val _sdkId = MutableStateFlow("")
    val sdkId: StateFlow<String> = _sdkId.asStateFlow()

    // StateFlow to track if the WebView is loading
    private val _isWebViewLoading = MutableStateFlow(false)
    val isWebViewLoading: StateFlow<Boolean> = _isWebViewLoading.asStateFlow()

    // StateFlow to track the current prefetch mode
    private val _prefetchMode = MutableStateFlow(PrefetchMode.NONE)
    val prefetchMode: StateFlow<PrefetchMode> = _prefetchMode.asStateFlow()

    // StateFlow to hold the payload for offers
    private val _payload = MutableStateFlow<Map<String, String>?>(null)
    val payload: StateFlow<Map<String, String>?> = _payload.asStateFlow()

    // Network service instance for making API calls
    private val networkService: NetworkService = AppModule.networkService

    /**
     * Sets the current SDK ID.
     * @param id The SDK ID to set.
     */
    fun setSdkId(id: String) {
        _sdkId.value = id
    }

    /**
     * Fetches offers from the network using the provided SDK ID.
     * Updates state with loading indicators, error messages, and response data.
     * @param sdkId The SDK ID to use for fetching offers.
     */
    fun fetchOffers(sdkId: String) {
        if (sdkId.isBlank()) {
            _error.value = "Please enter SDK ID"
            return
        }

        _sdkId.value = sdkId
        _prefetchMode.value = PrefetchMode.API // Set prefetch mode to API
        
        viewModelScope.launch {
            // Set loading state and reset relevant fields
            _isLoading.value = true
            _error.value = null
            _jsonResponse.value = null
            _showCheckout.value = false
            _offerCount.value = 0
            _hasAttemptedFetch.value = true

            try {
                // Create payload
                val payload = createPayload()
                _payload.value = payload
                
                // Make the network request to fetch offers
                val response = networkService.fetchOffers(
                    sdkId = sdkId,
                    payload = payload,
                    creative = "0",
                    loyaltyboost = "0",
                    isDevelopment = true
                )
                _jsonResponse.value = response
                
                // Check if there are offers in the response and update state accordingly
                val dataElement = response.asJsonObject.get("data")
                if (dataElement != null && !dataElement.isJsonNull) {
                    val offersElement = dataElement.asJsonObject.get("offers")
                    if (offersElement != null && !offersElement.isJsonNull) {
                        val count = offersElement.asJsonArray.size()
                        _offerCount.value = count
                        _showCheckout.value = count > 0
                    }
                }
            } catch (e: Exception) {
                // Handle errors and update error state
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    /**
     * Sets the JSON response manually.
     * @param response The JSON response to set.
     */
    fun setJsonResponse(response: JsonElement?) {
        _jsonResponse.value = response
    }

    /**
     * Generates a unique ID for use in API requests.
     * @return A unique ID string.
     */
    private fun getUniqueId(): String {
        return "uniqueUser123" // In a production app, generate a truly unique ID
    }

    /**
     * Updates the number of offers.
     * @param count The number of offers.
     */
    fun updateOffersCount(count: Int) {
        _offerCount.value = count
    }

    /**
     * Controls whether the checkout screen should be shown.
     * @param show True to show checkout, false to hide.
     */
    fun setShowCheckout(show: Boolean) {
        _showCheckout.value = show
    }

    /**
     * Handles callbacks from Adpx JavaScript interface.
     * Routes events to appropriate handlers.
     * @param event The name of the event.
     * @param payload The JSON payload of the event.
     */
    fun handleAdpxCallback(event: String, payload: String) {
        when (event) {
            "ads_found" -> handleAdsFound(payload)
        }
    }

    /**
     * Handles the "ads_found" event from Adpx.
     * Parses the payload and updates state accordingly.
     * @param payload The JSON payload from the ads_found event.
     */
    private fun handleAdsFound(payload: String) {
        try {
            Log.d("AdpxCallback", "Ads Found Event")
            Log.d("AdpxCallback", "Payload: $payload")
            
            val jsonObject = JSONObject(payload)
            if (jsonObject.has("response")) {
                val responseString = jsonObject.get("response").toString()
                val jsonElement = JsonParser.parseString(responseString)
                
                // Only set JSON response if this is from WEB prefetch
                if (_prefetchMode.value == PrefetchMode.WEB) {
                    setJsonResponse(jsonElement)
                }
                
                try {
                    val dataObject = jsonElement.asJsonObject.get("data")?.asJsonObject
                    if (dataObject != null && !dataObject.isJsonNull) {
                        val offersArray = dataObject.get("offers")?.asJsonArray
                        if (offersArray != null && !offersArray.isJsonNull) {
                            val count = offersArray.size()
                            updateOffersCount(count)
                            setShowCheckout(true)
                            Log.d("AdpxCallback", "Found $count offers")
                        }
                    }
                } catch (e: Exception) {
                    Log.e("AdpxCallback", "Error parsing offers from response", e)
                }
                
                Log.d("AdpxCallback", "Successfully updated ViewModel with response")
            } else {
                Log.e("AdpxCallback", "Payload does not contain 'response' key")
            }
        } catch (e: Exception) {
            Log.e("AdpxCallback", "Error parsing ads_found payload", e)
        }
    }

    /**
     * Gets the HTML content for the offers WebView.
     * @param sdkId The SDK ID to use in the HTML template
     * @param context The Android context needed to load HTML from assets
     * @return The HTML content string
     * @throws IOException if the HTML template file cannot be loaded
     */
    fun getHtmlContent(sdkId: String, context: Context): String {
        // Ensure we have a payload to pass to the WebView
        if (_payload.value == null) {
            _payload.value = createPayload()
        }
        
        return AdpxHtmlTemplate.generate(
            sdkId = sdkId,
            context = context,
            payload = _payload.value
        )
    }

    /**
     * Sets the loading state for the WebView.
     * @param loading True if the WebView is loading, false otherwise.
     */
    fun setWebViewLoading(loading: Boolean) {
        _isWebViewLoading.value = loading
    }

    /**
     * Resets all state to initial values.
     * Called when navigating back to the offers screen.
     */
    fun resetState() {
        _showCheckout.value = false
        _offerCount.value = 0
        _jsonResponse.value = null
        _isWebViewLoading.value = false
        _error.value = null
        _prefetchMode.value = PrefetchMode.NONE
    }

    /**
     * Sets the prefetch mode explicitly.
     * @param mode The prefetch mode to set.
     */
    fun setPrefetchMode(mode: PrefetchMode) {
        _prefetchMode.value = mode
    }

    /**
     * Gets the base URL for WebView content.
     * @return The base URL string.
     */
    fun getBaseUrl(): String {
        return AppConfig.DEFAULT_WEBVIEW_BASE_URL
    }

    /**
     * Sets an error message.
     * @param message The error message to set.
     */
    fun setError(message: String?) {
        _error.value = message
    }

    // Add this method to create a standard payload
    private fun createPayload(): Map<String, String> {
        return mapOf(
            "adpx_fp" to getUniqueId(),
            "pub_user_id" to getUniqueId(),
            "ua" to UserAgentUtil.getUserAgent(),
            "themeId" to "demo",
            "placement" to "checkout"
        )
    }


}