import SwiftUI
import WebKit

/// The main view for displaying the checkout web page using a WKWebView.
/// This view is responsible for showing the offers experience within a WebView,
/// handling loading states, error conditions, and communication with JavaScript.
/// It receives prefetched offer data from the previous screen and displays it
/// using either the API response or WebSDK's previously cached data.
struct WebPageView: View {
    @StateObject private var viewModel: WebPageViewModel
    @Environment(\.presentationMode) var presentationMode
    
    /// Custom initializer to inject dependencies into the view model.
    /// - Parameters:
    ///   - sdkId: The SDK identifier used to initialize the WebSDK.
    ///   - momentsAPIResponse: Optional API response from prefetching (used in API mode).
    ///   - loadMode: Determines whether to use API response or WebSDK prefetch cache.
    ///   - offerCount: The number of offers to display in the header.
    ///   - userPayload: Custom user payload to pass to the WebSDK (optional).
    init(sdkId: String, momentsAPIResponse: [String: Any]?, loadMode: WebPageLoadMode, offerCount: Int, userPayload: [String: String]? = nil) {
        _viewModel = StateObject(
            wrappedValue: WebPageViewModel(
                sdkId: sdkId,
                momentsAPIResponse: momentsAPIResponse,
                loadMode: loadMode,
                offerCount: offerCount,
                userPayload: userPayload
            )
        )
    }
    
    var body: some View {
        ZStack {
            // The main web view for displaying the checkout page
            CheckoutWebView(viewModel: viewModel, presentationMode: presentationMode)
                .edgesIgnoringSafeArea(.all)
            
            // Show a loading indicator while the web page is loading
            if viewModel.isLoading {
                VStack {
                    ProgressView()
                        .scaleEffect(1.5)
                    Text("Loading...")
                        .foregroundColor(.gray)
                        .padding(.top, 8)
                }
            }
            
            // Show an error message if loading fails
            if let error = viewModel.error {
                VStack {
                    Text("Error: \(error)")
                        .foregroundColor(.red)
                        .multilineTextAlignment(.center)
                        .padding()
                }
                .background(Color.white.opacity(0.9))
                .cornerRadius(10)
                .padding()
            }
        }
        .navigationBarTitle("Checkout", displayMode: .inline)
        // Dismiss the view if the view model requests it (e.g., after a close event from JS)
        .onChange(of: viewModel.shouldDismiss) { shouldDismiss in
            if shouldDismiss {
                presentationMode.wrappedValue.dismiss()
            }
        }
    }
}

/// A UIViewRepresentable wrapper for WKWebView that handles the checkout experience
struct CheckoutWebView: UIViewRepresentable {
    let viewModel: WebPageViewModel
    let presentationMode: Binding<PresentationMode>
    
    func makeUIView(context: Context) -> WKWebView {
        // Create configuration with JS message handler
        let config = WKWebViewConfiguration()
        let contentController = WKUserContentController()
        contentController.add(context.coordinator, name: "adpxCallback")
        config.userContentController = contentController
        
        // Enable JavaScript
        let preferences = WKWebpagePreferences()
        preferences.allowsContentJavaScript = true
        config.defaultWebpagePreferences = preferences
        
        // Create and configure WebView
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        webView.backgroundColor = .white
        webView.allowsBackForwardNavigationGestures = true
        if #available(iOS 16.4, *) {
            webView.isInspectable = true // For debugging; remove for production
        }
        
        // Configure and load content
        viewModel.configureAndLoad(webView: webView)
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        // No update needed
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(viewModel: viewModel, presentationMode: presentationMode)
    }
    
    /// Coordinator to handle WKWebView navigation, UI events, and JavaScript messages
    class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
        let viewModel: WebPageViewModel
        let presentationMode: Binding<PresentationMode>
        
        init(viewModel: WebPageViewModel, presentationMode: Binding<PresentationMode>) {
            self.viewModel = viewModel
            self.presentationMode = presentationMode
            super.init()
        }
        
        /// Handles messages sent from JavaScript in the web view
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            if message.name == "adpxCallback",
               let messageDict = message.body as? [String: Any],
               let event = messageDict["event"] as? String,
               let payload = messageDict["payload"] as? [String: Any] {
                viewModel.handleMessage(event: event, payload: payload)
            }
        }
        
        /// Called when the web view finishes loading content
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            viewModel.handleLoadingFinished()
        }
        
        /// Called when the web view fails to load content
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            viewModel.handleLoadingError(error)
        }
        
        /// Called when the web view fails to start loading content
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            viewModel.handleLoadingError(error)
        }
        
        /// Decides whether a navigation action should be allowed
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let url = navigationAction.request.url {
                decisionHandler(viewModel.shouldOpenURL(url) ? .allow : .cancel)
            } else {
                decisionHandler(.allow)
            }
        }
        
        /// Handles requests to open new windows (e.g., target="_blank" links)
        func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
            if let url = navigationAction.request.url,
               viewModel.shouldOpenURL(url) {
                viewModel.openExternal(url: url)
            }
            return nil
        }
    }
} 
