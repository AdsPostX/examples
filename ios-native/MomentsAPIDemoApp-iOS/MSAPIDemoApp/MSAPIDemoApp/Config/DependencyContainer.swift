//
//  DependencyContainer.swift
//  MSAPIDemoApp
//
//  Created by shivang vyas on 14/12/25.
//

/// DependencyContainer.swift
/// A lightweight dependency injection container for the Moments API Demo App.
/// Provides centralized dependency creation and management without external frameworks.
///
/// Key features:
/// - Simple service factory pattern
/// - Lazy initialization of services
/// - Error handling for configuration failures
/// - Singleton pattern for app-wide access
/// - Easy to test and mock
///
/// Usage:
/// ```swift
/// let container = DependencyContainer.shared
/// let viewModel = try container.makeOffersViewModel()
/// ```

import Foundation

/// Lightweight dependency injection container
/// Manages the creation and lifecycle of application dependencies
class DependencyContainer {
    /// Shared singleton instance for app-wide access
    static let shared = DependencyContainer()
    
    /// Cached offers service instance (created once and reused)
    private var offersService: OffersServiceProtocol?
    
    /// Private initializer to enforce singleton pattern
    private init() {}
    
    /// Creates or returns the cached offers service
    /// - Returns: An instance conforming to OffersServiceProtocol
    /// - Throws: Configuration errors if service cannot be initialized
    func makeOffersService() throws -> OffersServiceProtocol {
        if let service = offersService {
            return service
        }
        
        let service = try OffersService()
        self.offersService = service
        return service
    }
    
    /// Creates a new OffersViewModel with injected dependencies
    /// - Returns: A configured OffersViewModel instance
    /// - Throws: Configuration errors if dependencies cannot be created
    /// - Note: Marked with @MainActor because OffersViewModel is MainActor-isolated
    @MainActor
    func makeOffersViewModel() throws -> OffersViewModel {
        let service = try makeOffersService()
        return OffersViewModel(service: service)
    }
    
    /// Resets the container (useful for testing or app restart)
    /// - Note: Call this to force recreation of services
    func reset() {
        offersService = nil
    }
    
    // MARK: - Testing Support
    
    /// Injects a custom service for testing purposes
    /// - Parameter service: The service instance to inject
    /// - Note: This allows tests to inject mock services
    func setOffersService(_ service: OffersServiceProtocol) {
        self.offersService = service
    }
}

