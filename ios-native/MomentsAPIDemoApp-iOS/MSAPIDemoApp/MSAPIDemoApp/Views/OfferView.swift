/// OfferView.swift
/// A view component responsible for rendering individual Moments offer content.
/// This view handles the presentation of offer details including title, image,
/// description, and call-to-action buttons with dynamic styling.
///
/// Key features:
/// - Responsive image loading with progress indication
/// - Scrollable content for variable length offers
/// - Dynamically styled CTA buttons
/// - Consistent spacing and layout
/// - Accessibility support
/// - Customizable button actions
/// - API-driven styling
///
/// The view adapts to different content types and lengths while maintaining
/// a consistent visual hierarchy and user experience.
///
/// Usage:
/// ```swift
/// OfferView(
///     offer: currentOffer,
///     buttonStyles: styles.offerText,
///     onPositiveCTA: handleAccept,
///     onNegativeCTA: handleDecline,
///     viewModel: viewModel
/// )
/// ```

import SwiftUI

/// A view that displays the content of a single offer
struct OfferView: View {
    /// The offer data to display
    let offer: Offer
    /// Styling information for text and buttons
    let buttonStyles: OfferTextStyle?
    /// Action to perform when the positive CTA is tapped
    let onPositiveCTA: () -> Void
    /// Action to perform when the negative CTA is tapped
    let onNegativeCTA: () -> Void
    /// View model for accessing styling and state
    @ObservedObject var viewModel: OffersViewModel
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Title section
                if let title = offer.title, !title.isEmpty {
                    Text(title)
                        .font(.title2)
                        .foregroundColor(viewModel.getTitleTextColor())
                        .fontWeight(.bold)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                
                // Image section with loading state
                if let imageUrl = offer.image,
                   !imageUrl.isEmpty,
                   let url = URL(string: imageUrl) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(height: 150)
                    } placeholder: {
                        ProgressView()
                    }
                }
                
                // Description section
                if let description = offer.description, !description.isEmpty {
                    Text(description)
                        .font(viewModel.getDescriptionFont())
                        .foregroundColor(viewModel.getDescriptionTextColor())
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                
                // CTA Buttons section
                VStack(spacing: 12) {
                    // Positive CTA button
                    if let ctaYes = offer.ctaYes, !ctaYes.isEmpty {
                        Button(action: onPositiveCTA) {
                            Text(ctaYes)
                                .font(viewModel.getButtonFont())
                                .padding([.leading, .trailing], 30)
                                .padding([.top, .bottom], 15)
                                .frame(maxWidth: .infinity)
                                .background(buttonStyles?.buttonYes?.background.map { Color(hexString: $0) } ?? Color.momentsPrimary)
                                .foregroundColor(buttonStyles?.buttonYes?.color.map { Color(hexString: $0) } ?? Color.momentsWhite)
                                .cornerRadius(10)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(
                                            buttonStyles?.buttonYes?.stroke.map { Color(hexString: $0) } ?? .clear,
                                            lineWidth: buttonStyles?.buttonYes?.stroke != nil ? 1 : 0
                                        )
                                )
                        }
                    }
                    
                    // Negative CTA button
                    if let ctaNo = offer.ctaNo, !ctaNo.isEmpty {
                        Button(action: onNegativeCTA) {
                            Text(ctaNo)
                                .font(viewModel.getButtonFont())
                                .padding([.leading, .trailing], 30)
                                .padding([.top, .bottom], 15)
                                .frame(maxWidth: .infinity)
                                .background(buttonStyles?.buttonNo?.background.map { Color(hexString: $0) } ?? Color.momentsWhite)
                                .foregroundColor(buttonStyles?.buttonNo?.color.map { Color(hexString: $0) } ?? Color.momentsPrimary)
                                .cornerRadius(10)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(
                                            buttonStyles?.buttonNo?.stroke.map { Color(hexString: $0) } ?? .clear,
                                            lineWidth: buttonStyles?.buttonNo?.stroke != nil ? 1 : 0
                                        )
                                )
                        }
                    }
                }
                .padding()
            }
            .padding(.vertical)
        }
    }
}

