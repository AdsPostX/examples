/// Color+Constants.swift
/// Extension to SwiftUI Color providing commonly used colors in the app.
/// These colors are used across various views for consistent styling.
///
/// Usage:
/// ```swift
/// Text("Hello")
///     .foregroundColor(.momentsPrimary)
/// ```

import SwiftUI

extension Color {
    /// Primary brand color used for buttons and interactive elements
    static let momentsPrimary = Color(hexString: "#007AFF")
    
    /// Standard white color used for text and backgrounds
    static let momentsWhite = Color(hexString: "#FFFFFF")
    
    /// Default background color for the popup overlay
    static let momentsOverlay = Color(hexString: "#000000")
} 