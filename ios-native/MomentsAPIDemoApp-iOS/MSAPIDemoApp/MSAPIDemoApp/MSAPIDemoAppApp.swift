//
//  MSAPIDemoAppApp.swift
//  MSAPIDemoApp
//
//  Created by shivang vyas on 30/05/25.
//

/// MSAPIDemoAppApp.swift
/// The main application entry point for the Moments API Demo App.
/// This app demonstrates the integration and usage of the Moments Offers API
/// in a SwiftUI-based iOS application.
///
/// Key features:
/// - SwiftUI-based architecture
/// - Clean separation of concerns
/// - Modern iOS app lifecycle
/// - Efficient state management
/// - Responsive UI design
///
/// The app follows SwiftUI best practices and provides a seamless
/// experience for testing and demonstrating the Moments Offers API.
///
/// Usage:
/// ```swift
/// @main
/// struct MSAPIDemoAppApp: App {
///     var body: some Scene {
///         WindowGroup {
///             ContentView()
///         }
///     }
/// }
/// ```

import SwiftUI

/// The main application structure conforming to the SwiftUI App protocol
@main
struct MSAPIDemoAppApp: App {
    /// The scene builder that creates the primary window group
    /// and sets ContentView as the root view
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
