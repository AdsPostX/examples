import Foundation
import SwiftUI

/// OffersViewModel.swift
/// A view model that manages the business logic and state for the Moments offers presentation.
/// Implements the MVVM pattern to separate business logic from view logic.
///
/// Key responsibilities:
/// - Managing the offers loading state and error handling
/// - Controlling offer navigation (previous/next)
/// - Handling offer tracking and beacon firing
/// - Managing UI state and styling based on API response
/// - Coordinating user interactions with the offers service
///
/// The view model is marked with @MainActor to ensure all UI updates
/// happen on the main thread.
///
/// Usage:
/// ```swift
/// let viewModel = OffersViewModel(service: offersService)
/// await viewModel.loadOffers(apiKey: "your-api-key")
/// ```
@MainActor
class OffersViewModel: ObservableObject {
    /// The current collection of offers from the API
    @Published private(set) var offers: [Offer] = []
    /// Index of the currently displayed offer
    @Published private(set) var currentOfferIndex: Int = 0
    /// Indicates whether offers are being loaded
    @Published private(set) var isLoading = false
    /// Error message if any operation fails
    @Published private(set) var error: String?
    /// UI styles received from the API response
    @Published private(set) var styles: OffersStyles?
    /// Current API key used for requests
    private var apiKey: String
    
    /// Service instance for handling API operations
    private let offersService: OffersService
    
    /// Initializes the view model with an offers service
    /// - Parameter service: The service instance to use for API operations
    init(service: OffersService) {
        self.offersService = service
        self.apiKey = ""
    }
    
    /// Updates the API key and resets the offers state
    /// - Parameter newApiKey: The new API key to use for future requests
    func updateApiKey(_ newApiKey: String) {
        self.apiKey = newApiKey
        // Reset state when API key changes
        self.offers = []
        self.currentOfferIndex = 0
        self.error = nil
        self.styles = nil
    }
    
    /// Loads offers using the stored or provided API key
    /// - Parameters:
    ///   - apiKey: Optional API key to use for this request
    ///   - isDevelopment: Whether to run in development mode (default: false)
    /// - Note: If no API key is provided, uses the stored API key
    func loadOffers(apiKey: String? = nil, isDevelopment: Bool = false, payload: [String: String]? = nil) {
        // If a new API key is provided, update it
        if let newApiKey = apiKey {
            updateApiKey(newApiKey)
        }
        
        // Validate that we have an API key
        guard !self.apiKey.isEmpty else {
            self.error = "API key is required"
            return
        }
        
        Task {
            do {
                self.isLoading = true
                self.error = nil
                
                let response = try await self.offersService.fetchOffers(apiKey: self.apiKey, isDevelopment: isDevelopment, payload: payload)
                self.offers = response.data?.offers ?? []
                self.styles = response.data?.styles
                self.currentOfferIndex = 0
                
                self.isLoading = false
                
                // Fire pixel request for the first offer
                firePixelRequestForCurrentOffer()
            } catch OffersError.noOffers {
                self.error = "No offers available"
            } catch OffersError.invalidURL {
                self.error = "Invalid URL configuration"
            } catch OffersError.decodingError {
                self.error = "Error processing response"
            } catch {
                self.error = "An unexpected error occurred"
            }
            isLoading = false
        }
    }
    
    /// Gets the appropriate font for CTA buttons based on API styles
    /// - Returns: SwiftUI Font configured with the correct size and weight
    /// - Note: Defaults to system font size 13 if not specified in styles
    func getButtonFont() -> Font {
        // Parse font size
        let sizeString = styles?.offerText?.ctaTextSize ?? "13px"
        let size = Double(sizeString.replacingOccurrences(of: "px", with: "")) ?? 13.0
        
        // Get font style
        let style = styles?.offerText?.ctaTextStyle?.lowercased() ?? "normal"
        
        // Create font with weight
        switch style {
        case "bold":
            return .system(size: size, weight: .bold)
        case "medium":
            return .system(size: size, weight: .medium)
        case "semibold":
            return .system(size: size, weight: .semibold)
        case "light":
            return .system(size: size, weight: .light)
        default:
            return .system(size: size, weight: .regular)
        }
    }
    
    /// Gets the font for the offer description text
    /// - Returns: SwiftUI Font with size from API or default
    /// - Note: Defaults to system font size 16 if not specified
    func getDescriptionFont() -> Font {
        // Get font size from API response, default to 16 if not specified
        let size = CGFloat(styles?.offerText?.fontSize ?? 16)
        return .system(size: size)
    }
    
    /// Gets the color for the offer description text
    /// - Returns: SwiftUI Color from API or default black
    func getDescriptionTextColor() -> Color {
        return Color(hexString: styles?.offerText?.textColor ?? "#000000")
    }
    
    /// Gets the color for the popup background
    /// - Returns: SwiftUI Color from API or default overlay color
    func getPopupBackgroundColor() -> Color {
        return styles?.popup?.background.map { Color(hexString: $0) } ?? Color.momentsOverlay
    }
    
    /// The currently displayed offer
    var currentOffer: Offer? {
        guard !offers.isEmpty, currentOfferIndex < offers.count else { return nil }
        return offers[currentOfferIndex]
    }
    
    /// Indicates if there is a previous offer available
    var hasPreviousOffer: Bool {
        currentOfferIndex > 0
    }
    
    /// Indicates if there is a next offer available
    var hasNextOffer: Bool {
        currentOfferIndex < offers.count - 1
    }
    
    /// Navigates to the previous offer if available
    /// - Note: Also triggers pixel request for the newly displayed offer
    func showPreviousOffer() {
        guard hasPreviousOffer else { return }
        Task { @MainActor in
            currentOfferIndex -= 1
            // Ensure pixel request fires after state update
            await Task.yield()
            firePixelRequestForCurrentOffer()
        }
    }
    
    /// Navigates to the next offer if available
    /// - Note: Also triggers pixel request for the newly displayed offer
    func showNextOffer() {
        guard hasNextOffer else { return }
        Task { @MainActor in
            currentOfferIndex += 1
            // Ensure pixel request fires after state update
            await Task.yield()
            firePixelRequestForCurrentOffer()
        }
    }
    
    /// Fires pixel request for the current offer
    /// - Note: Called automatically when navigating between offers
    private func firePixelRequestForCurrentOffer() {
        guard let offer = currentOffer,
              let pixelUrl = offer.pixel,
              !pixelUrl.isEmpty,
              let url = URL(string: pixelUrl) else {
            return
        }
        
        Task {
            do {
                try await offersService.fireBeaconRequest(url: url)
            } catch {
                print("Pixel request failed: \(error.localizedDescription)")
            }
        }
    }
    
    /// Fires a beacon request to the specified URL
    /// - Parameter url: The beacon URL to send the request to
    /// - Note: Used for tracking various user interactions
    func fireBeaconRequest(url: URL) {
        Task {
            do {
                try await offersService.fireBeaconRequest(url: url)
            } catch {
                print("Beacon request failed: \(error.localizedDescription)")
            }
        }
    }
    
    /// Fires close beacon request for the current offer if available
    /// - Note: Should be called when the user closes the offers view
    func fireCloseBeacon() async {
        guard let offer = currentOffer,
              let beacons = offer.beacons,
              let closeUrl = beacons.close,
              !closeUrl.isEmpty,
              let url = URL(string: closeUrl) else {
            return
        }
        
        do {
            try await offersService.fireBeaconRequest(url: url)
        } catch {
            print("Close beacon request failed: \(error.localizedDescription)")
        }
    }
    
    func getUserAgent() -> String {
        // Returns a standardized user agent string for API requests
        return offersService.getUserAgent()
    }
}
