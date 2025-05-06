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
        val ua: String,                       // User agent string
        val placement: String? = null,        // Optional placement identifier
        val ip: String? = null,               // Optional IP address
        @SerializedName("adpx_fp")
        val adpxFp: String? = null,           // Optional unique value
        val dev: String? = null,              // Optional dev flag
        val subid: String? = null,            // Optional subid
        @SerializedName("pub_user_id")
        val pubUserId: String? = null,        // Optional publisher user ID
        val payload: Map<String, String>? = null // Optional payload data
    )

    /**
     * Fetches offers from the backend API.
     * Makes a network request with the provided parameters and returns the JSON response.
     *
     * @param sdkId The account/SDK ID.
     * @param ua User agent string.
     * @param placement Optional placement identifier.
     * @param ip Optional IP address.
     * @param adpxFp Optional unique value.
     * @param dev Optional dev flag.
     * @param subid Optional subid.
     * @param pubUserId Optional publisher user ID.
     * @param payload Optional payload data.
     * @param loyaltyboost Optional loyalty boost flag.
     * @param creative Optional creative flag.
     * @return The JSON response from the API.
     */
    suspend fun fetchOffers(
        sdkId: String,
        ua: String,
        placement: String? = null,
        ip: String? = null,
        adpxFp: String? = null,
        dev: String? = null,
        subid: String? = null,
        pubUserId: String? = null,
        payload: Map<String, String>? = null,
        loyaltyboost: String? = null,
        creative: String? = null
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