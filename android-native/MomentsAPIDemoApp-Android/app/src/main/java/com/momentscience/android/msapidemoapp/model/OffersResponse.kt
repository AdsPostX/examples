package com.momentscience.android.msapidemoapp.model

/**
 * OffersResponse.kt
 * Defines the data models for the Moments Offers API response.
 * This file contains all the necessary models to decode and work with offers,
 * their styling, and associated metadata.
 *
 * The main components are:
 * - Offer: The core offer data structure
 * - OffersResponse: The top-level API response
 * - OffersStyles: Styling information for the offer UI
 * - Various supporting models for specific styling aspects
 */

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable


/**
 * Represents an offer from the API
 * An offer contains all the necessary information to display a promotional content item,
 * including text, images, tracking URLs, and interaction elements.
 */
@Serializable
data class Offer(
    /** Unique identifier for the offer */
    val id: Int,
    /** Associated campaign identifier */
    @SerialName("campaign_id")
    val campaignId: Int? = null,
    /** Main title of the offer */
    val title: String? = null,
    /** Detailed description of the offer */
    val description: String? = null,
    /** URL to handle when offer is clicked */
    @SerialName("click_url")
    val clickUrl: String? = null,
    /** Main image URL for the offer */
    val image: String? = null,
    /** Condensed text version of the offer */
    @SerialName("mini_text")
    val miniText: String? = null,
    /** Legal terms and conditions */
    @SerialName("terms_and_conditions")
    val termsAndConditions: String? = null,
    /** Tracking pixel URL for impression tracking */
    val pixel: String? = null,
    /** Text for the positive call-to-action button */
    @SerialName("cta_yes")
    val ctaYes: String? = null,
    /** Text for the negative call-to-action button */
    @SerialName("cta_no")
    val ctaNo: String? = null,
    /** Text for user action button */
    @SerialName("useraction_cta")
    val useractionCta: String? = null,
    /** URL for user action */
    @SerialName("useraction_url")
    val useractionUrl: String? = null,
    /** Advertiser pixel URL for tracking */
    @SerialName("adv_pixel_url")
    val advPixelUrl: String? = null,
    /** Tracking beacon URLs for various events */
    val beacons: Beacons? = null,
    /** Collection of creative assets */
    val creatives: List<Creative>? = null,
    /** Whether offer is enabled for offerwall */
    @SerialName("offerwall_enabled")
    val offerwallEnabled: Boolean? = null,
    /** Whether offer is enabled for perks wallet */
    @SerialName("perkswallet_enabled")
    val perkswallEnabled: Boolean? = null,
    /** Brief description for list views */
    @SerialName("short_description")
    val shortDescription: String? = null,
    /** Brief headline for list views */
    @SerialName("short_headline")
    val shortHeadline: String? = null,
    /** Name of the advertiser */
    @SerialName("advertiser_name")
    val advertiserName: String? = null,
    /** Whether this is a loyalty boost offer */
    @SerialName("is_loyaltyboost")
    val isLoyaltyboost: Boolean? = null,
    /** Requirements for loyalty boost */
    @SerialName("loyaltyboost_requirements")
    val loyaltyboostRequirements: String? = null,
    /** URL for saving offer for later */
    @SerialName("save_for_later_url")
    val saveForLaterUrl: String? = null,
    /** Categories or labels for the offer */
    val tags: List<String>? = null,
    /** Alternative description field */
    @SerialName("offer_description")
    val offerDescription: String? = null,
    /** Associated campaign details */
    val campaign: Campaign? = null,
    /** URL for offerwall version */
    @SerialName("offerwall_url")
    val offerwallUrl: String? = null,
    /** QR code image URL if applicable */
    @SerialName("qr_code_img")
    val qrCodeImg: String? = null
)

/**
 * Represents beacon URLs for tracking various user interactions
 * Beacons are fired when specific events occur during offer interaction
 */
@Serializable
data class Beacons(
    /** URL to ping when offer is closed */
    val close: String? = null,
    /** URL to ping when user clicks "No Thanks" */
    @SerialName("no_thanks_click")
    val noThanksClick: String? = null
)

/**
 * Represents a creative asset (image/media) for the offer
 * Creatives can be used for various purposes like thumbnails, banners, etc.
 */
@Serializable
data class Creative(
    /** Unique identifier for the creative */
    val id: Int,
    /** URL of the creative asset */
    val url: String? = null,
    /** Height of the creative in pixels */
    val height: Int? = null,
    /** Width of the creative in pixels */
    val width: Int? = null,
    /** Type of creative (e.g., "image", "video") */
    val type: String? = null,
    /** Specific creative type classification */
    @SerialName("creative_type")
    val creativeType: String? = null,
    /** Whether this is the primary creative for the offer */
    @SerialName("is_primary")
    val isPrimary: Boolean? = null,
    /** Aspect ratio of the creative (width/height) */
    @SerialName("aspect_ratio")
    val aspectRatio: Double? = null,
    /** Associated user identifier */
    @SerialName("user_id")
    val userId: Int? = null
)

/**
 * Represents campaign-specific information and assets
 */
@Serializable
data class Campaign(
    /** Collection of images associated with the campaign */
    @SerialName("campaign_images")
    val campaignImages: List<Creative>? = null,
    /** Campaign-specific offer description */
    @SerialName("offer_description")
    val offerDescription: String? = null,
    /** Whether the campaign is for a product */
    @SerialName("is_product")
    val isProduct: Boolean? = null
)

/**
 * Top-level response structure for the offers API
 * Contains the main data payload and any metadata
 */
@Serializable
data class OffersResponse(
    val data: OffersData? = null
)

/**
 * Container for offers data and associated metadata
 */
@Serializable
data class OffersData(
    /** Array of offers returned by the API */
    val offers: List<Offer>? = null,
    /** Total count of offers */
    val count: Int? = null,
    /** Styling information for rendering offers */
    val styles: OffersStyles? = null,
    /** URL to privacy policy */
    @SerialName("privacy_url")
    val privacyUrl: String? = null
)

/**
 * Represents comprehensive styling information for offers
 * Contains all visual customization options for the offer display
 */
@Serializable
data class OffersStyles(
    /** Styling for the popup container */
    val popup: PopupStyle? = null,
    /** Styling for the header section */
    val header: HeaderStyle? = null,
    /** Styling for offer text content */
    val offerText: OfferTextStyle? = null,
    /** Styling for the footer section */
    val footer: FooterStyle? = null,
    /** General settings for offer display */
    val settings: SettingsStyle? = null,
    /** Styling for offerwall display */
    val offerwall: OfferwallStyle? = null
)

/**
 * Defines styling for the popup container
 */
@Serializable
data class PopupStyle(
    /** Background color in hex format */
    val background: String? = null,
    /** Border radius configuration */
    val borderRadius: BorderRadius? = null,
    /** Shadow style */
    val shadow: String? = null,
    /** Light box effect style */
    val lightBox: String? = null,
    /** Position of the image */
    @SerialName("image_position")
    val imagePosition: String? = null,
    /** Whether to show images */
    val showImage: Boolean? = null
)

/**
 * Defines border radius for each corner
 */
@Serializable
data class BorderRadius(
    /** Top-left corner radius */
    @SerialName("top_left")
    val topLeft: String? = null,
    /** Top-right corner radius */
    @SerialName("top_right")
    val topRight: String? = null,
    /** Bottom-right corner radius */
    @SerialName("bottom_right")
    val bottomRight: String? = null,
    /** Bottom-left corner radius */
    @SerialName("bottom_left")
    val bottomLeft: String? = null
)

/**
 * Defines styling for the header section
 */
@Serializable
data class HeaderStyle(
    /** Header text content */
    val text: String? = null,
    /** Background color in hex format */
    val background: String? = null,
    /** Text color in hex format */
    val textColor: String? = null,
    /** Base font size */
    val fontSize: Int? = null,
    /** Font size for headline and lead-in text */
    val headLineAndLeadInFontSize: Int? = null,
    /** Lead-in text content */
    @SerialName("lead_in_text")
    val leadInText: String? = null,
    /** Lead-in text color */
    @SerialName("lead_in_text_color")
    val leadInTextColor: String? = null,
    /** Heading font size */
    @SerialName("heading_font_size")
    val headingFontSize: String? = null,
    /** Lead-in text alignment */
    @SerialName("lead_in_alignment")
    val leadInAlignment: String? = null
)

/**
 * Defines styling for offer text content
 */
@Serializable
data class OfferTextStyle(
    /** Size for CTA button text */
    @SerialName("cta_text_size")
    val ctaTextSize: String? = null,
    /** Style for CTA button text (e.g., "bold") */
    @SerialName("cta_text_style")
    val ctaTextStyle: String? = null,
    /** Whether to hide advertiser name */
    @SerialName("hide_adv_name")
    val hideAdvName: Boolean? = null,
    /** Main text color */
    val textColor: String? = null,
    /** Font family */
    val font: String? = null,
    /** Base font size */
    val fontSize: Int? = null,
    /** Style for positive CTA button */
    val buttonYes: ButtonStyle? = null,
    /** Style for negative CTA button */
    val buttonNo: ButtonStyle? = null,
    /** Button radius for offerwall */
    @SerialName("offerwall_mou_button_radius")
    val offerwallMouButtonRadius: Int? = null,
    /** Whether to show images */
    @SerialName("show_image")
    val showImage: Boolean? = null
)

/**
 * Defines styling for buttons
 */
@Serializable
data class ButtonStyle(
    /** Background color in hex format */
    val background: String? = null,
    /** Hover state color */
    val hover: String? = null,
    /** Border stroke color */
    val stroke: String? = null,
    /** Text color */
    val color: String? = null
)

/**
 * Defines styling for the footer section
 */
@Serializable
data class FooterStyle(
    /** Disclaimer text */
    val disclaimer: String? = null,
    /** Privacy text */
    val privacy: String? = null,
    /** General footer text */
    val text: String? = null,
    /** Whether to show APX links */
    @SerialName("show_apx_links")
    val showApxLinks: Boolean? = null,
    /** Publisher's privacy policy URL */
    @SerialName("publisher_privacy_policy")
    val publisherPrivacyPolicy: String? = null,
    /** Publisher's name */
    @SerialName("publisher_name")
    val publisherName: String? = null
)

/**
 * Defines general settings for offer display
 */
@Serializable
data class SettingsStyle(
    /** Position of the ad */
    @SerialName("ad_position")
    val adPosition: String? = null,
    /** Animation style for the ad */
    @SerialName("ad_animation")
    val adAnimation: String? = null,
    /** Order of buttons */
    @SerialName("button_order")
    val buttonOrder: String? = null,
    /** Text for saved offers */
    @SerialName("saved_offer_text")
    val savedOfferText: String? = null,
    /** Whether all USP offers are checked */
    @SerialName("usp_all_offers_checked")
    val uspAllOffersChecked: Boolean? = null,
    /** Whether to enable USP */
    @SerialName("enable_usp")
    val enableUsp: Boolean? = null,
    /** Type of progress bar */
    @SerialName("progress_bar_type")
    val progressBarType: String? = null,
    /** Text for USP CTA */
    @SerialName("usp_cta_text")
    val uspCtaText: String? = null,
    /** Whether to darken background */
    @SerialName("darken_bg")
    val darkenBg: Boolean? = null,
    /** Whether to darken non-centered background */
    @SerialName("darken_bg_non_centered")
    val darkenBgNonCentered: Boolean? = null,
    /** Delay in milliseconds */
    val delay: Int? = null,
    /** Whether to enable vertical offset */
    @SerialName("enable_vertical_offset")
    val enableVerticalOffset: Boolean? = null,
    /** Vertical offset for mobile */
    @SerialName("mobile_vertical_offset")
    val mobileVerticalOffset: Int? = null,
    /** Screen margin in pixels */
    @SerialName("screen_margin")
    val screenMargin: Int? = null,
    /** Whether to show disclaimer */
    @SerialName("show_disclaimer")
    val showDisclaimer: Boolean? = null,
    /** Whether to show close button */
    @SerialName("show_close")
    val showClose: Boolean? = null,
    /** Whether to enable close delay */
    @SerialName("enable_close_delay")
    val enableCloseDelay: Boolean? = null,
    /** Close delay in milliseconds */
    @SerialName("close_delay")
    val closeDelay: Int? = null
)

/**
 * Defines styling for offerwall display
 */
@Serializable
data class OfferwallStyle(
    /** Button styling for offerwall */
    val button: OfferwallButtonStyle? = null,
    /** Tile styling for offerwall */
    val tile: OfferwallTileStyle? = null,
    /** Radius for tiles */
    @SerialName("tile_radius")
    val tileRadius: Int? = null,
    /** URL for offerwall logo */
    @SerialName("offerwall_logo_url")
    val offerwallLogoUrl: String? = null,
    /** Gap between tiles */
    @SerialName("mou_tile_gap")
    val mouTileGap: Int? = null
)

/**
 * Defines button styling specific to offerwall
 */
@Serializable
data class OfferwallButtonStyle(
    /** Button background color */
    @SerialName("offerwall_mou_button_background")
    val offerwallMouButtonBackground: String? = null,
    /** Button text color */
    @SerialName("offerwall_mou_button_color")
    val offerwallMouButtonColor: String? = null,
    /** Button hover state color */
    @SerialName("offerwall_mou_button_hover")
    val offerwallMouButtonHover: String? = null,
    /** Button border stroke color */
    @SerialName("offerwall_mou_button_stroke")
    val offerwallMouButtonStroke: String? = null
)

/**
 * Defines tile styling specific to offerwall
 */
@Serializable
data class OfferwallTileStyle(
    /** Border color for tiles */
    @SerialName("offerwall_mou_border_color")
    val offerwallMouBorderColor: String? = null,
    /** Border thickness for tiles */
    @SerialName("offerwall_mou_border_thickness")
    val offerwallMouBorderThickness: Int? = null,
    /** Hover state background color for tiles */
    @SerialName("offerwall_mou_tile_background_hover_color")
    val offerwallMouTileBackgroundHoverColor: String? = null,
    /** Default background color for tiles */
    @SerialName("mou_tile_background_color")
    val mouTileBackgroundColor: String? = null
)