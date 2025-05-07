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
    ///   - ua: The user agent string.
    ///   - placement: (Optional) Placement identifier.
    ///   - ip: (Optional) IP address.
    ///   - adpxFp: (Optional) should be unique for each user.
    ///   - dev: (Optional) test mode flag ("0" or "1").
    ///   - subid: (Optional) Sub ID.
    ///   - pubUserId: (Optional) Publisher ID.
    ///   - payload: (Optional) Additional custom attributes.
    ///   - loyaltyboost: (Optional) Loyalty boost flag ("0", "1", or "2").
    ///   - creative: (Optional) Creative flag ("0" or "1").
    /// - Returns: A dictionary representing the JSON response.
    /// - Throws: `NetworkError` if any validation or network error occurs.
    func fetchOffers(
        sdkId: String,
        ua: String,
        placement: String? = nil,
        ip: String? = nil,
        adpxFp: String? = nil,
        dev: String? = nil,
        subid: String? = nil,
        pubUserId: String? = nil,
        payload: [String: String]? = nil,
        loyaltyboost: String? = nil,
        creative: String? = nil
    ) async throws -> [String: Any] {
        
        // Validate loyaltyboost parameter
        if let loyaltyboost = loyaltyboost {
            guard ["0", "1", "2"].contains(loyaltyboost) else {
                throw NetworkError.invalidParameter("loyaltyboost must be 0, 1, or 2")
            }
        }
        
        // Validate creative parameter
        if let creative = creative {
            guard ["0", "1"].contains(creative) else {
                throw NetworkError.invalidParameter("creative must be 0 or 1")
            }
        }
        
        // Validate dev parameter
        if let dev = dev {
            guard ["0", "1"].contains(dev) else {
                throw NetworkError.invalidParameter("dev must be 0 or 1")
            }
        }
        
        // Build the URL with query parameters
        guard var urlComponents = URLComponents(string: baseURL) else {
            throw NetworkError.invalidURL
        }
        
        // Add required and optional query parameters
        var queryItems: [URLQueryItem] = []
        queryItems.append(URLQueryItem(name: "accountId", value: sdkId))
        if let loyaltyboost = loyaltyboost {
            queryItems.append(URLQueryItem(name: "loyaltyboost", value: loyaltyboost))
        }
        if let creative = creative {
            queryItems.append(URLQueryItem(name: "creative", value: creative))
        }
        queryItems.append(URLQueryItem(name: "country", value: "US"))
        
        urlComponents.queryItems = queryItems
        
        guard let url = urlComponents.url else {
            throw NetworkError.invalidURL
        }
        
        // Create the request body as a dictionary
        var requestBody: [String: Any] = ["ua": ua]
                
        // Add optional parameters to the request body if they exist
        if let placement = placement { requestBody["placement"] = placement }
        if let ip = ip { requestBody["ip"] = ip }
        if let adpxFp = adpxFp { requestBody["adpx_fp"] = adpxFp }
        if let dev = dev { requestBody["dev"] = dev }
        if let subid = subid { requestBody["subid"] = subid }
        if let pubUserId = pubUserId { requestBody["pub_user_id"] = pubUserId }
        if let payload = payload {
            for (key, value) in payload {
                requestBody[key] = value
            }
        }
        
        // Prepare the URLRequest
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue(ua, forHTTPHeaderField: "User-Agent")
        
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
