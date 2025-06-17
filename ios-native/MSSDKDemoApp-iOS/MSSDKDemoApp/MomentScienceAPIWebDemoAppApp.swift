//
//  MomentsAPIWebDemoAppApp.swift
//  MomentsAPIWebDemoApp
//
//  Created by shivang vyas on 28/04/25.
//

import SwiftUI

/// The main entry point for the MomentsAPIWebDemoApp.
/// This struct conforms to the `App` protocol, which is required for all SwiftUI apps.
/// The `body` property defines the main scene of the app, which in this case
/// displays the `OffersView` as the root view inside a window group.
@main
struct MomentScienceAPIWebDemoAppApp: App {
    var body: some Scene {
        WindowGroup {
            // The initial view presented to the user when the app launches.
            // OffersView is the main screen for prefetching offers and navigating to checkout.
            OffersView()
        }
    }
}
