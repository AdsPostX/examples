/// NavigationButtonsView.swift
/// A reusable view component that provides navigation controls for browsing through offers.
/// This view presents previous and next buttons with appropriate styling and state management.
///
/// Key features:
/// - Responsive navigation buttons
/// - Automatic state management (enabled/disabled)
/// - Consistent system image usage
/// - Customizable action handlers
/// - Accessible tap targets
/// - Visual feedback for button states
///
/// Usage:
/// ```swift
/// NavigationButtonsView(
///     hasPrevious: viewModel.hasPreviousOffer,
///     hasNext: viewModel.hasNextOffer,
///     onPrevious: viewModel.showPreviousOffer,
///     onNext: viewModel.showNextOffer
/// )
/// ```

import SwiftUI

/// A view that displays navigation controls for browsing through content
struct NavigationButtonsView: View {
    /// Indicates if there is previous content available
    let hasPrevious: Bool
    /// Indicates if there is next content available
    let hasNext: Bool
    /// Action to perform when the previous button is tapped
    let onPrevious: () -> Void
    /// Action to perform when the next button is tapped
    let onNext: () -> Void
    
    var body: some View {
        HStack {
            // Previous button
            Button(action: onPrevious) {
                Image(systemName: "chevron.left")
                    .imageScale(.large)
            }
            .disabled(!hasPrevious)
            
            Spacer()
            
            // Next button
            Button(action: onNext) {
                Image(systemName: "chevron.right")
                    .imageScale(.large)
            }
            .disabled(!hasNext)
        }
        .padding()
        .background(Color.gray.opacity(0.1))
    }
}

#Preview {
    NavigationButtonsView(
        hasPrevious: true,
        hasNext: true,
        onPrevious: {},
        onNext: {}
    )
} 