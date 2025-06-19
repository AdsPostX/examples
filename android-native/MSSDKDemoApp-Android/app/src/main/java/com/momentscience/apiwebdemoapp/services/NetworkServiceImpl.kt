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
import com.momentscience.apiwebdemoapp.config.AppConfig
import com.momentscience.apiwebdemoapp.utils.UserAgentUtil

/**
 * Implementation of the NetworkService interface using OkHttp and Gson.
 * Handles the actual network requests to the offers API.
 */
class NetworkServiceImpl : NetworkService {
    private val TAG = "NetworkServiceImpl"
    private val baseUrl = AppConfig.API_BASE_URL
    private val client: OkHttpClient = AppModule.okHttpClient
    private val gson: Gson = AppModule.gson

    /**
     * Fetches offers from the backend API using a POST request.
     * Builds the request URL and body, sends the request, and parses the response.
     * 
     * @param sdkId The account/SDK ID.
     * @param payload Optional payload data.
     * @param loyaltyboost Optional loyalty boost flag.
     * @param creative Optional creative flag.
     * @param campaignId Optional campaign ID.
     * @param isDevelopment Optional flag to indicate development mode. If true, adds 'dev=1' to payload.
     * @return The JSON response from the API.
     * @throws NetworkError if the request fails or has invalid parameters.
     */
    override suspend fun fetchOffers(
        sdkId: String,
        payload: Map<String, String>?,
        loyaltyboost: String?,
        creative: String?,
        campaignId: String?,
        isDevelopment: Boolean
    ): JsonElement = withContext(Dispatchers.IO) {
        try {
            // Validate input parameters for allowed values
            validateParameters(loyaltyboost, creative)

            // Build the request URL with query parameters
            val urlBuilder = StringBuilder(baseUrl)
            urlBuilder.append("?api_key=$sdkId")
            loyaltyboost?.let { urlBuilder.append("&loyaltyboost=$it") }
            creative?.let { urlBuilder.append("&creative=$it") }
            campaignId?.let { urlBuilder.append("&campaignId=$it") }
            urlBuilder.append("&country=us")

            // Create the request body as JSON, including payload as direct parameters
            val requestJson = JsonObject().apply {
                // Add payload values directly to the request body
                payload?.forEach { (key, value) ->
                    addProperty(key, value)
                }
                
                // Add dev=1 to payload if isDevelopment is true
                if (isDevelopment) {
                    addProperty("dev", "1")
                }
            }

            val jsonBody = gson.toJson(requestJson)
            val requestBody = jsonBody.toRequestBody("application/json".toMediaType())

            // Get user agent from payload or default
            val userAgent = payload?.get("ua")?.takeIf { it.isNotBlank() }
                ?: UserAgentUtil.getUserAgent()

            // Build the OkHttp request with User-Agent header
            val request = Request.Builder()
                .url(urlBuilder.toString())
                .post(requestBody)
                .header("User-Agent", userAgent)
                .build()

            Log.d(TAG, "Making request to: ${request.url}")
            Log.d(TAG, "Request body: $jsonBody")
            Log.d(TAG, "User-Agent: $userAgent")

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
     * @throws NetworkError.InvalidParameter if a parameter has an invalid value.
     */
    private fun validateParameters(loyaltyboost: String?, creative: String?) {
        if (loyaltyboost != null && !listOf("0", "1", "2").contains(loyaltyboost)) {
            throw NetworkError.InvalidParameter("loyaltyboost must be 0, 1, or 2")
        }
        if (creative != null && !listOf("0", "1").contains(creative)) {
            throw NetworkError.InvalidParameter("creative must be 0 or 1")
        }
    }
} 