package com.momentscience.android.msapidemoapp.ui.theme

import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Centralized dimensions for consistent spacing and sizing across the app.
 * This object defines all hardcoded dimension values to follow the DRY principle
 * and make it easy to maintain consistent UI measurements.
 *
 * Categories:
 * - Image sizes
 * - Icon sizes
 * - Button dimensions
 * - Progress indicators
 * - Spacing values
 * - Time delays
 *
 * Usage:
 * ```kotlin
 * import com.momentscience.android.msapidemoapp.ui.theme.Dimensions
 *
 * Modifier.size(Dimensions.OfferImageSize)
 * ```
 */
object Dimensions {
    
    // ====================
    // Image Sizes
    // ====================
    
    /** Size for offer images displayed in the offer view */
    val OfferImageSize: Dp = 200.dp
    
    // ====================
    // Icon Sizes
    // ====================
    
    /** Large icon size (used for loading/error state icons) */
    val IconSizeLarge: Dp = 48.dp
    
    /** Small icon size (used for progress indicators) */
    val IconSizeSmall: Dp = 24.dp
    
    // ====================
    // Button Dimensions
    // ====================
    
    /** Standard button height for better touch targets */
    val ButtonHeight: Dp = 50.dp
    
    // ====================
    // Progress Indicators
    // ====================
    
    /** Stroke width for circular progress indicators */
    val ProgressIndicatorStrokeWidth: Dp = 2.dp
    
    // ====================
    // Spacing
    // ====================
    
    /** Small vertical spacing between related elements */
    val SpacingSmall: Dp = 4.dp
    
    /** Medium vertical spacing between elements */
    val SpacingMedium: Dp = 8.dp
    
    // ====================
    // Time Delays (in milliseconds)
    // ====================
    
    /** Delay before firing close beacon to allow URL to open */
    const val BeaconFireDelayMillis: Long = 500L
}

