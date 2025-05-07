package com.momentscience.apiwebdemoapp

/**
 * Enum class that defines different modes for prefetching offer data.
 * - NONE: No prefetching is done
 * - API: Prefetch data using native API calls
 * - WEB: Prefetch data using Web SDK
 */
enum class PrefetchMode {
    NONE,
    API,
    WEB
}