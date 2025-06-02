package com.momentscience.android.msapidemoapp.service.api

import com.momentscience.android.msapidemoapp.model.OffersResponse
import retrofit2.Response
import retrofit2.http.*

/**
 * Retrofit API interface for offers-related endpoints.
 * This interface defines the contract for interacting with the Moments Offers API.
 *
 * Key features:
 * - Suspend functions for coroutine support
 * - Retrofit annotations for API configuration
 * - Type-safe response handling
 * - Error handling through Response wrapper
 *
 * Base URL configuration is handled by Retrofit client setup.
 *
 * Usage example:
 * ```kotlin
 * val api = retrofit.create<OffersApi>()
 * val response = api.fetchOffers(
 *     apiKey = "your-api-key",
 *     loyaltyBoost = "1",
 *     creative = "0",
 *     payload = mapOf(
 *         "dev" to "1",
 *         "ua" to "user-agent-string"
 *     )
 * )
 * ```
 */
interface OffersApi {
    /**
     * Fetches offers from the API.
     * Makes a POST request to "offers.json" endpoint with query parameters and payload.
     *
     * @param apiKey The API key for authentication (passed as query parameter)
     * @param loyaltyBoost Loyalty boost parameter (valid values: "0", "1", "2")
     * @param creative Creative parameter (valid values: "0", "1")
     * @param payload Additional parameters for the request, sent as JSON body.
     *                Common payload fields include:
     *                - "dev": Development mode flag ("0" or "1")
     *                - "adpx_fp": Unique fingerprint
     *                - "ua": User agent string
     *                - Additional custom fields as needed
     *
     * @return [Response] wrapper containing [OffersResponse] on success
     *         The response includes:
     *         - List of offers
     *         - UI styling configuration
     *         - Tracking URLs
     *         - Additional metadata
     *
     */
    @POST("offers.json")
    suspend fun fetchOffers(
        @Query("api_key") apiKey: String,
        @Query("loyaltyboost") loyaltyBoost: String = "0",
        @Query("creative") creative: String = "0",
        @Body payload: Map<String, String>
    ): Response<OffersResponse>

    /**
     * Fires a beacon request for tracking user interactions.
     * Makes a GET request to the provided URL for event tracking.
     *
     * @param url The complete beacon URL to send the request to.
     *            This URL typically includes:
     *            - Event type (close, click, etc.)
     *            - Offer ID
     *            - Campaign ID
     *            - Session ID
     *            - Other tracking parameters
     *
     * @return [Response] wrapper containing [Unit] on success
     */
    @GET
    suspend fun fireBeacon(
        @Url url: String
    ): Response<Unit>
} 