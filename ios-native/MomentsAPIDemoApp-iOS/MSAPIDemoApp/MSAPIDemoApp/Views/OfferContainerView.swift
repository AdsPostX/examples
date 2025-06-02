/// OfferContainerView.swift
/// A container view that manages the presentation of Moments offers, including loading states,
/// error handling, and navigation between multiple offers.
///
/// Key features:
/// - Full-screen modal presentation with custom styling
/// - Loading state indication with progress view
/// - Comprehensive error handling and retry functionality
/// - Close button with beacon tracking integration
/// - Smooth navigation between multiple offers
/// - Handles both positive and negative user responses
/// - Automatic beacon firing for user interactions
/// - Dynamic styling based on API response
///
/// The view maintains a clean, professional layout while providing
/// all necessary functionality for offer presentation and interaction.
///
/// Usage:
/// ```swift
/// OfferContainerView(viewModel: offersViewModel)
///     .environmentObject(navigationState)
/// ```

import SwiftUI

/// A view that presents offers in a full-screen modal interface
struct OfferContainerView: View {
    /// View model that manages the offers and their state
    @ObservedObject var viewModel: OffersViewModel
    /// Environment value for dismissing the view
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        ZStack {
            // Semi-transparent background from API styling
            viewModel.getPopupBackgroundColor()
                .ignoresSafeArea()
            
            if viewModel.isLoading {
                // Loading state
                ProgressView("Loading offers...")
                    .foregroundColor(.white)
            } else if let error = viewModel.error {
                // Error state with retry option
                VStack(spacing: 16) {
                    Text(error)
                        .foregroundColor(.red)
                        .padding()
                    
                    HStack(spacing: 20) {
                        Button("Close") {
                            dismiss()
                        }
                        .foregroundColor(.gray)
                        
                        Button("Try Again") {
                            viewModel.loadOffers()
                        }
                        .foregroundColor(.blue)
                    }
                }
                .background(Color.white)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .padding()
            } else if let offer = viewModel.currentOffer {
                // Main offer display container
                VStack(spacing: 0) {
                    // Close button with beacon tracking
                    HStack {
                        Spacer()
                        Button {
                            Task {
                                await viewModel.fireCloseBeacon()
                                dismiss()
                            }
                        } label: {
                            Image(systemName: "xmark")
                                .imageScale(.large)
                                .foregroundColor(.gray)
                                .padding()
                        }
                    }
                    
                    // Main offer content
                    OfferView(
                        offer: offer,
                        buttonStyles: viewModel.styles?.offerText,
                        onPositiveCTA: {
                            // Handle positive response
                            if let clickUrl = offer.clickUrl, 
                               let url = URL(string: clickUrl),
                               UIApplication.shared.canOpenURL(url) {
                                UIApplication.shared.open(url)
                            }
                            
                            // Navigate or dismiss
                            if viewModel.hasNextOffer {
                                viewModel.showNextOffer()
                            } else {
                                Task {
                                    await viewModel.fireCloseBeacon()
                                    dismiss()
                                }
                            }
                        },
                        onNegativeCTA: {
                            // Handle negative response
                            if let beacons = offer.beacons,
                               let noThanksClickUrl = beacons.noThanksClick,
                               !noThanksClickUrl.isEmpty,
                               let url = URL(string: noThanksClickUrl) {
                                viewModel.fireBeaconRequest(url: url)
                            }
                            
                            // Navigate or dismiss
                            if viewModel.hasNextOffer {
                                viewModel.showNextOffer()
                            } else {
                                // On last offer, fire close beacon and dismiss
                                Task {
                                    // Fire close beacon and wait for it to complete
                                    await viewModel.fireCloseBeacon()
                                    // If no more offers, close the container
                                    dismiss()
                                }
                            }
                        }, viewModel: viewModel
                    )
                    
                    // Navigation controls
                    NavigationButtonsView(
                        hasPrevious: viewModel.hasPreviousOffer,
                        hasNext: viewModel.hasNextOffer,
                        onPrevious: viewModel.showPreviousOffer,
                        onNext: viewModel.showNextOffer
                    )
                }
                .background(Color.white)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .padding(.horizontal)
                .padding(.vertical, 40)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .statusBar(hidden: true)
    }
} 
