package com.momentscience.android.msapidemoapp.util

/**
 * Utility extensions for color-related operations.
 * This file contains reusable color manipulation functions used across the app.
 */

/**
 * Extension function to convert short hex color codes to full hex format.
 * For example, converts "#RGB" to "#RRGGBB".
 * 
 * @return The full hex color code. If the input is not a short hex code,
 *         returns the original string unchanged.
 */
fun String.toValidHex(): String {
    return if (this.length == 4 && this.startsWith("#")) {
        // Convert #RGB to #RRGGBB
        "#${this[1]}${this[1]}${this[2]}${this[2]}${this[3]}${this[3]}"
    } else {
        this
    }
} 