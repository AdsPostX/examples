//
//  Message.swift
//  MomentsAPIWebDemoApp
//
//  Created by shivang vyas on 30/04/25.
//

/// Constants for message types received from the WebSDK JavaScript callbacks.
/// These define the events that can be triggered by user interactions in the WebView.
enum Message {
    static let urlClickedMessage: String = "url_clicked"  // User clicked a URL in the WebView
    static let lastAdTakenMessage: String = "last_ad_taken"  // User accepted the last available offer
    static let closeAdMessage: String = "closed_ads"  // User closed the offers experience
}
