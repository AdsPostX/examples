package com.momentscience.android.msapidemoapp.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.momentscience.android.msapidemoapp.model.Offer
import com.momentscience.android.msapidemoapp.model.OffersStyles

/**
 * A composable that renders a single offer with its associated content and styling.
 * This component is responsible for displaying the offer's image, title, description,
 * and call-to-action buttons with proper styling based on the API response.
 *
 * Features:
 * - Responsive layout with centered content
 * - Dynamic text styling based on API configuration
 * - Async image loading with crossfade animation
 * - Customizable button colors and text styles
 * - Fallback handling for missing style properties
 * - Safe color parsing with default values
 *
 * Layout Structure:
 * - Title (if present)
 * - Image with rounded corners
 * - Description text (if present)
 * - Action buttons (Positive and Negative CTAs)
 *
 * Styling Capabilities:
 * - Custom text sizes and colors
 * - Configurable button backgrounds and text colors
 * - Support for italic text style in CTAs
 * - Customizable image size and corner radius
 *
 * @param offer The offer model containing the content to display including title,
 *              description, image URL, and CTA button texts.
 *
 * @param styles Configuration object containing styling properties from the API response.
 *               Includes text sizes, colors, and button styling properties.
 *
 * @param onPositiveClick Callback invoked when the user clicks the positive (primary)
 *                       call-to-action button.
 *
 * @param onNegativeClick Callback invoked when the user clicks the negative (secondary)
 *                       call-to-action button.
 *
 * @param modifier Optional modifier for customizing the layout. Default is [Modifier].
 *
 * Usage Example:
 * ```
 * OfferView(
 *     offer = Offer(
 *         title = "Special Offer",
 *         description = "Limited time discount!",
 *         image = "https://example.com/image.jpg",
 *         ctaYes = "Claim Now",
 *         ctaNo = "Maybe Later"
 *     ),
 *     styles = apiStyles,
 *     onPositiveClick = { handlePositiveAction() },
 *     onNegativeClick = { handleNegativeAction() }
 * )
 * ```
 */
@Composable
fun OfferView(
    offer: Offer,
    styles: OffersStyles,
    onPositiveClick: () -> Unit,
    onNegativeClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Default style values for fallback
    val defaultFontSize = 13.sp
    val defaultTextColor = Color.Black
    val defaultPrimaryColor = Color(0xFF1C64F2) // Blue
    val defaultSurfaceColor = Color.White

    // Get Material theme colors outside of remember
    val defaultOnPrimaryColor = MaterialTheme.colorScheme.onPrimary
    val defaultOnSurfaceColor = MaterialTheme.colorScheme.onSurface

    // Convert CTA text size from pixels to scale-independent pixels
    // Falls back to default size if parsing fails
    val ctaSize = styles.offerText?.ctaTextSize?.replace("px", "")?.toFloatOrNull()?.sp ?: defaultFontSize
    
    // Determine font style for CTA buttons
    // Supports italic style, defaults to normal
    val ctaFontStyle = when (styles.offerText?.ctaTextStyle?.lowercase()) {
        "italic" -> FontStyle.Italic
        else -> FontStyle.Normal
    }
    
    // Parse colors with error handling and fallback values
    // Description text color
    val descriptionColor = try {
        styles.offerText?.textColor?.let { Color(it.toColorInt()) } ?: defaultTextColor
    } catch (e: Exception) {
        defaultTextColor // Fallback on parsing error
    }

    // Positive button background color
    val positiveButtonColor = remember(styles.offerText?.buttonYes?.background) {
        styles.offerText?.buttonYes?.background?.let { colorString ->
            runCatching { Color(colorString.toColorInt()) }.getOrNull()
        } ?: defaultPrimaryColor
    }


    // Negative button background color
    val negativeButtonColor = remember(styles.offerText?.buttonNo?.background) {
        styles.offerText?.buttonNo?.background?.let { colorString ->
            runCatching { Color(colorString.toColorInt()) }.getOrNull()
        } ?: defaultSurfaceColor
    }

    // Positive button text color
    val positiveButtonTextColor = remember(styles.offerText?.buttonYes?.color, defaultOnPrimaryColor) {
        styles.offerText?.buttonYes?.color?.let { colorString ->
            runCatching { Color(colorString.toColorInt()) }.getOrNull()
        } ?: defaultOnPrimaryColor
    }

    // Negative button text color
    val negativeButtonTextColor = remember(styles.offerText?.buttonNo?.color, defaultOnSurfaceColor) {
        styles.offerText?.buttonNo?.color?.let { colorString ->
            runCatching { Color(colorString.toColorInt()) }.getOrNull()
        } ?: defaultOnSurfaceColor
    }

    // Main content column with centered alignment and spacing
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Title section - Only rendered if title exists
        offer.title?.let {
            Text(
                text = it,
                style = MaterialTheme.typography.headlineMedium,
                textAlign = TextAlign.Center
            )
        }

        // Image section with rounded corners and crossfade loading
        AsyncImage(
            model = ImageRequest.Builder(LocalContext.current)
                .data(offer.image)
                .crossfade(true)
                .build(),
            contentDescription = null, // Decorative image
            contentScale = ContentScale.Fit,
            modifier = Modifier
                .size(200.dp)
                .clip(RoundedCornerShape(8.dp))
        )

        // Description section - Only rendered if description exists
        offer.description?.let {
            Text(
                text = it,
                style = TextStyle(
                    fontSize = styles.offerText?.fontSize?.sp ?: defaultFontSize,
                    color = descriptionColor
                ),
                textAlign = TextAlign.Center
            )
        }

        // Call-to-action buttons section
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Primary/Positive action button
            Button(
                onClick = onPositiveClick,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = positiveButtonColor,
                    contentColor = positiveButtonTextColor
                )
            ) {
                offer.ctaYes?.let { 
                    Text(
                        text = it,
                        fontSize = ctaSize,
                        fontStyle = ctaFontStyle,
                    )
                }
            }

            // Secondary/Negative action button
            OutlinedButton(
                onClick = onNegativeClick,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = negativeButtonColor,
                    contentColor = negativeButtonTextColor
                )
            ) {
                offer.ctaNo?.let { 
                    Text(
                        text = it,
                        fontSize = ctaSize,
                        fontStyle = ctaFontStyle
                    )
                }
            }
        }
    }
}