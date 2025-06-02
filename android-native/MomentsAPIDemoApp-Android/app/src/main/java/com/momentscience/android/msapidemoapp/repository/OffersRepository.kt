package com.momentscience.android.msapidemoapp.repository

import com.momentscience.android.msapidemoapp.model.OffersResponse
import com.momentscience.android.msapidemoapp.service.OffersError
import com.momentscience.android.msapidemoapp.service.OffersService

/**
 * Repository interface for offers-related operations.
 * This interface abstracts the data source from the UI layer, providing a clean separation of concerns.
 *
 * Key responsibilities:
 * - Abstracting data source implementation details
 * - Providing a clean API for the UI layer
 * - Handling data operations and transformations
 * - Managing error handling through Result type
 *
 * Usage:
 * ```kotlin
 * val repository: OffersRepository = OffersRepositoryImpl(offersService)
 * val result = repository.fetchOffers(apiKey = "your-api-key")
 * result.onSuccess { offers ->
 *     // Handle success
 * }.onFailure { error ->
 *     // Handle error
 * }
 * ```
 */
interface OffersRepository {
    /**
     * Fetches offers using the provided parameters.
     * Returns a [Result] that encapsulates either the successful response or an error.
     *
     * @param apiKey The API key for authentication
     * @param loyaltyBoost Loyalty boost parameter (valid values: "0", "1", "2")
     * @param creative Creative parameter (valid values: "0", "1")
     * @param isDevelopment Whether to run in development mode
     * @param payload Additional parameters to be sent with the request
     * @return [Result] containing either [OffersResponse] on success or an error on failure
     *
     * Possible errors:
     * - [OffersError.InvalidAPIKey] if the API key is invalid
     * - [OffersError.NetworkError] if a network error occurs
     * - [OffersError.NoOffers] if no offers are returned
     * - [OffersError.DecodingError] if the response cannot be parsed
     * - [OffersError.InvalidLoyaltyBoost] if loyaltyBoost value is invalid
     * - [OffersError.InvalidCreative] if creative value is invalid
     */
    suspend fun fetchOffers(
        apiKey: String,
        loyaltyBoost: String = "0",
        creative: String = "0",
        isDevelopment: Boolean = false,
        payload: Map<String, String> = emptyMap()
    ): Result<OffersResponse>

    /**
     * Sends a beacon request to track user interactions.
     * Returns a [Result] that encapsulates either success or an error.
     *
     * @param url The beacon URL to send the request to
     * @return [Result] containing [Unit] on success or an error on failure
     *
     * Possible errors:
     * - [OffersError.InvalidURL] if the URL is invalid
     * - [OffersError.NetworkError] if the request fails
     */
    suspend fun fireBeacon(url: String): Result<Unit>

    fun getUserAgent(): String
}

/**
 * Implementation of [OffersRepository] that uses [OffersService] as its data source.
 * This implementation:
 * - Delegates data operations to the service layer
 * - Wraps service calls in [Result] for error handling
 * - Maintains a single source of truth for offers data
 *
 * @property offersService The service responsible for API interactions
 *
 * Example usage:
 * ```kotlin
 * val service = OffersService()
 * val repository = OffersRepositoryImpl(service)
 * 
 * // Fetch offers
 * val result = repository.fetchOffers(
 *     apiKey = "your-api-key",
 *     isDevelopment = false
 * )
 *
 * // Handle beacon events
 * repository.fireBeacon("https://example.com/beacon")
 * ```
 */
class OffersRepositoryImpl(
    private val offersService: OffersService
) : OffersRepository {
    
    /**
     * Fetches offers from the service and wraps the response in a [Result].
     * Uses [runCatching] to automatically catch and wrap any exceptions.
     *
     * @see OffersRepository.fetchOffers
     */
    override suspend fun fetchOffers(
        apiKey: String,
        loyaltyBoost: String,
        creative: String,
        isDevelopment: Boolean,
        payload: Map<String, String>
    ): Result<OffersResponse> = runCatching {
        offersService.fetchOffers(
            apiKey = apiKey,
            loyaltyBoost = loyaltyBoost,
            creative = creative,
            isDevelopment = isDevelopment,
            payload = payload
        )
    }

    /**
     * Sends a beacon request through the service and wraps the response in a [Result].
     * Uses [runCatching] to automatically catch and wrap any exceptions.
     *
     * @see OffersRepository.fireBeacon
     */
    override suspend fun fireBeacon(url: String): Result<Unit> = runCatching {
        offersService.fireBeaconRequest(url)
    }

    override fun getUserAgent(): String {
        return offersService.getUserAgent()
    }
} 