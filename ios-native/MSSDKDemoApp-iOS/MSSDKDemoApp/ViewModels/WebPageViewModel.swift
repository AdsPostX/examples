import Foundation
import WebKit

/// ViewModel for the checkout WebView screen.
/// Responsible for:
/// - Generating dynamic HTML for the web experience
/// - Handling WebView navigation and JavaScript event callbacks
/// - Managing state for loading, errors, and view dismissal
/// - Processing messages from the WebSDK (link clicks, offer actions, etc.)
/// - Determining when to dismiss the view after user actions
@MainActor
class WebPageViewModel: NSObject, ObservableObject {
    // MARK: - Published Properties
    
    /// Indicates whether the web page is currently loading (controls loading indicator).
    @Published var isLoading = true
    
    /// Holds any error message encountered during WebView loading or operation.
    @Published var error: String?
    
    /// Signals when the view should be dismissed (e.g., after a close event from JS).
    @Published var shouldDismiss = false
    
    /// The SDK identifier for the web page.
    @Published var sdkId: String = AppConfig.API.defaultSDKId
    
    // MARK: - Private Properties
    
    private let momentsAPIResponse: [String: Any]?   // Pre-fetched API response (if using API mode)
    var webView: WKWebView?                          // Reference to the WebView for JS evaluation
    private var recentlyOpenedURL: URL?              // Prevents duplicate URL opening
    private let loadMode: WebPageLoadMode            // Determines whether to use API or WebSDK prefetch
    private let offerCount: Int?                     // Number of offers to display in header
    private let userPayload: [String: String]?        // User payload for customization (optional)
    let baseURL = AppConfig.WebView.baseURL
    
    // MARK: - Initialization
    
    /// Initializes the view model with the given parameters.
    /// - Parameters:
    ///   - sdkId: The SDK identifier for the web page.
    ///   - momentsAPIResponse: The API response to be used (if any).
    ///   - loadMode: The mode for loading the web page (API or WebSDK).
    ///   - offerCount: The number of offers to display in the header (optional).
    ///   - userPayload: Custom user payload to pass to the WebSDK (optional).
    init(sdkId: String, momentsAPIResponse: [String: Any]?, loadMode: WebPageLoadMode, offerCount: Int? = nil, userPayload: [String: String]? = nil) {
        self.sdkId = sdkId
        self.momentsAPIResponse = momentsAPIResponse
        self.loadMode = loadMode
        self.offerCount = offerCount
        self.userPayload = userPayload
        super.init()
    }
    
    // MARK: - HTML Content Generation
    
    /// Escapes a string for safe JavaScript embedding.
    private static func escapeForJSString(_ string: String) -> String {
        return string
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "'", with: "\\'")
            .replacingOccurrences(of: "\n", with: "\\n")
            .replacingOccurrences(of: "\r", with: "\\r")
            .replacingOccurrences(of: "\t", with: "\\t")
            .replacingOccurrences(of: "</script>", with: "<\\/script>")
    }
    
    /// Normalizes a URL for comparison (removes trailing slashes, lowercases scheme/host).
    private func normalizeURL(_ url: URL) -> String {
        var components = URLComponents(url: url, resolvingAgainstBaseURL: true)!
        components.path = components.path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        components.scheme = components.scheme?.lowercased()
        components.host = components.host?.lowercased()
        return components.string ?? url.absoluteString
    }
    
    /// Loads the HTML template from the app bundle
    /// - Throws: HTMLTemplateError if template not found or failed to load
    private func loadHTMLTemplate() throws -> String {
        guard let htmlPath = Bundle.main.path(forResource: "webpage_template", ofType: "html") else {
            print("HTML template not found")
            throw HTMLTemplateError.templateNotFound
        }
        
        do {
            return try String(contentsOfFile: htmlPath, encoding: .utf8)
        } catch {
            print("Error loading HTML template: \(error.localizedDescription)")
            throw HTMLTemplateError.failedToLoadTemplate(error)
        }
    }
    
    /// Generates the HTML content for the WebView by replacing placeholders in the template
    private var htmlContent: String {
        // Load the HTML template
        let htmlTemplate: String
        do {
            htmlTemplate = try loadHTMLTemplate()
        } catch {
            // Fallback to a minimal HTML template if loading fails
            print("Failed to load HTML template: \(error.localizedDescription)")
            self.error = "Failed to load HTML template: \(error.localizedDescription)"
            return "<html><body><h1>Error loading template</h1><p>\(error.localizedDescription)</p></body></html>"
        }
        
        // Convert dictionary to JSON string 
        let rawResponseJsonString: String
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: momentsAPIResponse ?? [:])
            rawResponseJsonString = String(data: jsonData, encoding: .utf8) ?? "{}"
        } catch {
            rawResponseJsonString = "{}"
        }

        // Determine the number of offers to display
        let offersCount: Int
        if let data = momentsAPIResponse?["data"] as? [String: Any],
           let offers = data["offers"] as? [[String: Any]] {
            offersCount = offers.count
        } else if let offerCount = offerCount {
            offersCount = offerCount
        } else {
            offersCount = 0
        }

        // Escape values for safe embedding in JavaScript
        let escapedSdkId = WebPageViewModel.escapeForJSString(sdkId)
        let escapedResponseJsonString = WebPageViewModel.escapeForJSString(rawResponseJsonString)
        
        // Convert payload to JSON string if available
        let payloadJsonString: String
        if let payload = userPayload, !payload.isEmpty {
            do {
                let payloadData = try JSONSerialization.data(withJSONObject: payload)
                payloadJsonString = String(data: payloadData, encoding: .utf8) ?? "{}"
            } catch {
                payloadJsonString = "{}"
            }
        } else {
            payloadJsonString = "{}"
        }
        
        let escapedPayloadJsonString = WebPageViewModel.escapeForJSString(payloadJsonString)
        
        // Prepare configurations based on load mode
        let autoConfig: String
        let responseHandling: String
        let callSetResponse: String

        switch loadMode {
        case .prefetchAPI:
            // For API prefetch mode - now with autoShow: true
            autoConfig = "autoShow: true,\n              autoLoad: false"
            responseHandling = """
                try {
                    const responseData = JSON.parse('\(escapedResponseJsonString)');
                    if (responseData && typeof responseData === 'object') {
                        setTimeout(() => window.Adpx.setApiResponse(responseData), 100);
                    } else {
                        console.error('Invalid response data format');
                    }
                } catch (error) {
                    console.error('Error parsing response data: ' + error.message);
                }
            """
            callSetResponse = "await setResponse();"
        case .prefetchWebSDK:
            // For WebSDK prefetch mode - already has autoShow: true
            autoConfig = "autoShow: true,\n              autoLoad: true,\n              prefetch: true"
            responseHandling = """
                // WebSDK prefetch mode - no additional response handling needed
            """
            callSetResponse = "// No need to call setResponse for WebSDK prefetch mode"
        }

        // Replace placeholders in the template
        return htmlTemplate
            .replacingOccurrences(of: "{{SDK_ID}}", with: escapedSdkId)
            .replacingOccurrences(of: "{{LAUNCHER_SCRIPT_URL}}", with: AppConfig.WebView.launcherScriptURL)
            .replacingOccurrences(of: "{{OFFERS_COUNT}}", with: String(offersCount))
            .replacingOccurrences(of: "{{AUTO_CONFIG}}", with: autoConfig)
            .replacingOccurrences(of: "{{RESPONSE_HANDLING}}", with: responseHandling)
            .replacingOccurrences(of: "{{CALL_SET_RESPONSE}}", with: callSetResponse)
            .replacingOccurrences(of: "window.AdpxUser = {}", with: "window.AdpxUser = \(escapedPayloadJsonString)")
    }
    
    /// Loads the generated HTML into the provided WKWebView.
    /// - Parameter webView: The WKWebView instance to load content into.
    func configureAndLoad(webView: WKWebView) {
        self.webView = webView
        webView.loadHTMLString(htmlContent, baseURL: baseURL)
        print("HTML content loaded")
    }
    
    // MARK: - WebView Event Handlers
    
    /// Called when the WebView finishes loading.
    func handleLoadingFinished() {
        isLoading = false
    }
    
    /// Called when the WebView fails to load.
    /// - Parameter error: The error encountered during loading.
    func handleLoadingError(_ error: Error) {
        isLoading = false
        self.error = error.localizedDescription
    }
    
    /// Handles messages sent from JavaScript in the WebView.
    /// - Parameters:
    ///   - event: The event name sent from JS.
    ///   - payload: The payload dictionary sent from JS.
    func handleMessage(event: String, payload: [String: Any]) {
        switch event {
        case Message.urlClickedMessage:
            // Handle URL clicks from the web content
            if let targetUrl = payload["target_url"] as? String,
               let url = URL(string: targetUrl) {
                recentlyOpenedURL = url
                openExternal(url: url)
            }
        case Message.closeAdMessage, Message.lastAdTakenMessage:
            // Dismiss the view if the ad is closed or the last ad is taken
            shouldDismiss = true
        default:
            break
        }
    }
    
    /// Determines if a URL should be opened externally.
    /// - Parameter url: The URL to check.
    /// - Returns: True if the URL should be opened, false otherwise.
    func shouldOpenURL(_ url: URL) -> Bool {
        return normalizeURL(url) != (recentlyOpenedURL.map { normalizeURL($0) } ?? "")
    }
    
    /// Opens a URL in the system browser.
    /// - Parameter url: The URL to open.
    func openExternal(url: URL) {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }
}
