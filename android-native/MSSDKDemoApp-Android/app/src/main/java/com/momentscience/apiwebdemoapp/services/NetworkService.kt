package com.momentscience.apiwebdemoapp.services

import com.google.gson.JsonElement
import com.google.gson.annotations.SerializedName

/**
 * Interface defining the contract for network operations related to offers.
 * Provides methods for fetching offers from the API.
 */
interface NetworkService {
    /**
     * Data class representing the request body for the API.
     * Contains various parameters that can be sent to the offers API.
     */
    data class MomentsAPIRequest(
        val payload: Map<String, String>? = null // Optional payload data
    )

    /**
     * Fetches offers from the backend API.
     * Makes a network request with the provided parameters and returns the JSON response.
     *
     * @param sdkId The account/SDK ID.
     * @param payload Optional payload data.
     * @param loyaltyboost Optional loyalty boost flag. (default value "0")
     * @param creative Optional creative flag. (default value "0")
     * @param campaignId Optional campaign ID .
     * @param isDevelopment Optional flag to indicate development mode. If true, adds 'dev=1' to payload.
     * @return The JSON response from the API.
     */
    suspend fun fetchOffers(
        sdkId: String,
        payload: Map<String, String>? = null,
        loyaltyboost: String? = "0",
        creative: String? = "0",
        campaignId: String? = null,
        isDevelopment: Boolean = false
    ): JsonElement
}

/**
 * Sealed class representing possible network errors.
 * Provides specific error types for different failure scenarios.
 */
sealed class NetworkError : Exception() {
    /**
     * Represents a server error (e.g., non-2xx HTTP response).
     * @param message The error message.
     */
    data class ServerError(override val message: String) : NetworkError()
    
    /**
     * Represents an error decoding the response (e.g., invalid JSON).
     * @param message The error message.
     */
    data class DecodingError(override val message: String) : NetworkError()
    
    /**
     * Represents an invalid parameter passed to the API.
     * @param message The error message.
     */
    data class InvalidParameter(override val message: String) : NetworkError()
} 