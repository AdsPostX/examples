import Foundation
import SwiftUI
import UIKit
import WebKit

/// ViewModel for OffersView. Handles the business logic for offers prefetching.
/// Responsible for:
/// - Managing UI state for the offers screen
/// - Handling API prefetch requests via NetworkService
/// - Generating HTML for WebSDK prefetch
/// - Processing responses from both prefetch methods
/// - Determining when to show the checkout button
@MainActor
class OffersViewModel: ObservableObject {
    // MARK: - Published Properties
    
    /// Controls the loading indicator visibility during network operations.
    @Published var isLoading = false
    
    /// Holds error messages to be displayed in the UI when operations fail.
    @Published var error: String?
    
    /// Controls whether the navigation to checkout screen should be enabled.
    @Published var showCheckout = false
    
    /// The SDK ID entered by the user, prefilled with a demo value.
    @Published var sdkId: String = AppConfig.API.defaultSDKId
    
    /// User payload for customization options (optional)
    @Published var userPayload: [String: String]? = [
        "user_id": "12345",
        "email": "demo@example.com",
        "themeId": "theme1", // make sure to pass the themeId
        "session_id": UUID().uuidString
    ]
    
    /// Stores the latest offers API response or WebSDK response for passing to checkout.
    @Published var momentsAPIResponse: [String: Any]?
    
    /// Tracks which prefetch mode is active (API or WebSDK) to affect UI state.
    @Published var prefetching: WebPageLoadMode? = nil
    
    /// Unique identifier for the WebView to force recreation when needed.
    @Published var webViewId = UUID()
    
    /// Controls visibility of the hidden WebView used for WebSDK prefetching.
    @Published var shouldShowWebView = false
    
    // MARK: - Private Properties
    
    private let networkService = NetworkService.shared
    
    /// A persistent device identifier for tracking and API calls.
    private let adpxFp = UIDevice.current.identifierForVendor?.uuidString ?? UUID().uuidString
    
    /// Base URL for loading HTML content
    let baseURL = AppConfig.WebView.baseURL
    
    // MARK: - Computed Properties
    
    /// Returns the user agent string for the current device.
    private var userAgent: String {
        (WKWebView().value(forKey: "userAgent") as? String) ?? "unknown"
    }
    
    /// Returns the number of offers in the current response.
    var offersCount: Int {
        guard let data = momentsAPIResponse?["data"] as? [String: Any],
              let offers = data["offers"] as? [[String: Any]] else {
            return 0
        }
        return offers.count
    }
    
    /// Returns true if there are any offers available.
    var hasOffers: Bool {
        return offersCount > 0
    }
    
    /// Returns true if the API prefetch button should be enabled.
    var isAPIPrefetchButtonEnabled: Bool {
        return !sdkId.isEmpty && prefetching != .prefetchWebSDK
    }
    
    /// Returns true if the WebSDK prefetch button should be enabled.
    var isWebSDKPrefetchButtonEnabled: Bool {
        return !sdkId.isEmpty && prefetching != .prefetchAPI
    }
    
    /// Returns the API response to pass to the checkout view.
    var checkoutAPIResponse: [String: Any]? {
        return prefetching == .prefetchAPI ? momentsAPIResponse : nil
    }
    
    // MARK: - Public Methods
    
    /// Initiates the API prefetch process.
    func prefetchWithAPI() {
        prefetching = .prefetchAPI
        Task {
            await fetchOffers()
        }
    }
    
    /// Initiates the WebSDK prefetch process.
    func prefetchWithWebSDK() {
        prefetching = .prefetchWebSDK
        isLoading = true
        webViewId = UUID()
        shouldShowWebView = true
    }
    
    /// Fetches offers from the API using the current SDK ID.
    /// Updates state properties to reflect loading, errors, and results.
    func fetchOffers() async {
        guard !sdkId.isEmpty else {
            error = "Please enter an SDK ID"
            return
        }
        
        isLoading = true
        error = nil
        showCheckout = false  // Reset showCheckout when starting a new fetch
        
        do {
            // Call the network service to fetch offers
            let response = try await networkService.fetchOffers(
                sdkId: sdkId,
                ua: userAgent,
                placement: nil,
                ip: nil,
                adpxFp: adpxFp,
                dev: "1",
                subid: nil,
                pubUserId: adpxFp,
                payload: userPayload,
                loyaltyboost: nil,
                creative: nil
            )
            momentsAPIResponse = response
            showCheckout = hasOffers
        } catch {
            // Handle any errors from the API call
            self.error = error.localizedDescription
            showCheckout = false
        }
        
        isLoading = false
    }

    /// Handles the response from the WebSDK prefetch.
    /// Updates state and determines if the checkout button should be shown.
    /// - Parameter response: The response dictionary from the WebSDK.
    func handleWebSDKResponse(_ response: [String: Any]) {
        momentsAPIResponse = response
        isLoading = false
        if let data = response["data"] as? [String: Any],
           let offers = data["offers"] as? [[String: Any]],
           !offers.isEmpty {
            showCheckout = true
        } else {
            showCheckout = false
        }
    }

    /// Resets all state except the SDK ID (used when returning to OffersView).
    /// This is called when the user navigates back to the offers screen.
    func reset() {
        momentsAPIResponse = nil
        error = nil
        showCheckout = false
        isLoading = false
        prefetching = nil
        shouldShowWebView = false
    }

    /// Generates HTML content for the WebSDK prefetch WebView by loading from a template file
    /// - Throws: HTMLTemplateError if the template can't be found or loaded
    func generatePrefetchHTML() throws -> String {
        guard let htmlPath = Bundle.main.path(forResource: "prefetch_template", ofType: "html") else {
            print("HTML template not found")
            throw HTMLTemplateError.templateNotFound
        }
        
        do {
            // Load HTML content from file
            var htmlContent = try String(contentsOfFile: htmlPath, encoding: .utf8)
            
            // Replace placeholder with actual SDK ID
            let escapedSdkId = sdkId.replacingOccurrences(of: "'", with: "\\'")
            htmlContent = htmlContent.replacingOccurrences(of: "{{SDK_ID}}", with: escapedSdkId)
            
            // Create JSON string for userPayload if available
            if let payload = userPayload, !payload.isEmpty {
                let payloadData = try JSONSerialization.data(withJSONObject: payload)
                let payloadJsonString = String(data: payloadData, encoding: .utf8) ?? "{}"
                let escapedPayload = payloadJsonString.replacingOccurrences(of: "'", with: "\\'")
                
                // Replace AdpxUser placeholder with actual payload
                htmlContent = htmlContent.replacingOccurrences(of: "window.AdpxUser = {}", with: "window.AdpxUser = \(escapedPayload)")
            }
            
            // Replace LAUNCHER_SCRIPT_URL placeholder with actual launcher script URL
            htmlContent = htmlContent.replacingOccurrences(
                of: "{{LAUNCHER_SCRIPT_URL}}",
                with: AppConfig.WebView.launcherScriptURL
            )
            
            return htmlContent
        } catch {
            print("Error loading HTML template: \(error.localizedDescription)")
            throw HTMLTemplateError.failedToLoadTemplate(error)
        }
    }
}
