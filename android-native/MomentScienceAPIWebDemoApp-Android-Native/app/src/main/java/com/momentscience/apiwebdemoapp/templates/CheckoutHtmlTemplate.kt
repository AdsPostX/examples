package com.momentscience.apiwebdemoapp.templates

import android.content.Context
import com.google.gson.Gson
import com.google.gson.JsonElement
import java.io.BufferedReader
import java.io.InputStreamReader
import android.util.Log
import com.momentscience.apiwebdemoapp.config.AppConfig

/**
 * Template generator for the checkout WebView HTML content.
 */
object CheckoutHtmlTemplate {
    /**
     * Generates the HTML for the checkout screen with MomentScience SDK.
     */
    fun generate(
        sdkId: String,
        offersCount: Int,
        jsonResponse: JsonElement?,
        isFromAPIPrefetch: Boolean = false,
        context: Context,
        payload: Map<String, String>? = null
    ): String {
        // Require context to be non-null
        requireNotNull(context) { "Context must not be null to load HTML from assets" }
        
        // Load HTML template from assets
        val templateContent = readAssetFile(context, "templates/checkout_template.html")
        
        // Set auto load configuration based on prefetch mode
        val autoLoadConfig = if (isFromAPIPrefetch) {
            "autoLoad: false"
        } else {
            "prefetch: true, autoLoad: true"
        }
        
        // Create payload string if payload is provided
        val userPayloadJson = if (payload != null) {
            val gson = Gson()
            gson.toJson(payload)
        } else {
            "{}"
        }
        
        // Set response handling based on prefetch mode
        val responseHandling = if (isFromAPIPrefetch) {
            """
            try {
                const responseData = ${jsonResponse?.toString() ?: "{}"};
                if (responseData && typeof responseData === 'object') {
                    setTimeout(() => window.Adpx.setApiResponse(responseData), 100);
                }
            } catch (error) {
                console.error('Error parsing response: ' + error.message);
            }
            """
        } else {
            "console.log('Adpx initialized successfully');"
        }
        
        // Add logging before replacement
        Log.d("CheckoutHtmlTemplate", "Template content: $templateContent")
        Log.d("CheckoutHtmlTemplate", "User payload JSON: $userPayloadJson")

        val result = templateContent
            .replace("%%SDK_ID%%", sdkId)
            .replace("%%OFFERS_COUNT%%", offersCount.toString())
            .replace("%%AUTOLOAD_CONFIG%%", autoLoadConfig)
            .replace("%%RESPONSE_HANDLING%%", responseHandling)
            .replace("window.AdpxUser = {};", "window.AdpxUser = $userPayloadJson;")
            .replace("%%SDK_CDN_URL%%", AppConfig.SDK_CDN_URL)

        // Log the result to verify replacement
        Log.d("CheckoutHtmlTemplate", "Final HTML: $result")

        return result
    }
    
    /**
     * Reads the content of a file from assets.
     *
     * @param context The Android context to access assets.
     * @param filePath The path to the file in assets.
     * @return The content of the file as a string.
     * @throws java.io.IOException if file cannot be read
     */
    private fun readAssetFile(context: Context, filePath: String): String {
        val inputStream = context.assets.open(filePath)
        val reader = BufferedReader(InputStreamReader(inputStream))
        val stringBuilder = StringBuilder()
        var line: String?
        
        while (reader.readLine().also { line = it } != null) {
            stringBuilder.append(line)
            stringBuilder.append('\n')
        }
        
        reader.close()
        return stringBuilder.toString()
    }
}