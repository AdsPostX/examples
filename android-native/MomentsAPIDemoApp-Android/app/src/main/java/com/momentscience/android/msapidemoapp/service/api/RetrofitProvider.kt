package com.momentscience.android.msapidemoapp.service.api

import com.jakewharton.retrofit2.converter.kotlinx.serialization.asConverterFactory
import com.momentscience.android.msapidemoapp.BuildConfig
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import java.util.concurrent.TimeUnit

/**
 * Provider class for Retrofit instance and API services.
 * This singleton object manages the configuration and creation of API service instances.
 *
 * Features:
 * - Single instance of Retrofit client
 * - Configured OkHttpClient with logging and headers
 * - JSON conversion using Gson
 * - Centralized API endpoint configuration
 *
 * The provider ensures that:
 * - Only one instance of each service exists
 * - All requests use the same configuration
 * - Network logging is properly configured
 * - Common headers are automatically added
 *
 * Usage:
 * ```kotlin
 * // Get the API instance
 * val api = RetrofitProvider.offersApi
 *
 * // Make API calls
 * val response = api.fetchOffers(...)
 * ```
 */
object RetrofitProvider {
    /**
     * Base URL for the Moments API.
     * All API endpoints will be relative to this URL.
     */
    private const val BASE_URL = "https://api.adspostx.com/native/v4/"
    
    /**
     * Network timeout configurations (in seconds)
     */
    private const val CONNECT_TIMEOUT = 30L // Time to establish connection
    private const val READ_TIMEOUT = 30L    // Time to read response from server
    private const val WRITE_TIMEOUT = 30L   // Time to write request to server

    /**
     * Configure Json serializer
     */
    private val json = Json {
        ignoreUnknownKeys = true // Add this if the API returns fields not in your models
        coerceInputValues = true // Add this to handle null for non-null fields
    }

    /**
     * Configured OkHttpClient instance with:
     * - HTTP request/response logging
     * - Common headers for all requests
     * - Network timeout configurations
     * - Connection pooling and retry settings
     *
     * Timeout Configuration:
     * - Connect Timeout: Maximum time to establish a connection to the server
     * - Read Timeout: Maximum time to read data from the server after connection
     * - Write Timeout: Maximum time to write data to the server
     *
     * The client adds these headers to all requests:
     * - Content-Type: application/json
     * - Accept: application/json
     */
    private val okHttpClient = OkHttpClient.Builder()
        // Configure timeouts to prevent indefinite hanging
        .connectTimeout(CONNECT_TIMEOUT, TimeUnit.SECONDS)
        .readTimeout(READ_TIMEOUT, TimeUnit.SECONDS)
        .writeTimeout(WRITE_TIMEOUT, TimeUnit.SECONDS)
        // Add logging interceptor for debugging (only in debug builds)
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) {
                // In debug builds: Log full request/response for debugging
                HttpLoggingInterceptor.Level.BODY
            } else {
                // In release builds: No logging to protect sensitive data
                HttpLoggingInterceptor.Level.NONE
            }
        })
        // Add common headers to all requests
        .addInterceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("Content-Type", "application/json")
                .addHeader("Accept", "application/json")
                .build()
            chain.proceed(request)
        }
        .build()

    private val contentType = "application/json".toMediaType()

    /**
     * Configured Retrofit instance with:
     * - Base URL configuration
     * - OkHttp client integration
     * - Gson converter for JSON parsing
     *
     * This instance is used to create all API service interfaces.
     */
    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(json.asConverterFactory(contentType))
        .build()

    /**
     * Singleton instance of the OffersApi interface.
     * Created using the configured Retrofit instance.
     *
     * This property ensures that:
     * - Only one instance of the API service exists
     * - All API calls use the same configuration
     * - The instance is lazily created on first use
     */
    val offersApi: OffersApi = retrofit.create(OffersApi::class.java)
} 