package com.momentscience.android.msapidemoapp.service

import android.util.Log
import com.momentscience.android.msapidemoapp.model.OffersResponse
import com.momentscience.android.msapidemoapp.service.api.RetrofitProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.IOException
import java.net.URL
import java.util.UUID

/**
 * A comprehensive error hierarchy for the Offers API operations.
 * Each error type represents a specific failure scenario that can occur during API interactions.
 */
sealed class OffersError : Exception() {
    /** Indicates that the URL format or structure is invalid for the API request */
    data object InvalidURL : OffersError()
    
    /** Represents any network-related failures including timeouts, connection issues, or server errors */
    data class NetworkError(val error: Throwable) : OffersError()
    
    /** Indicates that the API request was successful but no offers were available */
    data object NoOffers : OffersError()
    
    /** Represents failures in parsing or converting the API response to expected data structures */
    data object DecodingError : OffersError()
    
    /** Indicates that the provided API credentials are invalid or unauthorized */
    data object InvalidAPIKey : OffersError()
    
    /** Represents an invalid loyalty boost parameter value that doesn't match expected values */
    data class InvalidLoyaltyBoost(val value: String) : OffersError()
    
    /** Indicates that the provided creative parameter value is not among the accepted values */
    data class InvalidCreative(val value: String) : OffersError()
}

/**
 * Service class responsible for managing all interactions with the Moments Offers API.
 * This service provides a clean interface for fetching offers and handling tracking beacons.
 *
 * Key Features:
 * - Asynchronous offer fetching with coroutines support
 * - Comprehensive error handling and validation
 * - Configurable development mode
 * - Support for custom payload parameters
 * - Beacon tracking functionality
 * - Parameter validation for loyalty boost and creative values
 *
 * Implementation Details:
 * - Uses Retrofit for network operations
 * - Implements proper error handling and type safety
 * - Supports customizable request parameters
 * - Provides detailed error feedback
 *
 * Example Usage:
 * ```kotlin
 * val service = OffersService()
 * 
 * // Basic usage
 * try {
 *     val response = service.fetchOffers(apiKey = "your-api-key")
 * } catch (e: OffersError) {
 *     // Handle specific error cases
 * }
 * 
 * // Advanced usage with all parameters
 * val response = service.fetchOffers(
 *     apiKey = "your-api-key",
 *     isDevelopment = true,
 *     loyaltyBoost = "1",
 *     creative = "1",
 *     payload = mapOf(
 *         "custom_param" to "value",
 *         "user_id" to "12345"
 *     )
 * )
 * 
 * // Tracking beacon
 * service.fireBeaconRequest("https://tracking.example.com/beacon")
 * ```
 */
class OffersService {
    companion object {
        /** Tag for logging purposes */
        private const val TAG = "OffersService"
        
        /** 
         * Defines the set of valid loyalty boost values.
         * - "0": No loyalty boost
         * - "1": Medium loyalty boost
         * - "2": High loyalty boost
         */
        private val VALID_LOYALTY_BOOST_VALUES = setOf("0", "1", "2")
        
        /**
         * Defines the set of valid creative values.
         * - "0": Standard creative
         * - "1": Alternative creative
         */
        private val VALID_CREATIVE_VALUES = setOf("0", "1")
    }

    /**
     * Validates the loyalty boost parameter against allowed values.
     * 
     * @param value The loyalty boost value to validate
     * @throws OffersError.InvalidLoyaltyBoost if the value is not in the set of valid values
     */
    private fun validateLoyaltyBoost(value: String) {
        if (value !in VALID_LOYALTY_BOOST_VALUES) {
            throw OffersError.InvalidLoyaltyBoost(value)
        }
    }

    /**
     * Validates the creative parameter against allowed values.
     * 
     * @param value The creative value to validate
     * @throws OffersError.InvalidCreative if the value is not in the set of valid values
     */
    private fun validateCreative(value: String) {
        if (value !in VALID_CREATIVE_VALUES) {
            throw OffersError.InvalidCreative(value)
        }
    }

    /**
     * Generates a standardized user agent string for API requests.
     * The user agent mimics a Chrome WebView on Android to ensure consistent API behavior.
     * 
     * @return A string containing the user agent information
     */
    fun getUserAgent(): String {
        return "Mozilla/5.0 (Linux; Android 14; Pixel 7 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.230 Mobile Safari/537.36"
    }

    /**
     * Fetches offers from the Moments API with comprehensive error handling and parameter validation.
     * This method executes asynchronously using coroutines and performs all necessary validations
     * before making the API request.
     *
     * @param apiKey The authentication key for the API
     * @param loyaltyBoost Controls the loyalty boost level for offers (default: "0")
     * @param creative Determines the creative variant to use (default: "0")
     * @param isDevelopment Toggles development mode for testing (default: true)
     * @param payload Additional parameters to include in the request
     * 
     * @return OffersResponse containing the complete offer data and metadata
     * 
     * @throws OffersError.InvalidURL When the API URL is malformed
     * @throws OffersError.NetworkError For any network or connection failures
     * @throws OffersError.NoOffers When no offers are available
     * @throws OffersError.DecodingError When response parsing fails
     * @throws OffersError.InvalidAPIKey When authentication fails
     * @throws OffersError.InvalidLoyaltyBoost When loyalty boost value is invalid
     * @throws OffersError.InvalidCreative When creative value is invalid
     */
    suspend fun fetchOffers(
        apiKey: String,
        loyaltyBoost: String = "0",
        creative: String = "0",
        isDevelopment: Boolean = true,
        payload: Map<String, String> = emptyMap()
    ): OffersResponse = withContext(Dispatchers.IO) {
        try {
            // Validate parameters
            validateLoyaltyBoost(loyaltyBoost)
            validateCreative(creative)

            // Add dev parameter to payload only if isDevelopment is true
            val finalPayload = payload.toMutableMap().apply {
                if (isDevelopment) {
                    put("dev", "1")
                }
            }

            val response = RetrofitProvider.offersApi.fetchOffers(
                apiKey = apiKey,
                loyaltyBoost = loyaltyBoost,
                creative = creative,
                payload = finalPayload
            )

            when {
                !response.isSuccessful -> {                    
                    throw OffersError.NetworkError(IOException("HTTP ${response.code()}"))
                }
                response.body() == null -> {
                    throw OffersError.DecodingError
                }
                response.body()?.data?.offers?.isEmpty() == true -> {
                    throw OffersError.NoOffers
                }
                else -> {
                    response.body()!!
                }
            }
        } catch (e: Exception) {
            when (e) {
                is IOException -> throw OffersError.NetworkError(e)
                is OffersError -> throw e
                else -> throw OffersError.NetworkError(e)
            }
        }
    }

    /**
     * Sends a tracking beacon request to the specified URL.
     * This method is used to track user interactions and events with the offers system.
     * The request is executed asynchronously using coroutines.
     *
     * Implementation Details:
     * - Validates the beacon URL format
     * - Executes the request on IO dispatcher
     * - Provides detailed logging of the request
     * - Handles various network and URL-related errors
     *
     * @param url The complete URL for the beacon request
     * 
     * @throws OffersError.InvalidURL When the beacon URL is malformed
     * @throws OffersError.NetworkError When the beacon request fails
     */
    suspend fun fireBeaconRequest(url: String) = withContext(Dispatchers.IO) {
        try {
            // Validate URL
            URL(url)
            
            Log.d(TAG, "👉 Firing beacon request to $url")
            
            val response = RetrofitProvider.offersApi.fireBeacon(url)
            
            if (!response.isSuccessful) {
                throw OffersError.NetworkError(
                    IOException("Beacon request failed with status code: ${response.code()}")
                )
            }
        } catch (e: Exception) {
            when (e) {
                is IOException -> throw OffersError.NetworkError(e)
                is IllegalArgumentException -> throw OffersError.InvalidURL
                is OffersError -> throw e
                else -> throw OffersError.NetworkError(e)
            }
        }
    }
} 