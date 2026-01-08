package com.momentscience.android.msapidemoapp.di

import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.CreationExtras
import com.momentscience.android.msapidemoapp.repository.OffersRepository
import com.momentscience.android.msapidemoapp.repository.OffersRepositoryImpl
import com.momentscience.android.msapidemoapp.service.OffersService
import com.momentscience.android.msapidemoapp.ui.viewmodel.OffersViewModel

/**
 * Factory for creating OffersViewModel with its dependencies.
 * This factory follows the Factory pattern to create ViewModels with proper dependency injection.
 *
 * The factory is responsible for:
 * 1. Creating the OffersService instance
 * 2. Creating the OffersRepository with the service dependency
 * 3. Creating the OffersViewModel with the repository dependency
 *
 * This ensures proper dependency injection and separation of concerns.
 *
 * Usage in Compose:
 * ```kotlin
 * @Composable
 * fun MyScreen() {
 *     val viewModel: OffersViewModel = viewModel(factory = OffersViewModelFactory())
 *     // Use viewModel
 * }
 * ```
 *
 * Benefits:
 * - Proper lifecycle-aware ViewModel creation
 * - Automatic cleanup when Composable leaves composition
 * - No memory leaks
 * - Scoped to the Composable or Activity as needed
 */
class OffersViewModelFactory : ViewModelProvider.Factory {
    /**
     * Creates a new instance of the requested ViewModel with its dependencies.
     *
     * @param modelClass The class of the ViewModel to create
     * @param extras Additional parameters for ViewModel creation
     * @return A new instance of the requested ViewModel type
     * @throws IllegalArgumentException if the ViewModel class is not supported
     */
    override fun <T : androidx.lifecycle.ViewModel> create(
        modelClass: Class<T>,
        extras: CreationExtras
    ): T {
        // Create dependencies in proper order
        val offersService = OffersService()
        val offersRepository: OffersRepository = OffersRepositoryImpl(offersService)
        
        @Suppress("UNCHECKED_CAST")
        return OffersViewModel(offersRepository) as T
    }
} 