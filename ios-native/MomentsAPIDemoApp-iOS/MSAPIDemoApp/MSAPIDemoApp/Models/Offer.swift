/// Offer.swift
/// Defines the data models for the Moments Offers API response.
/// This file contains all the necessary models to decode and work with offers,
/// their styling, and associated metadata.
///
/// The main components are:
/// - Offer: The core offer data structure
/// - OffersResponse: The top-level API response
/// - OffersStyles: Styling information for the offer UI
/// - Various supporting models for specific styling aspects

import Foundation

/// Represents an offer from the API
/// An offer contains all the necessary information to display a promotional content item,
/// including text, images, tracking URLs, and interaction elements.
struct Offer: Codable, Identifiable {
    /// Unique identifier for the offer
    let id: Int
    /// Associated campaign identifier
    let campaignId: Int?
    /// Main title of the offer
    let title: String?
    /// Detailed description of the offer
    let description: String?
    /// URL to handle when offer is clicked
    let clickUrl: String?
    /// Main image URL for the offer
    let image: String?
    /// Condensed text version of the offer
    let miniText: String?
    /// Legal terms and conditions
    let termsAndConditions: String?
    /// Tracking pixel URL for impression tracking
    let pixel: String?
    /// Text for the positive call-to-action button
    let ctaYes: String?
    /// Text for the negative call-to-action button
    let ctaNo: String?
    /// Text for user action button
    let useractionCta: String?
    /// URL for user action
    let useractionUrl: String?
    /// Advertiser pixel URL for tracking
    let advPixelUrl: String?
    /// Tracking beacon URLs for various events
    let beacons: Beacons?
    /// Collection of creative assets
    let creatives: [Creative]?
    /// Whether offer is enabled for offerwall
    let offerwallEnabled: Bool?
    /// Whether offer is enabled for perks wallet
    let perkswallEnabled: Bool?
    /// Brief description for list views
    let shortDescription: String?
    /// Brief headline for list views
    let shortHeadline: String?
    /// Name of the advertiser
    let advertiserName: String?
    /// Whether this is a loyalty boost offer
    let isLoyaltyboost: Bool?
    /// Requirements for loyalty boost
    let loyaltyboostRequirements: String?
    /// URL for saving offer for later
    let saveForLaterUrl: String?
    /// Categories or labels for the offer
    let tags: [String]?
    /// Alternative description field
    let offerDescription: String?
    /// Associated campaign details
    let campaign: Campaign?
    /// URL for offerwall version
    let offerwallUrl: String?
    /// QR code image URL if applicable
    let qrCodeImg: String?
    
    enum CodingKeys: String, CodingKey {
        case id
        case campaignId = "campaign_id"
        case title
        case description
        case clickUrl = "click_url"
        case image
        case miniText = "mini_text"
        case termsAndConditions = "terms_and_conditions"
        case pixel
        case ctaYes = "cta_yes"
        case ctaNo = "cta_no"
        case useractionCta = "useraction_cta"
        case useractionUrl = "useraction_url"
        case advPixelUrl = "adv_pixel_url"
        case beacons
        case creatives
        case offerwallEnabled = "offerwall_enabled"
        case perkswallEnabled = "perkswallet_enabled"
        case shortDescription = "short_description"
        case shortHeadline = "short_headline"
        case advertiserName = "advertiser_name"
        case isLoyaltyboost = "is_loyaltyboost"
        case loyaltyboostRequirements = "loyaltyboost_requirements"
        case saveForLaterUrl = "save_for_later_url"
        case tags
        case offerDescription = "offer_description"
        case campaign
        case offerwallUrl = "offerwall_url"
        case qrCodeImg = "qr_code_img"
    }
}

/// Represents beacon URLs for tracking various user interactions
/// Beacons are fired when specific events occur during offer interaction
struct Beacons: Codable {
    /// URL to ping when offer is closed
    let close: String?
    /// URL to ping when user clicks "No Thanks"
    let noThanksClick: String?
    
    enum CodingKeys: String, CodingKey {
        case close
        case noThanksClick = "no_thanks_click"
    }
}

/// Represents a creative asset (image/media) for the offer
/// Creatives can be used for various purposes like thumbnails, banners, etc.
struct Creative: Codable {
    /// Unique identifier for the creative
    let id: Int
    /// URL of the creative asset
    let url: String?
    /// Height of the creative in pixels
    let height: Int?
    /// Width of the creative in pixels
    let width: Int?
    /// Type of creative (e.g., "image", "video")
    let type: String?
    /// Specific creative type classification
    let creativeType: String?
    /// Whether this is the primary creative for the offer
    let isPrimary: Bool?
    /// Aspect ratio of the creative (width/height)
    let aspectRatio: Double?
    /// Associated user identifier
    let userId: Int?
    
    enum CodingKeys: String, CodingKey {
        case id
        case url
        case height
        case width
        case type
        case creativeType = "creative_type"
        case isPrimary = "is_primary"
        case aspectRatio = "aspect_ratio"
        case userId = "user_id"
    }
}

/// Represents campaign-specific information and assets
struct Campaign: Codable {
    /// Collection of images associated with the campaign
    let campaignImages: [Creative]?
    /// Campaign-specific offer description
    let offerDescription: String?
    /// Whether the campaign is for a product
    let isProduct: Bool?
    
    enum CodingKeys: String, CodingKey {
        case campaignImages = "campaign_images"
        case offerDescription = "offer_description"
        case isProduct = "is_product"
    }
}

/// Top-level response structure for the offers API
/// Contains the main data payload and any metadata
struct OffersResponse: Codable {
    /// Main data container for the response
    let data: OffersData?
}

/// Container for offers data and associated metadata
struct OffersData: Codable {
    /// Array of offers returned by the API
    let offers: [Offer]?
    /// Total count of offers
    let count: Int?
    /// Styling information for rendering offers
    let styles: OffersStyles?
    /// URL to privacy policy
    let privacyUrl: String?
    
    enum CodingKeys: String, CodingKey {
        case offers
        case count
        case styles
        case privacyUrl = "privacy_url"
    }
}

/// Represents comprehensive styling information for offers
/// Contains all visual customization options for the offer display
struct OffersStyles: Codable {
    /// Styling for the popup container
    let popup: PopupStyle?
    /// Styling for the header section
    let header: HeaderStyle?
    /// Styling for offer text content
    let offerText: OfferTextStyle?
    /// Styling for the footer section
    let footer: FooterStyle?
    /// General settings for offer display
    let settings: SettingsStyle?
    /// Styling for offerwall display
    let offerwall: OfferwallStyle?
    
    enum CodingKeys: String, CodingKey {
        case popup
        case header
        case offerText = "offerText"
        case footer
        case settings
        case offerwall
    }
}

/// Defines styling for the popup container
struct PopupStyle: Codable {
    /// Background color in hex format
    let background: String?
    /// Border radius configuration
    let borderRadius: BorderRadius?
    /// Shadow style
    let shadow: String?
    /// Light box effect style
    let lightBox: String?
    /// Position of the image
    let imagePosition: String?
    /// Whether to show images
    let showImage: Bool?
    
    enum CodingKeys: String, CodingKey {
        case background
        case borderRadius = "borderRadius"
        case shadow
        case lightBox = "lightBox"
        case imagePosition = "image_position"
        case showImage = "showImage"
    }
}

/// Defines border radius for each corner
struct BorderRadius: Codable {
    /// Top-left corner radius
    let topLeft: String?
    /// Top-right corner radius
    let topRight: String?
    /// Bottom-right corner radius
    let bottomRight: String?
    /// Bottom-left corner radius
    let bottomLeft: String?
    
    enum CodingKeys: String, CodingKey {
        case topLeft = "top_left"
        case topRight = "top_right"
        case bottomRight = "bottom_right"
        case bottomLeft = "bottom_left"
    }
}

/// Defines styling for the header section
struct HeaderStyle: Codable {
    /// Header text content
    let text: String?
    /// Background color in hex format
    let background: String?
    /// Text color in hex format
    let textColor: String?
    /// Base font size
    let fontSize: Int?
    /// Font size for headline and lead-in text
    let headLineAndLeadInFontSize: Int?
    /// Lead-in text content
    let leadInText: String?
    /// Lead-in text color
    let leadInTextColor: String?
    /// Heading font size
    let headingFontSize: String?
    /// Lead-in text alignment
    let leadInAlignment: String?
    
    enum CodingKeys: String, CodingKey {
        case text
        case background
        case textColor
        case fontSize
        case headLineAndLeadInFontSize
        case leadInText = "lead_in_text"
        case leadInTextColor = "lead_in_text_color"
        case headingFontSize = "heading_font_size"
        case leadInAlignment = "lead_in_alignment"
    }
}

/// Defines styling for offer text content
struct OfferTextStyle: Codable {
    /// Size for CTA button text
    let ctaTextSize: String?
    /// Style for CTA button text (e.g., "bold")
    let ctaTextStyle: String?
    /// Whether to hide advertiser name
    let hideAdvName: Bool?
    /// Main text color
    let textColor: String?
    /// Font family
    let font: String?
    /// Base font size
    let fontSize: Int?
    /// Style for positive CTA button
    let buttonYes: ButtonStyle?
    /// Style for negative CTA button
    let buttonNo: ButtonStyle?
    /// Button radius for offerwall
    let offerwallMouButtonRadius: Int?
    /// Whether to show images
    let showImage: Bool?
    
    enum CodingKeys: String, CodingKey {
        case ctaTextSize = "cta_text_size"
        case ctaTextStyle = "cta_text_style"
        case hideAdvName = "hide_adv_name"
        case textColor
        case font
        case fontSize
        case buttonYes
        case buttonNo
        case offerwallMouButtonRadius = "offerwall_mou_button_radius"
        case showImage = "show_image"
    }
}

/// Defines styling for buttons
struct ButtonStyle: Codable {
    /// Background color in hex format
    let background: String?
    /// Hover state color
    let hover: String?
    /// Border stroke color
    let stroke: String?
    /// Text color
    let color: String?
}

/// Defines styling for the footer section
struct FooterStyle: Codable {
    /// Disclaimer text
    let disclaimer: String?
    /// Privacy text
    let privacy: String?
    /// General footer text
    let text: String?
    /// Whether to show APX links
    let showApxLinks: Bool?
    /// Publisher's privacy policy URL
    let publisherPrivacyPolicy: String?
    /// Publisher's name
    let publisherName: String?
    
    enum CodingKeys: String, CodingKey {
        case disclaimer
        case privacy
        case text
        case showApxLinks = "show_apx_links"
        case publisherPrivacyPolicy = "publisher_privacy_policy"
        case publisherName = "publisher_name"
    }
}

/// Defines general settings for offer display
struct SettingsStyle: Codable {
    /// Position of the ad
    let adPosition: String?
    /// Animation style for the ad
    let adAnimation: String?
    /// Order of buttons
    let buttonOrder: String?
    /// Text for saved offers
    let savedOfferText: String?
    /// Whether all USP offers are checked
    let uspAllOffersChecked: Bool?
    /// Whether to enable USP
    let enableUsp: Bool?
    /// Type of progress bar
    let progressBarType: String?
    /// Text for USP CTA
    let uspCtaText: String?
    /// Whether to darken background
    let darkenBg: Bool?
    /// Whether to darken non-centered background
    let darkenBgNonCentered: Bool?
    /// Delay in milliseconds
    let delay: Int?
    /// Whether to enable vertical offset
    let enableVerticalOffset: Bool?
    /// Vertical offset for mobile
    let mobileVerticalOffset: String?
    /// Screen margin in pixels
    let screenMargin: Int?
    /// Whether to show disclaimer
    let showDisclaimer: Bool?
    /// Whether to show close button
    let showClose: Bool?
    /// Whether to enable close delay
    let enableCloseDelay: Bool?
    /// Close delay in milliseconds
    let closeDelay: Int?
    
    enum CodingKeys: String, CodingKey {
        case adPosition = "ad_position"
        case adAnimation = "ad_animation"
        case buttonOrder = "button_order"
        case savedOfferText = "saved_offer_text"
        case uspAllOffersChecked = "usp_all_offers_checked"
        case enableUsp = "enable_usp"
        case progressBarType = "progress_bar_type"
        case uspCtaText = "usp_cta_text"
        case darkenBg = "darken_bg"
        case darkenBgNonCentered = "darken_bg_non_centered"
        case delay
        case enableVerticalOffset = "enable_vertical_offset"
        case mobileVerticalOffset = "mobile_vertical_offset"
        case screenMargin = "screen_margin"
        case showDisclaimer = "show_disclaimer"
        case showClose = "show_close"
        case enableCloseDelay = "enable_close_delay"
        case closeDelay = "close_delay"
    }
}

/// Defines styling for offerwall display
struct OfferwallStyle: Codable {
    /// Button styling for offerwall
    let button: OfferwallButtonStyle?
    /// Tile styling for offerwall
    let tile: OfferwallTileStyle?
    /// Radius for tiles
    let tileRadius: Int?
    /// URL for offerwall logo
    let offerwallLogoUrl: String?
    /// Gap between tiles
    let mouTileGap: Int?
    
    enum CodingKeys: String, CodingKey {
        case button
        case tile
        case tileRadius = "tile_radius"
        case offerwallLogoUrl = "offerwall_logo_url"
        case mouTileGap = "mou_tile_gap"
    }
}

/// Defines button styling specific to offerwall
struct OfferwallButtonStyle: Codable {
    /// Button background color
    let offerwallMouButtonBackground: String?
    /// Button text color
    let offerwallMouButtonColor: String?
    /// Button hover state color
    let offerwallMouButtonHover: String?
    /// Button border stroke color
    let offerwallMouButtonStroke: String?
    
    enum CodingKeys: String, CodingKey {
        case offerwallMouButtonBackground = "offerwall_mou_button_background"
        case offerwallMouButtonColor = "offerwall_mou_button_color"
        case offerwallMouButtonHover = "offerwall_mou_button_hover"
        case offerwallMouButtonStroke = "offerwall_mou_button_stroke"
    }
}

/// Defines tile styling specific to offerwall
struct OfferwallTileStyle: Codable {
    /// Border color for tiles
    let offerwallMouBorderColor: String?
    /// Border thickness for tiles
    let offerwallMouBorderThickness: Int?
    /// Hover state background color for tiles
    let offerwallMouTileBackgroundHoverColor: String?
    /// Default background color for tiles
    let mouTileBackgroundColor: String?
    
    enum CodingKeys: String, CodingKey {
        case offerwallMouBorderColor = "offerwall_mou_border_color"
        case offerwallMouBorderThickness = "offerwall_mou_border_thickness"
        case offerwallMouTileBackgroundHoverColor = "offerwall_mou_tile_background_hover_color"
        case mouTileBackgroundColor = "mou_tile_background_color"
    }
} 