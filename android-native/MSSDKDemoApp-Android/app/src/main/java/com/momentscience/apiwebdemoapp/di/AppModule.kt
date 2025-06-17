package com.momentscience.apiwebdemoapp.di

import com.momentscience.apiwebdemoapp.services.NetworkService
import com.momentscience.apiwebdemoapp.services.NetworkServiceImpl
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import java.util.concurrent.TimeUnit

/**
 * Object that provides application-wide dependencies using lazy initialization.
 * Acts as a simple dependency injection (DI) container for the app.
 * All dependencies are created as lazy singletons.
 */
object AppModule {
    /**
     * Gson instance for JSON serialization/deserialization.
     * Configured to be lenient to handle malformed JSON.
     */
    val gson: Gson by lazy {
        GsonBuilder()
            .setLenient()
            .create()
    }

    /**
     * OkHttpClient instance for making network requests.
     * Configured with logging interceptor and timeout settings.
     */
    val okHttpClient: OkHttpClient by lazy {
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY // Log request and response bodies
        }

        OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor) // Add logging to all requests
            .connectTimeout(30, TimeUnit.SECONDS) // Set connection timeout
            .readTimeout(30, TimeUnit.SECONDS)    // Set read timeout
            .writeTimeout(30, TimeUnit.SECONDS)   // Set write timeout
            .build()
    }

    /**
     * Singleton instance of the NetworkService implementation.
     * Used for making API calls throughout the app.
     */
    val networkService: NetworkService by lazy {
        NetworkServiceImpl()
    }
} 