//
//  HTMLTemplateError.swift
//  MomentsAPIWebDemoApp
//
//  Created by shivang vyas on 04/05/25.
//

/// Error types for HTML template generation.
/// Used when loading and processing the HTML templates for WebViews.
enum HTMLTemplateError: Error {
    case templateNotFound             // The HTML template file couldn't be found in the bundle
    case failedToLoadTemplate(Error)  // An error occurred while loading the template file
}
