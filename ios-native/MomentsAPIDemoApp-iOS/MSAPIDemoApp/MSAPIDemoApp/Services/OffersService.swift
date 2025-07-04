import Foundation

/// Error types that can occur during API operations
enum OffersError: Error {
    /// The constructed URL is invalid
    case invalidURL
    /// A network-related error occurred
    case networkError(Error)
    /// No offers were returned from the API
    case noOffers
    /// Failed to decode the API response
    case decodingError
    /// The provided API key is invalid
    case invalidAPIKey
    /// Invalid parameter value provided
    case invalidParameter(message: String)
}

/// OffersService.swift
/// A service class responsible for handling API interactions with the Moments Offers API.
/// This service manages fetching offers and sending beacon/tracking requests.
///
/// Key responsibilities:
/// - Fetching offers from the Moments API with configurable parameters
/// - Handling beacon requests for tracking user interactions
/// - Managing API errors and responses
/// - Providing standardized request headers and user agent
///
/// Usage:
/// ```swift
/// let service = try OffersService()
/// let response = try await service.fetchOffers(apiKey: "your-api-key")
/// ```

/// Service responsible for handling all API interactions related to offers
class OffersService {
    /// Base URL for the Moments API
    private let baseURL: String
    
    /// Initializes the service with the configured base URL
    /// - Throws: ConfigurationError if base URL is not properly configured
    init() throws {
        self.baseURL = try Configuration.baseURL
    }
    
    /// Fetches offers from the Moments API using the provided API key
    /// - Parameters:
    ///   - apiKey: The API key to use for authentication
    ///   - loyaltyBoost: Optional loyalty boost parameter. If provided, must be "0", "1", or "2"
    ///   - creative: Optional creative parameter. If provided, must be "0" or "1"
    ///   - isDevelopment: Whether to run in development mode (default: false)
    ///   - payload: Optional custom payload dictionary to send in the request body
    ///     If isDevelopment is true, 'dev' = '1' will be included in the payload.
    ///   - campaignId: Optional campaign ID to filter offers (default: nil)
    /// - Returns: The complete offers response including styles and other metadata
    /// - Throws: OffersError for various failure scenarios
    func fetchOffers(
        apiKey: String,
        loyaltyBoost: String? = nil,
        creative: String? = nil,
        isDevelopment: Bool = false,
        payload: [String: String]? = nil,
        campaignId: String? = nil
    ) async throws -> OffersResponse {
        // Validate loyaltyBoost parameter if provided
        if let loyaltyBoost = loyaltyBoost {
            guard["0","1","2"].contains(loyaltyBoost) else {
                throw OffersError.invalidParameter(message: "Invalid loyaltyBoost parameter: \(loyaltyBoost)")
            }
        }

        // Validate creative parameter if provided
        if let creative = creative {
            guard["0","1"].contains(creative) else {
                throw OffersError.invalidParameter(message: "Invalid creative parameter: \(creative)")
            }
        }

        // Construct the payload, ensuring 'dev' = '1' is included if isDevelopment is true
        var finalPayload = payload ?? [:]
        if isDevelopment {
            finalPayload["dev"] = "1"
        }

        // Construct URL with query parameters
        var urlComponents = URLComponents(string: "\(baseURL)/offers.json")
        var queryItems = [
            URLQueryItem(name: "api_key", value: apiKey)
        ]
        
        // Add optional parameters to query items if they exist
        if let loyaltyBoost = loyaltyBoost {
            queryItems.append(URLQueryItem(name: "loyaltyboost", value: loyaltyBoost))
        }
        
        if let creative = creative {
            queryItems.append(URLQueryItem(name: "creative", value: creative))
        }
        
        // Add campaignId to query parameters if available
        if let campaignId = campaignId {
            queryItems.append(URLQueryItem(name: "campaignId", value: campaignId))
        }
        
        urlComponents?.queryItems = queryItems
        
        guard let url = urlComponents?.url else {
            throw OffersError.invalidURL
        }
        
        // Prepare request
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        
        // Set User-Agent header from payload["ua"] or getUserAgent()
        let userAgent = finalPayload["ua"] ?? getUserAgent()
        request.setValue(userAgent, forHTTPHeaderField: "User-Agent")
        
        // Serialize the final payload
        request.httpBody = try? JSONSerialization.data(withJSONObject: finalPayload)
        
        do {
            let (data, _) = try await URLSession.shared.data(for: request)
            let response = try JSONDecoder().decode(OffersResponse.self, from: data)
            
            // Check if we have valid offers data
            guard let offers = response.data?.offers, !offers.isEmpty else {
                throw OffersError.noOffers
            }
            
            return response
        } catch let error as DecodingError {
            print("Decoding error: \(error)")
            throw OffersError.decodingError
        } catch {
            throw OffersError.networkError(error)
        }
    }
    
    /// Fires a beacon request to track user interactions
    /// - Parameter url: The beacon URL to send the request to
    /// - Throws: OffersError if the request fails
    /// - Note: Prints debug information about the beacon request
    func fireBeaconRequest(url: URL) async throws {
        print("👉 Firing beacon request to \(url.absoluteString)")
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue(getUserAgent(), forHTTPHeaderField: "User-Agent")
        
        do {
            let (_, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw OffersError.networkError(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid response type"]))
            }
            
            guard (200...299).contains(httpResponse.statusCode) else {
                throw OffersError.networkError(NSError(domain: "", code: httpResponse.statusCode, userInfo: [NSLocalizedDescriptionKey: "Beacon request failed with status code: \(httpResponse.statusCode)"]))
            }
        } catch {
            throw OffersError.networkError(error)
        }
    }
    
    /// Returns a standardized user agent string for API requests
    /// - Returns: A Safari-based user agent string for iOS
    /// - Note: Currently returns a fixed string, but could be made dynamic
    func getUserAgent() -> String {
        return "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1"
    }
} 
