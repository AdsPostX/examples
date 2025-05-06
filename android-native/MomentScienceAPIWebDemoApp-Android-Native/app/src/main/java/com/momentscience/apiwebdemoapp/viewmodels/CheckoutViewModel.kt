package com.momentscience.apiwebdemoapp.viewmodels

import android.content.Context
import androidx.lifecycle.ViewModel
import com.google.gson.JsonElement
import com.momentscience.apiwebdemoapp.templates.CheckoutHtmlTemplate
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * ViewModel responsible for managing the checkout screen state and business logic.
 * Handles HTML generation, loading states, and external URL handling.
 */
class CheckoutViewModel : ViewModel() {
    // StateFlow to indicate if loading is in progress
    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    // StateFlow to hold error messages, if any
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    // StateFlow to track the number of offers
    private val _offersCount = MutableStateFlow(0)
    val offersCount: StateFlow<Int> = _offersCount.asStateFlow()

    // StateFlow to hold the HTML content
    private val _htmlContent = MutableStateFlow("")
    val htmlContent: StateFlow<String> = _htmlContent.asStateFlow()

    // URL handler reference for opening external links
    private var urlHandler: UrlHandler? = null

    /**
     * Determines if a URL should be opened in an external browser.
     * @param url The URL to check.
     * @return True if the URL should be opened externally, false otherwise.
     */
    fun shouldOpenUrlExternally(url: String?): Boolean {
        return url != null && (url.startsWith("http://") || url.startsWith("https://"))
    }

    /**
     * Interface for handling URL opening operations.
     * Used to delegate URL opening to the UI layer.
     */
    interface UrlHandler {
        fun openUrl(url: String)
    }

    /**
     * Initializes the checkout process.
     * Generates the HTML content and updates the state with the number of offers and any errors.
     * 
     * @param sdkId The SDK ID for the checkout.
     * @param jsonResponse The JSON response containing offer data.
     * @param isFromAPIPrefetch Whether the data was prefetched via API.
     * @param offerCount The number of offers to display.
     * @param context The Android context to pass to the HTML template.
     * @param payload Optional payload data with user information.
     */
    fun initializeCheckout(
        sdkId: String,
        jsonResponse: JsonElement?,
        isFromAPIPrefetch: Boolean,
        offerCount: Int = 0,
        context: Context,
        payload: Map<String, String>? = null
    ) {
        try {
            // Use offerCount if jsonResponse is null, otherwise extract from jsonResponse
            val count = jsonResponse?.let { extractOffersCount(it) } ?: offerCount
            _offersCount.value = count
            
            val html = CheckoutHtmlTemplate.generate(
                sdkId = sdkId,
                offersCount = count,
                jsonResponse = jsonResponse,
                isFromAPIPrefetch = isFromAPIPrefetch,
                context = context,
                payload = payload
            )
            _htmlContent.value = html
            _error.value = null
        } catch (e: Exception) {
            _error.value = "Failed to initialize checkout: ${e.message}"
        }
    }

    /**
     * Extracts the number of offers from the JSON response.
     * @param jsonResponse The JSON response to parse.
     * @return The number of offers found, or 0 if none.
     */
    private fun extractOffersCount(jsonResponse: JsonElement?): Int {
        return try {
            val dataElement = jsonResponse?.asJsonObject?.get("data")
            if (dataElement != null && !dataElement.isJsonNull) {
                val offersElement = dataElement.asJsonObject.get("offers")
                if (offersElement != null && !offersElement.isJsonNull) {
                    offersElement.asJsonArray.size()
                } else 0
            } else 0
        } catch (e: Exception) {
            0
        }
    }

    /**
     * Sets the loading state for the checkout process.
     * @param isLoading True if loading, false otherwise.
     */
    fun setLoading(isLoading: Boolean) {
        _isLoading.value = isLoading
    }

    /**
     * Gets the base URL for WebView content.
     * @return The base URL string.
     */
    fun getBaseUrl(): String {
        return "https://dummywebsite.com"
    }

    /**
     * Sets the URL handler for opening external links.
     * @param handler The URL handler implementation.
     */
    fun setUrlHandler(handler: UrlHandler) {
        urlHandler = handler
    }

    /**
     * Handles opening an external URL using the URL handler.
     * @param url The URL to open.
     */
    fun handleExternalUrl(url: String) {
        if (shouldOpenUrlExternally(url)) {
            urlHandler?.openUrl(url)
        }
    }
}