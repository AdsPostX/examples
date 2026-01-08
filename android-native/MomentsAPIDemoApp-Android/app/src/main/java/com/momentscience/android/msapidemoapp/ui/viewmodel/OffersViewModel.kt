package com.momentscience.android.msapidemoapp.ui.viewmodel

import android.content.Intent
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.momentscience.android.msapidemoapp.model.Offer
import com.momentscience.android.msapidemoapp.model.OffersResponse
import com.momentscience.android.msapidemoapp.repository.OffersRepository
import com.momentscience.android.msapidemoapp.service.OffersError
import com.momentscience.android.msapidemoapp.ui.theme.Dimensions
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * Represents the different states that the offers UI can be in.
 * This sealed interface provides type-safe state management for the offers screen.
 *
 * States:
 * - [Loading]: Initial state when fetching offers
 * - [Success]: Offers loaded successfully with navigation capabilities
 * - [Error]: Error state with user-friendly message
 */
sealed interface OffersUiState {
    /** Indicates that offers are being loaded */
    data object Loading : OffersUiState

    /**
     * Represents a successful state with loaded offers and navigation state.
     *
     * @property offers The complete offers response from the API
     * @property currentOfferIndex Current position in the offers list (default: 0)
     *
     * Properties:
     * - [currentOffer]: The currently displayed offer or null if index is invalid
     * - [hasNextOffer]: Whether there are more offers after the current one
     * - [hasPreviousOffer]: Whether there are offers before the current one
     */
    data class Success(
        val offers: OffersResponse,
        val currentOfferIndex: Int = 0
    ) : OffersUiState {
        val currentOffer: Offer? get() = offers.data?.offers?.getOrNull(currentOfferIndex)
        val hasNextOffer: Boolean get() = offers.data?.offers?.let { currentOfferIndex < it.size - 1 } ?: false
        val hasPreviousOffer: Boolean get() = currentOfferIndex > 0
    }

    /**
     * Represents an error state with the error object.
     * The UI layer is responsible for formatting the error message using string resources.
     *
     * @property error The error that occurred during offer fetching
     */
    data class Error(val error: Throwable) : OffersUiState
}

/**
 * ViewModel responsible for managing the offers feature business logic and state.
 * This class handles offer navigation, tracking beacons, and user interactions.
 *
 * Key Responsibilities:
 * - Fetching and managing offers data
 * - Handling user interactions (CTA clicks, navigation)
 * - Managing offer navigation (previous/next)
 * - Firing tracking beacons
 * - Maintaining UI state
 *
 * State Management:
 * - Uses [StateFlow] for reactive state updates
 * - Manages loading, success, and error states
 * - Handles navigation and close events
 *
 * @property repository Repository for fetching offers and firing beacons
 */
class OffersViewModel(
    private val repository: OffersRepository
) : ViewModel() {

    // UI state management
    private val _uiState = MutableStateFlow<OffersUiState>(OffersUiState.Loading)
    val uiState: StateFlow<OffersUiState> = _uiState.asStateFlow()

    // Navigation event management
    private val _navigationEvent = MutableStateFlow<Uri?>(null)
    val navigationEvent: StateFlow<Uri?> = _navigationEvent.asStateFlow()

    // Close event management
    private val _closeEvent = MutableStateFlow(false)
    val closeEvent: StateFlow<Boolean> = _closeEvent.asStateFlow()

    /**
     * Fetches offers from the repository and updates the UI state accordingly.
     * This method handles the complete offer fetching flow including error handling
     * and initial beacon firing.
     *
     * @param apiKey Authentication key for the API
     * @param loyaltyBoost Optional loyalty boost level
     * @param creative Optional creative variant
     * @param campaignId Optional campaign ID to filter offers (default: null)
     * @param isDevelopment Whether to use development mode (default: false)
     * @param payload Additional parameters to be sent with the request (default: empty map)
     *
     * Flow:
     * 1. Sets loading state
     * 2. Attempts to fetch offers
     * 3. Updates UI state based on result
     * 4. Fires initial pixel beacon if offers are loaded
     */
    fun fetchOffers(
        apiKey: String,
        loyaltyBoost: String? = null,
        creative: String? = null,
        campaignId: String? = null,
        isDevelopment: Boolean = false,
        payload: Map<String, String> = emptyMap()
    ) {
        viewModelScope.launch {
            _uiState.value = OffersUiState.Loading
            
            repository.fetchOffers(
                apiKey = apiKey,
                loyaltyBoost = loyaltyBoost,
                creative = creative,
                campaignId = campaignId,
                isDevelopment = isDevelopment,
                payload = payload
            ).onSuccess { offers ->
                _uiState.value = OffersUiState.Success(offers)
                // Fire pixel beacon for first offer
                offers.data?.offers?.firstOrNull()?.pixel?.let { pixel ->
                    fireBeacon(pixel)
                }
                offers.data?.offers?.firstOrNull()?.advPixelUrl?.let { advPixelUrl ->
                    fireBeacon(advPixelUrl)
                }
            }.onFailure { error ->
                // Store the error itself, let the UI layer format the message
                _uiState.value = OffersUiState.Error(error)
            }
        }
    }

    /**
     * Handles user interaction with the positive CTA button.
     * This method manages the complete positive interaction flow including
     * URL navigation, beacon firing, and offer navigation.
     *
     * Flow:
     * 1. Opens click URL in browser (if available)
     * 2. For last offer: Fires close beacon and triggers close event
     * 3. For other offers: Moves to next offer
     *
     * @param offer The offer that was interacted with
     */
    fun onPositiveClick(offer: Offer) {
        viewModelScope.launch {
            val currentState = _uiState.value as? OffersUiState.Success ?: return@launch
            
            // Open click URL in browser
            offer.clickUrl?.let { url ->
                _navigationEvent.value = Uri.parse(url)
            }

            // If this is the last offer, add delay before firing close beacon
            if (!currentState.hasNextOffer) {
                delay(Dimensions.BeaconFireDelayMillis) // Wait for URL to open
                currentState.currentOffer?.beacons?.close?.let { url ->
                    fireBeacon(url)
                }
                _closeEvent.value = true
            } else {
                // Move to next offer
                moveToNextOffer()
            }
        }
    }

    /**
     * Handles user interaction with the negative CTA button.
     * This method manages the complete negative interaction flow including
     * beacon firing and offer navigation.
     *
     * Flow:
     * 1. Fires "no thanks" beacon asynchronously
     * 2. Attempts to move to next offer
     * 3. Triggers close event if no more offers
     *
     * @param offer The offer that was interacted with
     */
    fun onNegativeClick(offer: Offer) {
        viewModelScope.launch {
            // Fire no thanks beacon asynchronously
            offer.beacons?.noThanksClick?.let { url ->
                launch {
                    fireBeacon(url)
                }
            }
            // Move to next offer or close immediately
            if (!moveToNextOffer()) {
                _closeEvent.value = true
            }
        }
    }

    /**
     * Handles the close action for an offer.
     * Fires the close beacon and triggers the close event.
     *
     * @param offer The offer being closed
     */
    fun onClose(offer: Offer) {
        viewModelScope.launch {
            offer.beacons?.close?.let { url ->
                fireBeacon(url)
            }
            _closeEvent.value = true
        }
    }

    /**
     * Attempts to navigate to the next offer in the sequence.
     * This method handles the complete next offer navigation flow including
     * state updates and beacon firing.
     *
     * Flow:
     * 1. Validates current state
     * 2. Updates offer index if possible
     * 3. Fires pixel beacon for new offer
     *
     * @return true if successfully moved to next offer, false otherwise
     */
    fun moveToNextOffer(): Boolean {
        val currentState = _uiState.value as? OffersUiState.Success ?: return false
        
        return if (currentState.hasNextOffer) {
            _uiState.value = currentState.copy(currentOfferIndex = currentState.currentOfferIndex + 1)
            // Fire pixel beacon for new offer
            currentState.offers.data?.offers?.getOrNull(currentState.currentOfferIndex + 1)?.pixel?.let { pixel ->
                viewModelScope.launch {
                    fireBeacon(pixel)
                }
            }
            currentState.offers.data?.offers?.getOrNull(currentState.currentOfferIndex + 1)?.advPixelUrl?.let { advPixelUrl ->
                viewModelScope.launch {
                    fireBeacon(advPixelUrl)
                }
            }

            true
        } else {
            false
        }
    }

    /**
     * Attempts to navigate to the previous offer in the sequence.
     * This method handles the complete previous offer navigation flow including
     * state updates and beacon firing.
     *
     * Flow:
     * 1. Validates current state
     * 2. Updates offer index if possible
     * 3. Fires pixel beacon for new offer
     *
     * @return true if successfully moved to previous offer, false otherwise
     */
    fun moveToPreviousOffer(): Boolean {
        val currentState = _uiState.value as? OffersUiState.Success ?: return false
        
        return if (currentState.hasPreviousOffer) {
            _uiState.value = currentState.copy(currentOfferIndex = currentState.currentOfferIndex - 1)
            // Fire pixel beacon for new offer
            currentState.offers.data?.offers?.getOrNull(currentState.currentOfferIndex - 1)?.pixel?.let { pixel ->
                viewModelScope.launch {
                    fireBeacon(pixel)
                }
            }
            currentState.offers.data?.offers?.getOrNull(currentState.currentOfferIndex - 1)?.advPixelUrl?.let { advPixelUrl ->
                viewModelScope.launch {
                    fireBeacon(advPixelUrl)
                }
            }
            true
        } else {
            false
        }
    }

    /**
     * Fires a tracking beacon to the specified URL.
     * This method handles the beacon request and logs any failures.
     *
     * @param url The beacon URL to fire
     */
    private suspend fun fireBeacon(url: String) {
        repository.fireBeacon(url)
            .onFailure { error ->
                android.util.Log.e("OffersViewModel", "Failed to fire beacon", error)
            }
    }

    /**
     * Clears the navigation event after it has been handled.
     * This prevents duplicate navigation attempts.
     */
    fun clearNavigationEvent() {
        _navigationEvent.value = null
    }

    /**
     * Clears the close event after it has been handled.
     * This prevents duplicate close attempts.
     */
    fun clearCloseEvent() {
        _closeEvent.value = false
    }

    fun getUserAgent() : String {
        return repository.getUserAgent()
    }
} 