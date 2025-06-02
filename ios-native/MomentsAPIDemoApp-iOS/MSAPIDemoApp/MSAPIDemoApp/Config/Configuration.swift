//
//  Configuration.swift
//  MSAPIDemoApp
//
//  Created by shivang vyas on 31/05/25.
//

/// Configuration.swift
/// Manages environment-specific configuration for the MomentsAPI Demo App.
/// This configuration system provides a centralized way to manage environment-specific
/// settings and API endpoints.
///
/// Features:
/// - Environment detection (development vs production)
/// - Base URL configuration for API endpoints
/// - Error handling for missing configuration
///
/// Usage:
/// ```swift
/// do {
///     let baseURL = try Configuration.baseURL
///     // Use baseURL for API requests
/// } catch {
///     // Handle configuration error
/// }
/// ```

import Foundation

/// Manages application configuration and environment variables
enum Configuration {
    /// Represents different environment configurations for the app
    /// Used to determine which set of configuration values to use
    enum Environment {
        /// Development environment for testing and debugging
        case development
        /// Production environment for release builds
        case production
        
        /// Current environment setting based on build configuration
        /// Returns .development for DEBUG builds and .production for RELEASE builds
        static var current: Environment {
            #if DEBUG
            return .development
            #else
            return .production
            #endif
        }
    }
    
    /// Configuration error types that can occur when accessing configuration values
    enum ConfigurationError: Error {
        /// Indicates that a required configuration key is missing
        /// - Parameter String: The name of the missing configuration key
        case missingKey(String)
    }
    
    /// Retrieves the base URL from configuration
    /// The base URL is used for all API requests in the application
    ///
    /// The URL is read from the following locations in order:
    /// 1. Bundle.main.object(forInfoDictionaryKey:) - Direct access
    /// 2. Bundle.main.infoDictionary - Fallback method
    ///
    /// - Returns: The configured base URL string
    /// - Throws: ConfigurationError.missingKey if the base URL is not found
    static var baseURL: String {
        get throws {
            // Try reading directly from the bundle
            if let baseURL = Bundle.main.object(forInfoDictionaryKey: "ADSPOSTX_BASE_URL") as? String {
                return baseURL
            }
            
            // Fallback to reading from infoDictionary
            guard let baseURL = Bundle.main.infoDictionary?["ADSPOSTX_BASE_URL"] as? String else {
                #if DEBUG
                print("Failed to find ADSPOSTX_BASE_URL in configuration")
                #endif
                throw ConfigurationError.missingKey("ADSPOSTX_BASE_URL")
            }
            return baseURL
        }
    }
}
