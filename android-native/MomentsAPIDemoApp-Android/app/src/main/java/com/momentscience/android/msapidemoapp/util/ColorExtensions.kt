package com.momentscience.android.msapidemoapp.util

import androidx.compose.ui.graphics.Color

/**
 * Utility extensions for color-related operations.
 * This file contains reusable color manipulation functions used across the app.
 */

/**
 * Extension function to safely convert a hex color string to a Compose Color.
 * Converts hex strings like "#9CCC65" or "#033012" to Color by parsing as 0xFFRRGGBB.
 * 
 * This function:
 * 1. Removes the '#' prefix and trims whitespace
 * 2. Handles short format (#RGB) by expanding to RRGGBB
 * 3. Prepends 0xFF for full opacity if no alpha channel present
 * 4. Parses as hexadecimal long and converts to Color
 * 5. Returns the default color if any step fails
 * 
 * @param default The fallback color to use if parsing fails
 * @return The parsed Compose Color, or the default color if parsing fails
 * 
 * Usage Example:
 * ```kotlin
 * val backgroundColor = "#FF0000".toComposeColor(Color.White) // Red
 * val shortColor = "#F00".toComposeColor(Color.White) // Red
 * val darkGreen = "#033012".toComposeColor(Color.White) // Dark green
 * val invalidColor = "invalid".toComposeColor(Color.White) // Returns Color.White
 * ```
 */
fun String.toComposeColor(default: Color): Color {
    return runCatching {
        val trimmed = this.trim().removePrefix("#")
        android.util.Log.d("ColorExtensions", "Step 1 - Original: '$this', Trimmed: '$trimmed'")
        
        // Expand short format #RGB to RRGGBB
        val expanded = when (trimmed.length) {
            3 -> {
                // #RGB -> RRGGBB
                trimmed.map { "$it$it" }.joinToString("")
            }
            6, 8 -> trimmed // Already in correct format
            else -> {
                android.util.Log.e("ColorExtensions", "Invalid length: ${trimmed.length}")
                return default
            }
        }
        android.util.Log.d("ColorExtensions", "Step 2 - Expanded: '$expanded'")
        
        // Add alpha channel if not present (6 chars = RRGGBB, 8 chars = AARRGGBB)
        val withAlpha = if (expanded.length == 6) {
            "FF$expanded"
        } else {
            expanded
        }
        android.util.Log.d("ColorExtensions", "Step 3 - With Alpha: '$withAlpha'")
        
        // Parse as hexadecimal long and convert to Color
        val colorLong = withAlpha.toLong(16)
        android.util.Log.d("ColorExtensions", "Step 4 - Long value: $colorLong (0x${colorLong.toString(16).uppercase()})")
        
        val color = Color(colorLong)
        android.util.Log.d("ColorExtensions", "Step 5 - Final Color: red=${color.red}, green=${color.green}, blue=${color.blue}, alpha=${color.alpha}")
        color
    }.getOrElse { e ->
        android.util.Log.e("ColorExtensions", "Error parsing color '$this': ${e.message}", e)
        default
    }
} 