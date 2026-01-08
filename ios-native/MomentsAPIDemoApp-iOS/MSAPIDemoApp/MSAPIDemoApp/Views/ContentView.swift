//
//  ContentView.swift
//  MSAPIDemoApp
//
//  Created by shivang vyas on 30/05/25.
//

/// ContentView.swift
/// The main entry point view for the Moments API Demo application.
/// Presents a user interface for API key input and offer loading functionality.
///
/// Key features:
/// - Clean, focused interface for API key management
/// - Input validation for API key
/// - Error handling and user feedback
/// - Full-screen offer presentation
/// - Keyboard handling for better UX
///
/// The view maintains a simple, intuitive layout while providing
/// all necessary functionality for the demo application.
///
/// Usage:
/// ```swift
/// ContentView()
///     .environmentObject(viewModel)
/// ```

import SwiftUI

/// The root view of the application that manages API key input and offer loading
struct ContentView: View {
    /// View model that manages the offers business logic
    @StateObject private var viewModel: OffersViewModel
    /// Controls the presentation of the offers view
    @State private var showOffers = false
    /// Stores the user's API key input
    @State private var apiKey: String = "b167f9d7-c479-41d8-b58f-4a5b26e561f1"
    /// Controls the presentation of error alerts
    @State private var showError: Bool = false
    /// Stores the current error message
    @State private var errorMessage: String = ""
    /// Controls development mode
    @State private var isDevelopment: Bool = false
    
    /// Initializes the view with dependency injection
    /// Uses DependencyContainer to resolve dependencies
    /// - Parameter container: The dependency container (defaults to shared instance)
    /// - Note: Container parameter allows for testing with mock dependencies
    /// - Note: Uses MainActor.assumeIsolated since SwiftUI views are created on the main thread
    init(container: DependencyContainer = .shared) {
        do {
            // SwiftUI views are always created on the main thread, so we can safely assume isolation
            let viewModel = try MainActor.assumeIsolated {
                try container.makeOffersViewModel()
            }
            _viewModel = StateObject(wrappedValue: viewModel)
        } catch {
            // For a demo app, we'll still use fatalError, but log the error
            // In production, you might want to show an error screen instead
            fatalError("Failed to initialize dependencies: \(error)")
        }
    }
    
    var body: some View {
        ZStack {
            // Background with tap gesture to dismiss keyboard
            Color.clear
                .contentShape(Rectangle())
                .onTapGesture {
                    hideKeyboard()
                }
            
            // Main content stack
            VStack(spacing: 20) {
                Text("Enter API Key")
                    .font(.headline)
                
                TextField("API Key", text: $apiKey)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding(.horizontal)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                
                Toggle("Development Mode", isOn: $isDevelopment)
                    .padding(.horizontal)
                
                Button("Load Offers") {
                    handleLoadOffers()
                }
                .disabled(apiKey.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
            .padding()
        }
        .alert("Error", isPresented: $showError) {
            Button("OK") { }
        } message: {
            Text(errorMessage)
        }
        .fullScreenCover(isPresented: $showOffers) {
            OfferContainerView(viewModel: viewModel)
        }
        .onAppear {
            // Initialize view model with default API key
            viewModel.updateApiKey(apiKey)
        }
    }
    
    /// Dismisses the keyboard by resigning first responder
    /// - Note: Uses UIKit functionality to force keyboard dismissal
    private func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
    
    /// Handles the load offers button tap action
    /// Validates the API key and initiates the offer loading process
    /// - Note: Shows error feedback if API key is invalid
    private func handleLoadOffers() {
        let trimmedApiKey = apiKey.trimmingCharacters(in: .whitespacesAndNewlines)
        
        guard !trimmedApiKey.isEmpty else {
            showError(message: "Please enter a valid API key")
            return
        }
        
        let payload: [String: String] = [
            "adpx_fp": UUID().uuidString,
            "pub_user_id": "1234567890",
            "placement": "checkout",
            "ua": viewModel.getUserAgent()
        ]
        
        // Load offers and show the offers view
        viewModel.loadOffers(apiKey: trimmedApiKey, loyaltyBoost: "0", creative: "0", isDevelopment: isDevelopment, payload: payload)
        showOffers = true
    }
    
    /// Displays an error alert with the specified message
    /// - Parameter message: The error message to display to the user
    private func showError(message: String) {
        errorMessage = message
        showError = true
    }
}

#Preview {
    ContentView()
}
