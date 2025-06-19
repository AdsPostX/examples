import WebKit

/// Service responsible for providing user agent information across the app.
/// Uses WKWebView to get the standard iOS user agent string.
class UserAgentService {
    /// Shared singleton instance for global access throughout the app.
    static let shared = UserAgentService()
    
    /// Cached user agent string to avoid creating multiple WKWebViews.
    private var cachedUserAgent: String?
    
    /// Private initializer to enforce singleton usage pattern.
    private init() {}
    
    /// Returns the user agent string for the current device.
    /// Uses caching to improve performance and avoid creating multiple WKWebViews.
    var userAgent: String {
        if let cached = cachedUserAgent {
            return cached
        }
        
        let agent = (WKWebView().value(forKey: "userAgent") as? String) ?? "unknown"
        cachedUserAgent = agent
        return agent
    }
} 