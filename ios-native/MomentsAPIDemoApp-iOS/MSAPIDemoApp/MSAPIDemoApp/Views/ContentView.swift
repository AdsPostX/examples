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
    @State private var apiKey: String = "7c80e6b06365c231"
    /// Controls the presentation of error alerts
    @State private var showError: Bool = false
    /// Stores the current error message
    @State private var errorMessage: String = ""
    /// Controls development mode
    @State private var isDevelopment: Bool = false
    
    /// Initializes the view and its dependencies
    /// - Note: Fails fatally if OffersService cannot be initialized
    init() {
        do {
            let service = try OffersService()
            _viewModel = StateObject(wrappedValue: OffersViewModel(service: service))
        } catch {
            fatalError("Failed to initialize OffersService: \(error)")
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
            "ua": viewModel.getUserAgent()
        ]
        
        // Load offers and show the offers view
        viewModel.loadOffers(apiKey: trimmedApiKey, isDevelopment: isDevelopment, payload: payload)
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
