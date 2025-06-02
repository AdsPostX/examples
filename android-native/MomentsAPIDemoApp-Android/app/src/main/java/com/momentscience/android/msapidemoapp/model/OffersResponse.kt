package com.momentscience.android.msapidemoapp.model

import com.google.gson.annotations.SerializedName

/**
 * Root response object from the Moments Offers API.
 * Contains the main offers data, styling information, and configuration.
 *
 * @property data Contains the list of offers and related data
 * @property count Total number of offers returned
 * @property styles UI styling configuration for the offers display
 * @property privacyUrl URL to the privacy policy
 */
data class OffersResponse(
    val data: OffersData? = null,
    val count: Int? = null,
    val styles: Styles? = null,
    @SerializedName("privacy_url")
    val privacyUrl: String? = null
)

/**
 * Container for the list of offers.
 *
 * @property offers List of individual offer objects
 */
data class OffersData(
    val offers: List<Offer>? = null
)

/**
 * Represents a single offer with all its details and configuration.
 * Each offer contains information about the campaign, visuals, and interaction options.
 *
 * @property id Unique identifier for the offer
 * @property campaignId Associated campaign identifier
 * @property title Main title of the offer
 * @property description Detailed description of the offer
 * @property clickUrl URL to be opened when the offer is clicked
 * @property image Main image URL for the offer
 * @property miniText Small text usually shown below the offer
 * @property termsAndConditions HTML formatted terms and conditions
 * @property pixel Tracking pixel URL
 * @property ctaYes Text for the positive call-to-action button
 * @property ctaNo Text for the negative call-to-action button
 * @property userActionCta Custom CTA text for user actions
 * @property userActionUrl URL for custom user actions
 * @property advPixelUrl Advertiser's tracking pixel URL
 * @property beacons Tracking beacon configurations
 * @property creatives List of creative assets for the offer
 * @property offerwallEnabled Whether this offer can appear in an offerwall
 * @property perksWalletEnabled Whether this offer supports perks wallet features
 * @property shortDescription Condensed version of the description
 * @property shortHeadline Condensed version of the title
 * @property advertiserName Name of the advertiser
 * @property isLoyaltyBoost Whether this is a loyalty boost offer
 * @property loyaltyBoostRequirements Requirements for loyalty boost
 * @property saveForLaterUrl URL for saving the offer
 * @property tags List of tags associated with the offer
 * @property offerDescription Additional offer description
 * @property campaign Campaign-specific details
 * @property offerwallUrl URL for the offerwall version
 * @property qrCodeImg URL of the QR code image
 */
data class Offer(
    val id: Int,
    @SerializedName("campaign_id")
    val campaignId: Int? = null,
    val title: String? = null,
    val description: String? = null,
    @SerializedName("click_url")
    val clickUrl: String? = null,
    val image: String? = null,
    @SerializedName("mini_text")
    val miniText: String? = null,
    @SerializedName("terms_and_conditions")
    val termsAndConditions: String? = null,
    val pixel: String? = null,
    @SerializedName("cta_yes")
    val ctaYes: String? = null,
    @SerializedName("cta_no")
    val ctaNo: String? = null,
    @SerializedName("useraction_cta")
    val userActionCta: String? = null,
    @SerializedName("useraction_url")
    val userActionUrl: String? = null,
    @SerializedName("adv_pixel_url")
    val advPixelUrl: String? = null,
    val beacons: Beacons? = null,
    val creatives: List<Creative>? = null,
    @SerializedName("offerwall_enabled")
    val offerwallEnabled: Boolean? = null,
    @SerializedName("perkswallet_enabled")
    val perksWalletEnabled: Boolean? = null,
    @SerializedName("short_description")
    val shortDescription: String? = null,
    @SerializedName("short_headline")
    val shortHeadline: String? = null,
    @SerializedName("advertiser_name")
    val advertiserName: String? = null,
    @SerializedName("is_loyaltyboost")
    val isLoyaltyBoost: Boolean? = null,
    @SerializedName("loyaltyboost_requirements")
    val loyaltyBoostRequirements: String? = null,
    @SerializedName("save_for_later_url")
    val saveForLaterUrl: String? = null,
    val tags: List<String>? = null,
    @SerializedName("offer_description")
    val offerDescription: String? = null,
    val campaign: Campaign? = null,
    @SerializedName("offerwall_url")
    val offerwallUrl: String? = null,
    @SerializedName("qr_code_img")
    val qrCodeImg: String? = null
)

/**
 * Configuration for tracking beacons.
 *
 * @property close URL to ping when offer is closed
 * @property noThanksClick URL to ping when offer is declined
 */
data class Beacons(
    val close: String? = null,
    @SerializedName("no_thanks_click")
    val noThanksClick: String? = null
)

/**
 * Represents a creative asset (image, video, etc.) for an offer.
 *
 * @property id Unique identifier for the creative
 * @property url URL of the creative asset
 * @property height Height in pixels
 * @property width Width in pixels
 * @property type File type (e.g., "png", "jpg")
 * @property creativeType Type of creative (e.g., "icon_image")
 * @property isPrimary Whether this is the primary creative
 * @property aspectRatio Width to height ratio
 * @property userId Associated user ID
 */
data class Creative(
    val id: Int,
    val url: String? = null,
    val height: Int? = null,
    val width: Int? = null,
    val type: String? = null,
    @SerializedName("creative_type")
    val creativeType: String? = null,
    @SerializedName("is_primary")
    val isPrimary: Boolean? = null,
    @SerializedName("aspect_ratio")
    val aspectRatio: Float? = null,
    @SerializedName("user_id")
    val userId: Int? = null
)

/**
 * Campaign-specific information for an offer.
 *
 * @property campaignImages List of creative assets for the campaign
 * @property offerDescription Campaign-specific offer description
 * @property isProduct Whether this campaign is for a product
 */
data class Campaign(
    @SerializedName("campaign_images")
    val campaignImages: List<Creative>? = null,
    @SerializedName("offer_description")
    val offerDescription: String? = null,
    @SerializedName("is_product")
    val isProduct: Boolean? = null
)

/**
 * Complete styling configuration for the offers UI.
 *
 * @property popup Styling for the popup container
 * @property header Styling for the header section
 * @property offerText Styling for the offer text and buttons
 * @property footer Styling for the footer section
 * @property settings General UI settings
 * @property offerwall Styling for the offerwall view
 */
data class Styles(
    val popup: PopupStyle? = null,
    val header: HeaderStyle? = null,
    @SerializedName("offerText")
    val offerText: OfferTextStyle? = null,
    val footer: FooterStyle? = null,
    val settings: StyleSettings? = null,
    val offerwall: OfferwallStyle? = null
)

/**
 * Styling configuration for the popup container.
 *
 * @property background Background color
 * @property borderRadius Border radius configuration
 * @property shadow Shadow styling
 * @property lightBox Light box styling
 * @property imagePosition Position of the main image
 * @property showImage Whether to show images
 */
data class PopupStyle(
    val background: String? = null,
    val borderRadius: BorderRadius? = null,
    val shadow: String? = null,
    val lightBox: String? = null,
    @SerializedName("image_position")
    val imagePosition: String? = null,
    val showImage: Boolean? = null
)

/**
 * Border radius configuration for UI elements.
 *
 * @property topLeft Top-left corner radius
 * @property topRight Top-right corner radius
 * @property bottomRight Bottom-right corner radius
 * @property bottomLeft Bottom-left corner radius
 */
data class BorderRadius(
    @SerializedName("top_left")
    val topLeft: String? = null,
    @SerializedName("top_right")
    val topRight: String? = null,
    @SerializedName("bottom_right")
    val bottomRight: String? = null,
    @SerializedName("bottom_left")
    val bottomLeft: String? = null
)

/**
 * Styling configuration for the header section.
 *
 * @property text Header text content
 * @property background Background color
 * @property textColor Text color
 * @property fontSize Font size in pixels
 * @property headLineAndLeadInFontSize Font size for headlines
 * @property leadInText Lead-in text content
 * @property leadInTextColor Lead-in text color
 * @property headingFontSize Heading font size
 * @property leadInAlignment Lead-in text alignment
 */
data class HeaderStyle(
    val text: String? = null,
    val background: String? = null,
    val textColor: String? = null,
    val fontSize: Int? = null,
    @SerializedName("headLineAndLeadInFontSize")
    val headLineAndLeadInFontSize: Int? = null,
    @SerializedName("lead_in_text")
    val leadInText: String? = null,
    @SerializedName("lead_in_text_color")
    val leadInTextColor: String? = null,
    @SerializedName("heading_font_size")
    val headingFontSize: String? = null,
    @SerializedName("lead_in_alignment")
    val leadInAlignment: String? = null
)

/**
 * Styling configuration for offer text and buttons.
 *
 * @property ctaTextSize Call-to-action button text size
 * @property ctaTextStyle Call-to-action button text style
 * @property hideAdvName Whether to hide advertiser name
 * @property textColor Text color
 * @property font Font family
 * @property fontSize Font size in pixels
 * @property buttonYes Styling for positive button
 * @property buttonNo Styling for negative button
 * @property offerwallMouButtonRadius Button radius in offerwall
 * @property showImage Whether to show images
 */
data class OfferTextStyle(
    @SerializedName("cta_text_size")
    val ctaTextSize: String? = null,
    @SerializedName("cta_text_style")
    val ctaTextStyle: String? = null,
    @SerializedName("hide_adv_name")
    val hideAdvName: Boolean? = null,
    val textColor: String? = null,
    val font: String? = null,
    val fontSize: Int? = null,
    val buttonYes: ButtonStyle? = null,
    val buttonNo: ButtonStyle? = null,
    @SerializedName("offerwall_mou_button_radius")
    val offerwallMouButtonRadius: Int? = null,
    @SerializedName("show_image")
    val showImage: Boolean? = null
)

/**
 * Styling configuration for buttons.
 *
 * @property background Background color
 * @property hover Hover state color
 * @property stroke Border color
 * @property color Text color
 */
data class ButtonStyle(
    val background: String? = null,
    val hover: String? = null,
    val stroke: String? = null,
    val color: String? = null
)

/**
 * Styling configuration for the footer section.
 *
 * @property disclaimer Disclaimer text
 * @property privacy Privacy policy URL
 * @property text Footer text content
 * @property showApxLinks Whether to show APX links
 * @property publisherPrivacyPolicy Publisher's privacy policy URL
 * @property publisherName Publisher's name
 */
data class FooterStyle(
    val disclaimer: String? = null,
    val privacy: String? = null,
    val text: String? = null,
    @SerializedName("show_apx_links")
    val showApxLinks: Boolean? = null,
    @SerializedName("publisher_privacy_policy")
    val publisherPrivacyPolicy: String? = null,
    @SerializedName("publisher_name")
    val publisherName: String? = null
)

/**
 * General UI settings and behavior configuration.
 *
 * @property adPosition Position of the ad
 * @property adAnimation Animation type
 * @property buttonOrder Order of buttons
 * @property savedOfferText Text for saved offers
 * @property enableUsp Whether to enable USP
 * @property progressBarType Type of progress bar
 * @property darkenBg Whether to darken background
 * @property delay Delay in milliseconds
 * @property showDisclaimer Whether to show disclaimer
 * @property showClose Whether to show close button
 * @property enableCloseDelay Whether to enable close delay
 * @property closeDelay Close delay in seconds
 */
data class StyleSettings(
    @SerializedName("ad_position")
    val adPosition: String? = null,
    @SerializedName("ad_animation")
    val adAnimation: String? = null,
    @SerializedName("button_order")
    val buttonOrder: String? = null,
    @SerializedName("saved_offer_text")
    val savedOfferText: String? = null,
    @SerializedName("enable_usp")
    val enableUsp: Boolean? = null,
    @SerializedName("progress_bar_type")
    val progressBarType: String? = null,
    @SerializedName("darken_bg")
    val darkenBg: Boolean? = null,
    val delay: Int? = null,
    @SerializedName("show_disclaimer")
    val showDisclaimer: Boolean? = null,
    @SerializedName("show_close")
    val showClose: Boolean? = null,
    @SerializedName("enable_close_delay")
    val enableCloseDelay: Boolean? = null,
    @SerializedName("close_delay")
    val closeDelay: Int? = null
)

/**
 * Styling configuration for the offerwall view.
 *
 * @property button Button styling in offerwall
 * @property tile Tile styling in offerwall
 * @property tileRadius Tile corner radius
 * @property offerwallLogoUrl URL for offerwall logo
 * @property mouTileGap Gap between tiles
 */
data class OfferwallStyle(
    val button: OfferwallButtonStyle? = null,
    val tile: OfferwallTileStyle? = null,
    @SerializedName("tile_radius")
    val tileRadius: Int? = null,
    @SerializedName("offerwall_logo_url")
    val offerwallLogoUrl: String? = null,
    @SerializedName("mou_tile_gap")
    val mouTileGap: Int? = null
)

/**
 * Button styling configuration for offerwall.
 *
 * @property background Button background color
 * @property color Button text color
 * @property hover Button hover color
 * @property stroke Button border color
 */
data class OfferwallButtonStyle(
    @SerializedName("offerwall_mou_button_background")
    val background: String? = null,
    @SerializedName("offerwall_mou_button_color")
    val color: String? = null,
    @SerializedName("offerwall_mou_button_hover")
    val hover: String? = null,
    @SerializedName("offerwall_mou_button_stroke")
    val stroke: String? = null
)

/**
 * Tile styling configuration for offerwall.
 *
 * @property borderColor Tile border color
 * @property borderThickness Tile border thickness
 * @property backgroundHoverColor Tile background color on hover
 * @property backgroundColor Tile background color
 */
data class OfferwallTileStyle(
    @SerializedName("offerwall_mou_border_color")
    val borderColor: String? = null,
    @SerializedName("offerwall_mou_border_thickness")
    val borderThickness: Int? = null,
    @SerializedName("offerwall_mou_tile_background_hover_color")
    val backgroundHoverColor: String? = null,
    @SerializedName("mou_tile_background_color")
    val backgroundColor: String? = null
) 