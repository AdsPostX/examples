package com.momentscience.apiwebdemoapp.ui

import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebView.setWebContentsDebuggingEnabled
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.Button
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Scaffold
import androidx.compose.material.Text
import androidx.compose.material.TextField
import androidx.compose.material.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.google.gson.JsonElement
import com.momentscience.apiwebdemoapp.viewmodels.OffersViewModel
import androidx.compose.runtime.DisposableEffect
import com.momentscience.apiwebdemoapp.PrefetchMode
import com.momentscience.apiwebdemoapp.interfaces.AdpxJavaScriptInterface
import com.momentscience.apiwebdemoapp.config.AppConfig

/**
 * Composable for the offers screen that displays input for SDK ID and prefetch options.
 * Manages a WebView for prefetching offers data and provides navigation to checkout.
 * 
 * @param onNavigateToCheckout Callback for navigating to the checkout screen.
 * @param viewModel ViewModel for managing offers data and state.
 */
@Composable
fun OffersView(
    onNavigateToCheckout: (String, JsonElement?, Boolean) -> Unit,
    viewModel: OffersViewModel
) {
    // Collect state from the ViewModel
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()
    val jsonResponse by viewModel.jsonResponse.collectAsState()
    val showCheckout by viewModel.showCheckout.collectAsState()
    val offerCount by viewModel.offerCount.collectAsState()
    val viewModelSdkId by viewModel.sdkId.collectAsState()
    var localSdkId by remember { mutableStateOf(AppConfig.DEFAULT_SDK_ID) }
    val keyboardController = LocalSoftwareKeyboardController.current
    val context = LocalContext.current
    
    // Collect prefetch mode from ViewModel
    val prefetchMode by viewModel.prefetchMode.collectAsState()

    // Create and configure WebView instance
    val webViewInstance = remember { 
        WebView(context).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true                                    
                setWebContentsDebuggingEnabled(true) // For debugging only
            }
            
            setBackgroundColor(android.graphics.Color.TRANSPARENT)
            background = null
            visibility = android.view.View.INVISIBLE
            
            // Configure WebView client for page loading events
            webViewClient = object : WebViewClient() {
                override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                    super.onPageStarted(view, url, favicon)
                    viewModel.setWebViewLoading(true)
                }

                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    view?.visibility = android.view.View.VISIBLE
                    viewModel.setWebViewLoading(false)
                }

                override fun onReceivedError(
                    view: WebView?,
                    request: WebResourceRequest?,
                    error: WebResourceError?
                ) {
                    super.onReceivedError(view, request, error)
                    view?.visibility = android.view.View.VISIBLE
                    viewModel.setWebViewLoading(false)
                }
            }
            
            // Add JavaScript interface for communication with WebView
            addJavascriptInterface(
                AdpxJavaScriptInterface { event, payload -> 
                    viewModel.handleAdpxCallback(event, payload)
                },
                "Android"
            )
        }
    }

    // Track WebView state
    var isWebViewInitialized by remember { mutableStateOf(false) }

    // Clean up WebView on disposal
    DisposableEffect(Unit) {
        onDispose {
            try {
                if (isWebViewInitialized) {
                    webViewInstance.destroy()
                    isWebViewInitialized = false
                }
            } catch (e: Exception) {
                println(e.toString())
            }
        }
    }

    // Set default SDK ID when composable is first created
    LaunchedEffect(Unit) {
        viewModel.setSdkId(AppConfig.DEFAULT_SDK_ID)
    }

    // Sync local SDK ID with ViewModel's SDK ID
    LaunchedEffect(viewModelSdkId) {
        localSdkId = viewModelSdkId
    }

    // Reset state when the composable is first created
    LaunchedEffect(Unit) {
        viewModel.resetState()
    }

    // UI scaffold with top app bar
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Offers") }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .clickable { keyboardController?.hide() }
        ) {
            // Main content column
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // SDK ID input field
                TextField(
                    value = localSdkId,
                    onValueChange = { 
                        localSdkId = it
                        viewModel.setSdkId(it)
                    },
                    label = { Text("SDK ID") },
                    modifier = Modifier.fillMaxWidth()
                )
                
                // API prefetch section
                Text("Prefetch with API will call native API first and its response will be sent to websdk on 2nd screen")
                Button(
                    onClick = { 
                        keyboardController?.hide()
                        viewModel.fetchOffers(localSdkId)
                    },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = localSdkId.isNotBlank() && prefetchMode != PrefetchMode.WEB
                ) {
                    Text("Prefetch with API")
                }
                
                // WebSDK prefetch section
                Text("Prefetch with WebSDK will load websdk with 0 x 0 webview on this screen first, web sdk will save response locally and when we use web sdk again on 2nd screen to display, that saved response will be used. once offers are displayed saved response will be deleted locally")
                Button(
                    onClick = { 
                        if (!isWebViewInitialized) {
                            isWebViewInitialized = true
                        }
                        webViewInstance.visibility = android.view.View.VISIBLE
                        viewModel.setWebViewLoading(true)
                        viewModel.setPrefetchMode(PrefetchMode.WEB)
                        try {
                            webViewInstance.loadDataWithBaseURL(
                                viewModel.getBaseUrl(),
                                viewModel.getHtmlContent(localSdkId, context),
                                "text/html",
                                "UTF-8",
                                null
                            )
                        } catch (e: Exception) {
                            viewModel.setError("Failed to load HTML template: ${e.message}")
                            isWebViewInitialized = false
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = localSdkId.isNotBlank() && prefetchMode != PrefetchMode.API
                ) {
                    Text("Prefetch with WebSDK")
                }

                // Error message display
                if (error != null) {
                    Text(
                        text = "Error: $error",
                        color = MaterialTheme.colors.error,
                        textAlign = TextAlign.Center
                    )
                }
            }

            // Hidden WebView container (0dp size)
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .size(0.dp)
                    .background(Color.Transparent)
            ) {
                AndroidView(
                    modifier = Modifier.size(0.dp),
                    factory = { webViewInstance },
                    update = { /* No updates needed */ }
                )
            }

            // Loading indicator overlay
            if (isLoading || viewModel.isWebViewLoading.collectAsState().value) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.3f)),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(
                        color = MaterialTheme.colors.primary,
                        modifier = Modifier.size(48.dp)
                    )
                }
            }

            // Checkout section at the bottom of the screen
            if (showCheckout && localSdkId.isNotBlank()) {
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Offers count display
                    Text(
                        text = "$offerCount offers available",
                        style = MaterialTheme.typography.h6,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth()
                    )
                    
                    // Checkout navigation button
                    Button(
                        onClick = { 
                            keyboardController?.hide()
                            onNavigateToCheckout(localSdkId, jsonResponse, prefetchMode == PrefetchMode.API)
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Proceed to Checkout")
                    }
                }
            }
        }
    }
} 