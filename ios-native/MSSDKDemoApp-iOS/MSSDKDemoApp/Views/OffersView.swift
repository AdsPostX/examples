import SwiftUI
import WebKit

/// Main screen for prefetching offers and navigating to the checkout WebView.
/// This view serves as the entry point for the app, providing two methods to prefetch offers:
/// 1. Using the native API to prefetch offers server-side
/// 2. Using the WebSDK to prefetch offers client-side via a hidden WebView
/// The user can enter an SDK ID and choose their preferred prefetch method.
struct OffersView: View {
    @StateObject private var viewModel = OffersViewModel() // Controls business logic and state management
    @State private var webViewKey = UUID() // Used to force WebView recreation when needed
    @FocusState private var isApiKeyFocused: Bool // Controls keyboard focus state for input field
    
    var body: some View {
        NavigationView {
            ZStack {
                ScrollView {
                    VStack(spacing: 16) {
                        // Hidden WebView for WebSDK prefetch (0x0, invisible) - appears only when needed
                        if viewModel.shouldShowWebView {
                            WebViewContainer(
                                viewModel: viewModel,
                                onResponseReceived: viewModel.handleWebSDKResponse
                            )
                            .id(viewModel.webViewId)
                            .frame(width: 0, height: 0)
                            .opacity(0)
                        }
                        
                        // SDK ID input field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("SDK ID")
                                .font(.headline)
                                .foregroundColor(.gray)
                            TextField("Enter SDK ID", text: $viewModel.sdkId)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .autocapitalization(.none)
                                .disableAutocorrection(true)
                                .focused($isApiKeyFocused)
                        }
                        .padding(.horizontal)
                        
                        // Info and button for API prefetch
                        Text("Prefetch with API will call native API first and its response will be sent to websdk on 2nd screen")
                            .font(.footnote)
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                        SwiftUI.Button(action: {
                            isApiKeyFocused = false
                            viewModel.prefetchWithAPI()
                        }) {
                            Text("Prefetch with API")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(viewModel.isAPIPrefetchButtonEnabled ? Color.blue : Color.gray)
                                .cornerRadius(8)
                        }
                        .padding(.horizontal)
                        .disabled(!viewModel.isAPIPrefetchButtonEnabled)
                        
                        // Info and button for WebSDK prefetch
                        Text("Prefetch with WebSDK will load websdk with 0 x 0 webview on this screen first, web sdk will save response locally and when we use web sdk again on 2nd screen to display, that saved response will be used. once offers are displayed saved response will be deleted locally")
                            .font(.footnote)
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                        SwiftUI.Button(action: {
                            isApiKeyFocused = false
                            viewModel.prefetchWithWebSDK()
                        }) {
                            Text("Prefetch with WebSDK")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(viewModel.isWebSDKPrefetchButtonEnabled ? Color.blue : Color.gray)
                                .cornerRadius(8)
                        }
                        .padding(.horizontal)
                        .disabled(!viewModel.isWebSDKPrefetchButtonEnabled)
                        
                        // Show number of offers if available
                        if viewModel.hasOffers {
                            Text("\(viewModel.offersCount) offers available")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                                .padding(.top, 8)
                        }
                        
                        // Navigation to checkout screen if offers are available
                        if viewModel.showCheckout {
                            NavigationLink(
                                destination: WebPageView(
                                    sdkId: viewModel.sdkId,
                                    momentsAPIResponse: viewModel.checkoutAPIResponse,
                                    loadMode: viewModel.prefetching ?? .prefetchAPI,
                                    offerCount: viewModel.offersCount,
                                    userPayload: viewModel.userPayload
                                )
                            ) {
                                Text("Proceed to Checkout")
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 12)
                                    .background(Color.blue)
                                    .cornerRadius(8)
                            }
                            .padding(.horizontal)
                        }
                        
                        // Show error if any
                        if let error = viewModel.error {
                            Text("Error: \(error)")
                                .foregroundColor(.red)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal)
                        }
                    }
                    .onAppear {
                        viewModel.reset()
                    }
                }
                
                // Show loading indicator if needed
                if viewModel.isLoading {
                    ProgressView()
                        .scaleEffect(1.5)
                }
            }
            .navigationBarTitle("Offers", displayMode: .large)
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
}

// Simple WebView container that handles JS message passing
struct WebViewContainer: UIViewRepresentable {
    let viewModel: OffersViewModel
    let onResponseReceived: ([String: Any]) -> Void
    
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
        webView.backgroundColor = .clear
        webView.isOpaque = false
        if #available(iOS 16.4, *) {
            webView.isInspectable = true // For debugging; remove for production
        }
        
        do {
            // Try to load HTML from template
            let htmlContent = try viewModel.generatePrefetchHTML()
            webView.loadHTMLString(htmlContent, baseURL: viewModel.baseURL)
        } catch  {
            // Handle missing template by using a fallback
            print("Error loading HTML template: \(error)")
        }
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        // No update needed
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(onResponseReceived: onResponseReceived)
    }
    
    // Coordinator to handle JS messages
    class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
        let onResponseReceived: ([String: Any]) -> Void
        
        init(onResponseReceived: @escaping ([String: Any]) -> Void) {
            self.onResponseReceived = onResponseReceived
            super.init()
        }
        
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            if message.name == "adpxCallback",
               let body = message.body as? [String: Any],
               let payload = body["payload"] as? [String: Any],
               let response = payload["response"] as? [String: Any] {
                onResponseReceived(response)
            }
        }
    }
    
   
    
}
