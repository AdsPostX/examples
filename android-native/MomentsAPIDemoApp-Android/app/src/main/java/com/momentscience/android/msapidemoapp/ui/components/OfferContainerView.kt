package com.momentscience.android.msapidemoapp.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.NavigateBefore
import androidx.compose.material.icons.filled.NavigateNext
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.momentscience.android.msapidemoapp.model.Offer
import com.momentscience.android.msapidemoapp.model.OffersStyles
import androidx.compose.foundation.background
import androidx.compose.ui.graphics.Color
import androidx.core.graphics.toColorInt

/**
 * A composable container that displays offers in a carousel-like interface with navigation controls.
 * This component manages the presentation of offers including navigation arrows, close button,
 * and the main offer content.
 *
 * Features:
 * - Displays offers in a full-screen container
 * - Provides navigation between multiple offers
 * - Handles safe area insets for better display on different devices
 * - Supports close functionality
 * - Manages offer interaction callbacks
 * - Implements responsive layout
 *
 * Layout Structure:
 * - Top: Close button with safe area padding
 * - Middle: Main offer content (expandable)
 * - Bottom: Navigation controls with safe area padding
 *
 * @param offers List of offers to be displayed in the container. Each offer represents
 *               a single promotional item with its associated content and actions.
 * 
 * @param styles Styling configuration received from the API response. Controls the visual
 *               appearance of the offers including colors, typography, and spacing.
 * 
 * @param currentOfferIndex Zero-based index of the currently displayed offer in the offers list.
 *                         Used to determine navigation state and display the correct offer.
 * 
 * @param onClose Callback invoked when the user clicks the close button. Used to dismiss
 *                the offer container or handle cleanup operations.
 * 
 * @param onPositiveClick Callback invoked when the user clicks the positive CTA (Call-to-Action)
 *                       button on an offer. Receives the clicked [Offer] as a parameter.
 * 
 * @param onNegativeClick Callback invoked when the user clicks the negative CTA button
 *                       on an offer. Receives the clicked [Offer] as a parameter.
 * 
 * @param onPreviousClick Callback invoked when the user clicks the previous navigation button.
 *                       Should handle updating the [currentOfferIndex].
 * 
 * @param onNextClick Callback invoked when the user clicks the next navigation button.
 *                   Should handle updating the [currentOfferIndex].
 * 
 * @param modifier Optional modifier for customizing the container's layout, size, and behavior.
 *                Default is [Modifier].
 *
 * Usage Example:
 * ```
 * OfferContainerView(
 *     offers = listOf(offer1, offer2),
 *     styles = apiStyles,
 *     currentOfferIndex = 0,
 *     onClose = { viewModel.dismissOffers() },
 *     onPositiveClick = { offer -> viewModel.handlePositiveAction(offer) },
 *     onNegativeClick = { offer -> viewModel.handleNegativeAction(offer) },
 *     onPreviousClick = { viewModel.showPreviousOffer() },
 *     onNextClick = { viewModel.showNextOffer() }
 * )
 * ```
 */
@Composable
fun OfferContainerView(
    offers: List<Offer>,
    styles: OffersStyles,
    currentOfferIndex: Int,
    onClose: () -> Unit,
    onPositiveClick: (Offer) -> Unit,
    onNegativeClick: (Offer) -> Unit,
    onPreviousClick: () -> Unit,
    onNextClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Get the current offer safely and determine navigation state
    val currentOffer = offers.getOrNull(currentOfferIndex)
    val hasPreviousOffer = currentOfferIndex > 0
    val hasNextOffer = currentOfferIndex < offers.size - 1

    // Get the default background color from Material theme
    val defaultBackgroundColor = MaterialTheme.colorScheme.background

    // Get background color from styles or fallback to Material theme
    val backgroundColor = remember(styles.popup?.background, defaultBackgroundColor) {
        styles.popup?.background?.let { colorString ->
            runCatching { Color(colorString.toColorInt()) }.getOrNull()
        } ?: defaultBackgroundColor
    }

    // Root column that fills the available space and arranges content vertically
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(backgroundColor),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top section: Close button with safe area handling
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Top))
                .padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            // Close button positioned at the top-end (top-right in LTR layouts)
            IconButton(
                onClick = onClose,
                modifier = Modifier.align(Alignment.TopEnd)
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Close"
                )
            }
        }

        // Middle section: Main offer content
        if (currentOffer != null) {
            OfferView(
                offer = currentOffer,
                styles = styles,
                onPositiveClick = { onPositiveClick(currentOffer) },
                onNegativeClick = { onNegativeClick(currentOffer) },
                modifier = Modifier.weight(1f) // Takes up remaining space
            )
        }

        // Bottom section: Navigation controls with safe area handling
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Bottom))
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Previous offer navigation button
            IconButton(
                onClick = onPreviousClick,
                enabled = hasPreviousOffer // Disabled when at first offer
            ) {
                Icon(
                    imageVector = Icons.Default.NavigateBefore,
                    contentDescription = "Previous offer",
                    tint = if (hasPreviousOffer) {
                        MaterialTheme.colorScheme.primary
                    } else {
                        MaterialTheme.colorScheme.onSurface.copy(alpha = 0.38f) // Dimmed when disabled
                    }
                )
            }

            // Next offer navigation button
            IconButton(
                onClick = onNextClick,
                enabled = hasNextOffer // Disabled when at last offer
            ) {
                Icon(
                    imageVector = Icons.Default.NavigateNext,
                    contentDescription = "Next offer",
                    tint = if (hasNextOffer) {
                        MaterialTheme.colorScheme.primary
                    } else {
                        MaterialTheme.colorScheme.onSurface.copy(alpha = 0.38f) // Dimmed when disabled
                    }
                )
            }
        }
    }
} 