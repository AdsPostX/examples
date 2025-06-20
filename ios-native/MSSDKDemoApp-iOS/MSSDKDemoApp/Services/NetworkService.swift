import Foundation

/// Represents possible errors that can occur during network requests.
/// These provide specific error information for better debugging and user feedback.
enum NetworkError: Error {
    case invalidURL               // The URL couldn't be constructed properly
    case noData                   // No data was returned from the server
    case decodingError(String)    // Error when parsing the JSON response
    case serverError(String)      // Error returned from the server
    case invalidParameter(String) // Parameter validation failed
}

/// Singleton service responsible for making network requests to fetch offers.
/// Provides a clean API for fetching offers with proper parameter validation
/// and error handling, hiding the networking complexity from view models.
class NetworkService {
    /// Shared singleton instance for global access throughout the app.
    static let shared = NetworkService()
    
    /// Base URL for the offers API endpoint.
    private let baseURL = AppConfig.API.baseURL
    
    /// Private initializer to enforce singleton usage pattern.
    private init() {}
    
    /// Fetches offers from the API using the provided parameters.
    /// - Parameters:
    ///   - sdkId: The account ID for the SDK.
    ///   - isDevelopment: (Optional) Enable test mode. Defaults to false.
    ///   - payload: (Optional) Additional custom attributes.
    ///   - loyaltyboost: (Optional) Loyalty boost flag ("0", "1", or "2"). Defaults to "0".
    ///   - creative: (Optional) Creative flag ("0" or "1"). Defaults to "0".
    ///   - campaignId: (Optional) Campaign identifier.
    /// - Returns: A dictionary representing the JSON response.
    /// - Throws: `NetworkError` if any validation or network error occurs.
    func fetchOffers(
        sdkId: String,
        isDevelopment: Bool = false,
        payload: [String: String]? = nil,
        loyaltyboost: String = "0",
        creative: String = "0",
        campaignId: String? = nil
    ) async throws -> [String: Any] {

        // Validate loyaltyboost parameter
        guard ["0", "1", "2"].contains(loyaltyboost) else {
            throw NetworkError.invalidParameter("loyaltyboost must be 0, 1, or 2")
        }
        
        // Validate creative parameter
        guard ["0", "1"].contains(creative) else {
            throw NetworkError.invalidParameter("creative must be 0 or 1")
        }
        
        // Build the URL with query parameters
        guard var urlComponents = URLComponents(string: baseURL) else {
            throw NetworkError.invalidURL
        }
        
        // Add required and optional query parameters
        var queryItems: [URLQueryItem] = []
        queryItems.append(URLQueryItem(name: "api_key", value: sdkId))
        queryItems.append(URLQueryItem(name: "loyaltyboost", value: loyaltyboost))
        queryItems.append(URLQueryItem(name: "creative", value: creative))
        if let campaignId = campaignId {
            queryItems.append(URLQueryItem(name: "campaignId", value: campaignId))
        }
        queryItems.append(URLQueryItem(name: "country", value: "US"))
        
        urlComponents.queryItems = queryItems
        
        guard let url = urlComponents.url else {
            throw NetworkError.invalidURL
        }
        
        // Create the request body as a dictionary
        var requestBody: [String: Any] = [:]
                
        // Add optional parameters to the request body if they exist
        if isDevelopment { requestBody["dev"] = "1" }
        if let payload = payload {
            for (key, value) in payload {
                requestBody[key] = value
            }
        }
        
        // Prepare the URLRequest
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // Set User-Agent header from payload or UserAgentService
        let userAgent = payload?["ua"] ?? UserAgentService.shared.userAgent
        request.addValue(userAgent, forHTTPHeaderField: "User-Agent")
        
        // Encode the request body as JSON
        request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
        
        // Perform the network request
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.serverError("Invalid server response")
        }
        
        // Handle different HTTP status codes
        switch httpResponse.statusCode {
        case 200...299:
            do {
                // Parse the JSON response
                guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                    throw NetworkError.decodingError("Invalid JSON format")
                }
                return json
            } catch {
                throw NetworkError.decodingError("Failed to parse JSON: \(error.localizedDescription)")
            }      
        default:
            throw NetworkError.serverError("Unexpected error: \(httpResponse.statusCode)")
        }
    }
} 
