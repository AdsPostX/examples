using System;

#nullable enable

namespace MomentsAPI.Models
{
    /// <summary>
    /// Model class for a single offer.
    /// Contains all offer details including content, images, and tracking information.
    /// </summary>
    [Serializable]
    public class Offer
    {
        /// <summary>
        /// Unique identifier for the offer.
        /// </summary>
        public string id = "";

        /// <summary>
        /// The title of the offer.
        /// </summary>
        public string? title;

        /// <summary>
        /// The description or details of the offer.
        /// </summary>
        public string? description;

        /// <summary>
        /// The URL of the image to display for the offer.
        /// </summary>
        public string? image;

        /// <summary>
        /// The URL to open when the user accepts the offer.
        /// </summary>
        public string? click_url;

        /// <summary>
        /// The label for the positive (accept) call-to-action button.
        /// </summary>
        public string? cta_yes;

        /// <summary>
        /// The label for the negative (decline) call-to-action button.
        /// </summary>
        public string? cta_no;

        /// <summary>
        /// Tracking beacons for various user actions.
        /// </summary>
        public OfferBeacons? beacons;

        /// <summary>
        /// Optional pixel tracking URL.
        /// </summary>
        public string? pixel;

        /// <summary>
        /// Optional advertiser pixel tracking URL.
        /// </summary>
        public string? adv_pixel_url;
    }
}
