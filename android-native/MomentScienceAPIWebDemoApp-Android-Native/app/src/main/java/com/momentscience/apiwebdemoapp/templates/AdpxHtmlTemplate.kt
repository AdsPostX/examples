package com.momentscience.apiwebdemoapp.templates

import android.content.Context
import com.google.gson.Gson
import java.io.BufferedReader
import java.io.InputStreamReader
import android.util.Log
import com.momentscience.apiwebdemoapp.config.AppConfig

/**
 * Template generator for the offers WebView HTML content.
 * Creates HTML that loads the MomentScience SDK for offer prefetching.
 */
object AdpxHtmlTemplate {
    /**
     * Generates the HTML string for the offers screen.
     * Creates a minimal HTML document that loads the MomentScience SDK and configures it.
     *
     * @param sdkId The SDK/account ID to be used in the Adpx config.
     * @param context The Android context to access assets.
     * @param payload Optional payload data to pass to the SDK.
     * @return The complete HTML string to be loaded in the WebView.
     * @throws IllegalArgumentException if context is null
     * @throws java.io.IOException if template file cannot be loaded
     */
    fun generate(
        sdkId: String,
        context: Context,
        payload: Map<String, String>? = null
    ): String {
        // Require context to be non-null
        requireNotNull(context) { "Context must not be null to load HTML from assets" }
        
        // Load HTML template from assets
        val templateContent = readAssetFile(context, "templates/adpx_template.html")
        
        // Add after reading the template file
        Log.d("AdpxHtmlTemplate", "Original template: $templateContent")
        
        // Create payload string if payload is provided
        val gson = Gson()
        val userPayloadJson = if (payload != null) {
            gson.toJson(payload)
        } else {
            "{}"
        }
        
        Log.d("AdpxHtmlTemplate", "User payload JSON: $userPayloadJson")
        
        // Replace placeholders with actual values
        val result = templateContent
            .replace("%%SDK_ID%%", sdkId)
            .replace("%%SDK_CDN_URL%%", AppConfig.SDK_CDN_URL)
            .replace("window.AdpxUser = {};", "window.AdpxUser = $userPayloadJson;")
        
        Log.d("AdpxHtmlTemplate", "Final HTML contains window.AdpxUser: ${result.contains("window.AdpxUser")}")
        Log.d("AdpxHtmlTemplate", "User payload in final HTML: ${result.contains(userPayloadJson)}")
        
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