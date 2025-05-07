//
//  AppConfig.swift
//  MomentsAPIWebDemoApp
//
//  Created by shivang vyas on 07/05/25.
//

import Foundation

/// Configuration constants for the app
enum AppConfig {
    /// API related configuration
    enum API {
        /// Base URL for the offers API endpoint
        static let baseURL = "https://api.adspostx.com/native/v4/offers.json"
        
        /// Default SDK ID for demo purposes
        static let defaultSDKId = "<use_your_sdkid_here>"
    }
    
    /// WebView related configuration
    enum WebView {
        /// Base URL for loading HTML content
        static let baseURL = Bundle.main.bundleURL
        
        /// CDN URL for the WebSDK launcher script
        static let launcherScriptURL = "https://cdn.adspostx.com/launcher.min.js"
    }
}

