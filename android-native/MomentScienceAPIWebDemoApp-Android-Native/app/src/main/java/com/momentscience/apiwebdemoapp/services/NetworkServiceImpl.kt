package com.momentscience.apiwebdemoapp.services

import android.util.Log
import com.momentscience.apiwebdemoapp.di.AppModule
import com.google.gson.Gson
import com.google.gson.JsonElement
import com.google.gson.JsonParser
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException
import com.google.gson.JsonObject

/**
 * Implementation of the NetworkService interface using OkHttp and Gson.
 * Handles the actual network requests to the offers API.
 */
class NetworkServiceImpl : NetworkService {
    private val TAG = "NetworkServiceImpl"
    private val baseUrl = "https://api.adspostx.com/native/v4/offers.json"
    private val client: OkHttpClient = AppModule.okHttpClient
    private val gson: Gson = AppModule.gson

    /**
     * Fetches offers from the backend API using a POST request.
     * Builds the request URL and body, sends the request, and parses the response.
     * 
     * @param sdkId The account/SDK ID.
     * @param ua User agent string.
     * @param placement Optional placement identifier.
     * @param ip Optional IP address.
     * @param adpxFp Optional unique value.
     * @param dev Optional dev flag.
     * @param subid Optional subid.
     * @param pubUserId Optional publisher user ID, this value is passed as pub_user_id to the API
     * @param payload Optional payload data.
     * @param loyaltyboost Optional loyalty boost flag.
     * @param creative Optional creative flag.
     * @return The JSON response from the API.
     * @throws NetworkError if the request fails or has invalid parameters.
     */
    override suspend fun fetchOffers(
        sdkId: String,
        ua: String,
        placement: String?,
        ip: String?,
        adpxFp: String?,
        dev: String?,
        subid: String?,
        pubUserId: String?,
        payload: Map<String, String>?,
        loyaltyboost: String?,
        creative: String?
    ): JsonElement = withContext(Dispatchers.IO) {
        try {
            // Validate input parameters for allowed values
            validateParameters(loyaltyboost, creative, dev)

            // Build the request URL with query parameters
            val urlBuilder = StringBuilder(baseUrl)
            urlBuilder.append("?accountId=$sdkId")
            loyaltyboost?.let { urlBuilder.append("&loyaltyboost=$it") }
            creative?.let { urlBuilder.append("&creative=$it") }
            urlBuilder.append("&country=us")

            // Create the request body as JSON, including payload as direct parameters
            val requestJson = JsonObject().apply {
                addProperty("ua", ua)
                
                placement?.let { addProperty("placement", it) }
                ip?.let { addProperty("ip", it) }
                adpxFp?.let { addProperty("adpx_fp", it) }
                dev?.let { addProperty("dev", it) }
                subid?.let { addProperty("subid", it) }
                pubUserId?.let { addProperty("pub_user_id", it) }
                
                // Add payload values directly to the request body
                payload?.forEach { (key, value) ->
                    addProperty(key, value)
                }
            }

            val jsonBody = gson.toJson(requestJson)
            val requestBody = jsonBody.toRequestBody("application/json".toMediaType())

            // Build the OkHttp request
            val request = Request.Builder()
                .url(urlBuilder.toString())
                .post(requestBody)
                .build()

            Log.d(TAG, "Making request to: ${request.url}")
            Log.d(TAG, "Request body: $jsonBody")

            // Execute the request
            val response = client.newCall(request).execute()
            if (!response.isSuccessful) {
                val errorBody = response.body?.string()
                Log.e(TAG, "Error response: $errorBody")
                throw NetworkError.ServerError("Server returned ${response.code}: $errorBody")
            }

            // Parse the response body as JSON
            val responseBody = response.body?.string()
                ?: throw NetworkError.ServerError("Empty response body")

            Log.d(TAG, "Response received: $responseBody")
            Log.d(TAG, "response count: ${responseBody.length}")
            
            JsonParser.parseString(responseBody)
        } catch (e: Exception) {
            Log.e(TAG, "Network error", e)
            // Map exceptions to appropriate NetworkError types
            throw when (e) {
                is NetworkError -> e
                is IOException -> NetworkError.ServerError(e.message ?: "Unknown server error")
                else -> NetworkError.DecodingError(e.message ?: "Unknown error")
            }
        }
    }

    /**
     * Validates certain parameters to ensure they have allowed values.
     * Throws InvalidParameter if a value is not allowed.
     * 
     * @param loyaltyboost The loyalty boost parameter.
     * @param creative The creative parameter.
     * @param dev The dev parameter.
     * @throws NetworkError.InvalidParameter if a parameter has an invalid value.
     */
    private fun validateParameters(loyaltyboost: String?, creative: String?, dev: String?) {
        if (loyaltyboost != null && !listOf("0", "1", "2").contains(loyaltyboost)) {
            throw NetworkError.InvalidParameter("loyaltyboost must be 0, 1, or 2")
        }
        if (creative != null && !listOf("0", "1").contains(creative)) {
            throw NetworkError.InvalidParameter("creative must be 0 or 1")
        }
        if (dev != null && !listOf("0", "1").contains(dev)) {
            throw NetworkError.InvalidParameter("dev must be 0 or 1")
        }
    }
} 