package com.momentscience.apiwebdemoapp.interfaces

import android.util.Log
import android.webkit.JavascriptInterface

/**
 * Typealias for the callback function that handles Adpx events from JavaScript.
 * @param event The name of the event received.
 * @param payload The JSON payload associated with the event.
 */
typealias AdpxCallbackHandler = (event: String, payload: String) -> Unit

/**
 * JavaScript interface that enables communication between the WebView and Android code.
 * Handles callbacks from Adpx JavaScript code running in the WebView.
 * 
 * @param callbackHandler Optional handler to process events and payloads.
 */
class AdpxJavaScriptInterface(
    private val callbackHandler: AdpxCallbackHandler? = null
) {
    /**
     * Method exposed to JavaScript that receives events and payloads from Adpx.
     * Logs the event and delegates to the callback handler if provided.
     * 
     * @param event The name of the event (e.g., "ads_found").
     * @param payload The JSON payload associated with the event.
     */
    @JavascriptInterface
    fun adpxCallback(event: String, payload: String) {
        Log.d("AdpxJavaScriptInterface", "Event: $event, Payload: $payload")
        callbackHandler?.invoke(event, payload)
    }
}