//
//  ColorExtension.swift
//  MSAPIDemoApp
//
//  Created by shivang vyas on 31/05/25.
//

/// ColorExtension.swift
/// Extends SwiftUI.Color to add support for hex color string initialization.
/// This extension enables creating colors from hex strings in various formats,
/// which is particularly useful when working with API responses or web-style color definitions.
///
/// Supported hex formats:
/// - 3 digits: RGB (4 bits per channel, e.g., "#RGB")
/// - 6 digits: RGB (8 bits per channel, e.g., "#RRGGBB")
/// - 8 digits: ARGB (8 bits per channel, e.g., "#AARRGGBB")
///
/// Usage:
/// ```swift
/// // 3-digit hex
/// let color1 = Color(hexString: "#F00")  // bright red
///
/// // 6-digit hex
/// let color2 = Color(hexString: "#FF0000")  // bright red
///
/// // With or without '#' prefix
/// let color3 = Color(hexString: "FF0000")  // also works
/// ```

import SwiftUI

/// Extension to create Color from hex string
extension Color {
    /// Creates a Color instance from a hexadecimal color string.
    ///
    /// The initializer supports the following hex formats:
    /// - 3 digits: RGB format (eg: "F00" for red)
    /// - 6 digits: RRGGBB format (eg: "FF0000" for red)
    /// - 8 digits: AARRGGBB format (eg: "FFFF0000" for red)
    ///
    /// The '#' prefix is optional and will be stripped if present.
    /// Invalid hex strings will result in the default system blue color.
    ///
    /// - Parameter hexString: A string containing the hex color code
    /// - Note: Alpha channel in 8-digit format is currently ignored, opacity is always set to 1
    init(hexString: String) {
        // Handle empty string gracefully
        guard !hexString.isEmpty else {
            // Default to clear color for empty strings
            self.init(.sRGB, red: 0, green: 0, blue: 0, opacity: 0)
            return
        }
        
        // Remove any non-alphanumeric characters (like '#')
        let hex = hexString.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        
        // Validate we have a valid hex string after trimming
        guard !hex.isEmpty else {
            // Default to clear color if only special characters
            self.init(.sRGB, red: 0, green: 0, blue: 0, opacity: 0)
            return
        }
        
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r, g, b: UInt64
        
        switch hex.count {
        case 3: // RGB (12-bit)
            // Convert "RGB" to "RRGGBB" by duplicating each character
            // For example: "F00" becomes "FF0000"
            (r, g, b) = ((int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
            
        case 6: // RGB (24-bit)
            // Standard 6-digit hex color
            // Extract each color component
            (r, g, b) = (int >> 16, int >> 8 & 0xFF, int & 0xFF)
            
        case 8: // ARGB (32-bit)
            // 8-digit hex color (alpha channel is currently ignored)
            // Extract RGB components, ignoring alpha
            (r, g, b) = (int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
            
        default:
            // Invalid hex string, default to system blue
            (r, g, b) = (0, 122, 255)
        }
        
        // Initialize color in sRGB color space with values normalized to 0-1 range
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: 1
        )
    }
}
