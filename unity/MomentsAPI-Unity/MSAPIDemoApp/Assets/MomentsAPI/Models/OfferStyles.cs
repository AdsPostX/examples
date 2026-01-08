using System;

#nullable enable

namespace MomentsAPI.Models
{
    /// <summary>
    /// Model class for offer styling configuration from API.
    /// Contains style information for customizing the offer UI.
    /// </summary>
    [Serializable]
    public class OfferStyles
    {
        /// <summary>
        /// Styles for the overall popup/container.
        /// </summary>
        public PopupStyles? popup;

        /// <summary>
        /// Styles for offer text elements (description, buttons, etc.).
        /// </summary>
        public OfferTextStyles? offerText;

        /// <summary>
        /// Gets the background color for the popup.
        /// </summary>
        public string GetPopupBackground()
        {
            return popup?.background ?? "#FFFFFF";
        }

        /// <summary>
        /// Gets the text color for offer description.
        /// </summary>
        public string GetTextColor()
        {
            return offerText?.textColor ?? "#000000";
        }

        /// <summary>
        /// Gets the font size for offer description.
        /// </summary>
        public string GetFontSize()
        {
            return offerText?.fontSize ?? "14";
        }

        /// <summary>
        /// Gets the CTA button text size.
        /// </summary>
        public string GetCtaTextSize()
        {
            return offerText?.cta_text_size ?? "14px";
        }

        /// <summary>
        /// Gets the CTA button text style (e.g., 'bold', 'normal').
        /// </summary>
        public string GetCtaTextStyle()
        {
            return offerText?.cta_text_style ?? "normal";
        }

        /// <summary>
        /// Gets the positive button (Yes) background color.
        /// </summary>
        public string GetButtonYesBackground()
        {
            return offerText?.buttonYes?.background ?? "#1C64F2";
        }

        /// <summary>
        /// Gets the positive button (Yes) text color.
        /// </summary>
        public string GetButtonYesColor()
        {
            return offerText?.buttonYes?.color ?? "#FFFFFF";
        }

        /// <summary>
        /// Gets the negative button (No) background color.
        /// </summary>
        public string GetButtonNoBackground()
        {
            return offerText?.buttonNo?.background ?? "#FFFFFF";
        }

        /// <summary>
        /// Gets the negative button (No) text color.
        /// </summary>
        public string GetButtonNoColor()
        {
            return offerText?.buttonNo?.color ?? "#6B7280";
        }
    }

    /// <summary>
    /// Styles for the popup container.
    /// </summary>
    [Serializable]
    public class PopupStyles
    {
        public string background = "#FFFFFF";
    }

    /// <summary>
    /// Styles for offer text and buttons.
    /// </summary>
    [Serializable]
    public class OfferTextStyles
    {
        public string? textColor;
        public string? fontSize;
        public string? cta_text_size;
        public string? cta_text_style;
        public ButtonStyles? buttonYes;
        public ButtonStyles? buttonNo;
    }

    /// <summary>
    /// Styles for individual buttons.
    /// </summary>
    [Serializable]
    public class ButtonStyles
    {
        public string? background;
        public string? color;
    }
}
