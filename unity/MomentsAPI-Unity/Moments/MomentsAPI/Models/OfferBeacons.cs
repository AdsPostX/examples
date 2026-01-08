using System;

#nullable enable

namespace MomentsAPI.Models
{
    /// <summary>
    /// Model class for offer tracking beacons.
    /// Contains URLs for various tracking events.
    /// </summary>
    [Serializable]
    public class OfferBeacons
    {
        /// <summary>
        /// Beacon URL to fire when the offer is closed.
        /// </summary>
        public string? close;

        /// <summary>
        /// Beacon URL to fire when user clicks "no thanks" or declines.
        /// </summary>
        public string? no_thanks_click;
    }
}
