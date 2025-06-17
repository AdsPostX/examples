//
//  WebpageLoadMode.swift
//  MomentsAPIWebDemoApp
//
//  Created by shivang vyas on 02/05/25.
//

/// Enum representing the different modes for loading the web page.
/// Controls the behavior of offer fetching and display in the checkout view.
enum WebPageLoadMode {
    case prefetchAPI      // Use native API to fetch offers, then pass to WebSDK at runtime
    case prefetchWebSDK   // Use WebSDK's own prefetching logic to cache offers client-side
}
