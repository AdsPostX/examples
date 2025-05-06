package com.momentscience.apiwebdemoapp.ui

import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.google.gson.JsonElement
import android.util.Log
import android.webkit.WebView.setWebContentsDebuggingEnabled
import androidx.lifecycle.viewmodel.compose.viewModel
import com.momentscience.apiwebdemoapp.viewmodels.CheckoutViewModel
import com.momentscience.apiwebdemoapp.interfaces.AdpxJavaScriptInterface

/**
 * Composable for the checkout screen that displays offers in a WebView.
 * Manages WebView configuration, loading states, and handles external URL navigation.
 * 
 * @param sdkId The SDK ID for the checkout.
 * @param jsonResponse The JSON response containing offers data.
 * @param isFromAPIPrefetch Whether data was prefetched via API.
 * @param offerCount The number of offers available.
 * @param payload Additional data to be passed to the CheckoutViewModel.
 * @param onBackPressed Callback for back navigation.
 * @param viewModel ViewModel for managing checkout state.
 */
@Composable
fun CheckoutView(
    sdkId: String,
    jsonResponse: JsonElement?,
    isFromAPIPrefetch: Boolean,
    offerCount: Int,
    payload: Map<String, String>? = null,
    onBackPressed: () -> Unit,
    viewModel: CheckoutViewModel = viewModel()
) {
    val context = LocalContext.current
    
    // Collect states from ViewModel
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()
    val htmlContent by viewModel.htmlContent.collectAsState()
    var webView by remember { mutableStateOf<WebView?>(null) }
    var contentLoaded by remember { mutableStateOf(false) }

    // URL handler for opening external links
    val urlHandler = remember {
        object : CheckoutViewModel.UrlHandler {
            override fun openUrl(url: String) {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                context.startActivity(intent)
            }
        }
    }

    // Initialize checkout when component is created
    LaunchedEffect(Unit) {
        viewModel.initializeCheckout(
            sdkId = sdkId,
            jsonResponse = jsonResponse,
            isFromAPIPrefetch = isFromAPIPrefetch,
            offerCount = offerCount,
            context = context,
            payload = payload
        )
        contentLoaded = false
        viewModel.setUrlHandler(urlHandler)
    }

    // UI scaffold with top app bar and back button
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Checkout") },
                navigationIcon = {
                    IconButton(onClick = onBackPressed) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // WebView container
            AndroidView(
                factory = { context ->
                    WebView(context).apply {
                        // Configure WebView settings
                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            setSupportZoom(true)
                            setWebContentsDebuggingEnabled(true) // For debugging only
                        }
                        
                        // Configure WebView client for page events
                        webViewClient = object : WebViewClient() {
                            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                super.onPageStarted(view, url, favicon)
                                viewModel.setLoading(true)
                                Log.d("WebView", "Page loading started")
                            }

                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                viewModel.setLoading(false)
                                contentLoaded = true
                                Log.d("WebView", "Page loading finished")
                            }

                            override fun onReceivedError(
                                view: WebView?,
                                request: WebResourceRequest?,
                                error: WebResourceError?
                            ) {
                                super.onReceivedError(view, request, error)
                                viewModel.setLoading(false)
                                Log.e("WebView", "Error loading page: ${error?.description}")
                            }

                            // Handle external URL navigation
                            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                                if (viewModel.shouldOpenUrlExternally(url)) {
                                    viewModel.handleExternalUrl(url!!)
                                    return true
                                }
                                return false
                            }
                        }
                        
                        // Set WebChromeClient for additional web features
                        webChromeClient = WebChromeClient()
                        
                        // Add JavaScript interface for communication
                        addJavascriptInterface(
                            AdpxJavaScriptInterface(),
                            "Android"
                        )
                    }
                },
                modifier = Modifier.fillMaxSize(),
                update = { view ->
                    webView = view
                    // Load content if not already loaded
                    if (!contentLoaded && htmlContent.isNotEmpty()) {
                        view.loadDataWithBaseURL(
                            viewModel.getBaseUrl(),
                            htmlContent,
                            "text/html",
                            "UTF-8",
                            null
                        )
                    }
                }
            )

            // Loading indicator
            if (isLoading) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }

            // Error message display
            error?.let { errorMessage ->
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(errorMessage)
                }
            }
        }
    }
} 