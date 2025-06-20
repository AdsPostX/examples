package com.momentscience.android.msapidemoapp

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
import com.momentscience.android.msapidemoapp.ui.components.OfferContainerView
import com.momentscience.android.msapidemoapp.ui.viewmodel.OffersUiState
import com.momentscience.android.msapidemoapp.ui.viewmodel.OffersViewModel
import com.momentscience.android.msapidemoapp.model.OffersStyles

/**
 * A composable that manages the display and interaction of offers content.
 * This screen handles the complete lifecycle of offers presentation including
 * loading, error states, and successful offer display.
 *
 * Features:
 * - Automatic offer loading on screen appearance
 * - Loading state indication with progress spinner
 * - Error handling with retry capability
 * - External URL navigation handling
 * - Offer navigation and interaction
 * - Screen dismissal handling
 * - Development mode support
 * - Custom payload support
 *
 * State Management:
 * - Observes ViewModel state for offers content
 * - Handles navigation events for external URLs
 * - Manages close events and screen dismissal
 * - Tracks loading and error states
 *
 * UI States:
 * - Loading: Shows progress indicator
 * - Error: Displays error message with retry option
 * - Success: Renders offer content with navigation
 *
 * Navigation:
 * - Handles external URL opening
 * - Manages screen dismissal
 * - Controls offer navigation
 *
 * @param viewModel The [OffersViewModel] instance that manages business logic and state.
 *                 Expected to provide offer data and handle user interactions.
 *
 * @param apiKey The authentication key used to fetch offers from the API.
 *               This key is used when the screen first appears.
 *
 * @param isDevelopment Whether to use development mode for API calls.
 *                     Defaults to false for production environment.
 *
 * @param payload Additional parameters to be sent with the offers request.
 *                Defaults to an empty map if no additional parameters are needed.
 *
 * @param onClose Callback function invoked when the screen should be dismissed.
 *                Called after handling cleanup in the ViewModel.
 *
 * @param modifier Optional [Modifier] for customizing the screen's layout.
 *                Applied to the root Surface composable.
 *
 * Usage Example:
 * ```
 * OffersScreen(
 *     viewModel = offersViewModel,
 *     apiKey = "your-api-key",
 *     isDevelopment = false,
 *     payload = mapOf("userId" to "123", "source" to "home"),
 *     onClose = { navigateBack() },
 *     modifier = Modifier.fillMaxSize()
 * )
 * ```
 */
@Composable
fun OffersScreen(
    viewModel: OffersViewModel,
    apiKey: String,
    isDevelopment: Boolean = false,
    payload: Map<String, String> = emptyMap(),
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Collect state flows from ViewModel
    val uiState by viewModel.uiState.collectAsState()
    val navigationEvent by viewModel.navigationEvent.collectAsState()
    val closeEvent by viewModel.closeEvent.collectAsState()
    
    // Get theme and context
    val backgroundColor = MaterialTheme.colorScheme.background
    val context = LocalContext.current

    // Handle external URL navigation events
    LaunchedEffect(navigationEvent) {
        navigationEvent?.let { uri ->
            // Create and launch intent for external URL
            val intent = Intent(Intent.ACTION_VIEW, uri)
            context.startActivity(intent)
            // Clear the navigation event to prevent duplicate handling
            viewModel.clearNavigationEvent()
        }
    }

    // Handle screen dismissal events
    LaunchedEffect(closeEvent) {
        if (closeEvent) {
            // Clear the event and dismiss the screen
            viewModel.clearCloseEvent()
            onClose()
        }
    }

    // Initial offers loading when screen appears
    LaunchedEffect(apiKey) {
        viewModel.fetchOffers(
            apiKey = apiKey,
            isDevelopment = isDevelopment,
            payload = payload,
            creative = "0",
            loyaltyBoost = "0"
        )
    }

    // Root surface with background color and z-index
    Surface(
        modifier = modifier
            .fillMaxSize()
            .zIndex(1f),  // Ensure offers content appears above other UI
        color = backgroundColor
    ) {
        // Content container
        Box(
            modifier = Modifier.fillMaxSize()
        ) {
            // Handle different UI states
            when (uiState) {
                // Loading state with centered progress indicator
                is OffersUiState.Loading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                
                // Error state with message and action buttons
                is OffersUiState.Error -> {
                    val error = (uiState as OffersUiState.Error).message
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .align(Alignment.Center)
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // Error message
                        Text(
                            text = error,
                            style = MaterialTheme.typography.bodyLarge,
                            textAlign = TextAlign.Center
                        )
                        
                        // Action buttons row
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterHorizontally)
                        ) {
                            // Close button with error color
                            Button(
                                onClick = { viewModel.clearCloseEvent(); onClose() },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = MaterialTheme.colorScheme.error
                                )
                            ) {
                                Text("Close")
                            }
                            
                            // Retry button
                            Button(
                                onClick = { viewModel.fetchOffers(apiKey) }
                            ) {
                                Text("Try Again")
                            }
                        }
                    }
                }
                
                // Success state with offer content
                is OffersUiState.Success -> {
                    val state = uiState as OffersUiState.Success
                    val currentOffer = state.currentOffer
                    
                    if (currentOffer != null) {
                        // Render offer container with navigation and interaction handlers
                        OfferContainerView(
                            offers = state.offers.data?.offers ?: emptyList(),
                            styles = state.offers.data?.styles ?: OffersStyles(),
                            currentOfferIndex = state.currentOfferIndex,
                            onClose = {
                                currentOffer.let { viewModel.onClose(it) }
                            },
                            onPositiveClick = { offer ->
                                viewModel.onPositiveClick(offer)
                            },
                            onNegativeClick = { offer ->
                                viewModel.onNegativeClick(offer)
                            },
                            onPreviousClick = {
                                viewModel.moveToPreviousOffer()
                            },
                            onNextClick = {
                                viewModel.moveToNextOffer()
                            }
                        )
                    } else {
                        // No valid offer to display, dismiss the screen
                        onClose()
                    }
                }
            }
        }
    }
} 