package com.momentscience.apiwebdemoapp.utils

/**
 * Utility class for handling User-Agent related operations.
 */
object UserAgentUtil {
    /**
     * Returns a standard Chrome Android user agent string.
     * this is just example user agent string, you can use your own dynamic user agent string
     * 
     * @return The Chrome Android user agent string.
     */
    fun getUserAgent(): String {
        return "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36"
    }
} 