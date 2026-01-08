using System;
using System.Collections.Generic;

#nullable enable

namespace MomentsAPI.Models
{
    /// <summary>
    /// Model class for the complete API response from the offers endpoint.
    /// Contains the list of offers, styling information, and optional error details.
    /// </summary>
    [Serializable]
    public class OfferResponse
    {
        /// <summary>
        /// The data payload containing offers and styles.
        /// </summary>
        public OfferData? data;

        /// <summary>
        /// Optional error message from the API.
        /// </summary>
        public string? error;

        /// <summary>
        /// Returns true if the response contains offers.
        /// </summary>
        public bool HasOffers()
        {
            return data != null && data.HasOffers();
        }

        /// <summary>
        /// Returns true if the response contains an error.
        /// </summary>
        public bool HasError()
        {
            return !string.IsNullOrEmpty(error);
        }
    }

    /// <summary>
    /// Model class for the data section of the offer response.
    /// Contains the list of offers and styling configuration.
    /// </summary>
    [Serializable]
    public class OfferData
    {
        /// <summary>
        /// List of available offers.
        /// </summary>
        public List<Offer>? offers;

        /// <summary>
        /// Styling configuration for rendering offers.
        /// </summary>
        public OfferStyles? styles;

        /// <summary>
        /// Returns true if there are offers available.
        /// </summary>
        public bool HasOffers()
        {
            return offers != null && offers.Count > 0;
        }
    }
}
