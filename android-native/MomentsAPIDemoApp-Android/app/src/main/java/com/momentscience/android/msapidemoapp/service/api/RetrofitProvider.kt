package com.momentscience.android.msapidemoapp.service.api

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

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
     * Configured OkHttpClient instance with:
     * - HTTP request/response logging
     * - Common headers for all requests
     * - Default timeouts and settings
     *
     * The client adds these headers to all requests:
     * - Content-Type: application/json
     * - Accept: application/json
     */
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .addInterceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("Content-Type", "application/json")
                .addHeader("Accept", "application/json")
                .build()
            chain.proceed(request)
        }
        .build()

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
        .addConverterFactory(GsonConverterFactory.create())
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