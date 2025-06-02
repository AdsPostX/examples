package com.momentscience.android.msapidemoapp.di

import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.ViewModelStore
import androidx.lifecycle.ViewModelStoreOwner
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

/**
 * Singleton object to provide ViewModels throughout the app.
 * This provider ensures that ViewModels are:
 * 1. Created with proper dependencies
 * 2. Scoped correctly (shared across the app)
 * 3. Lifecycle-aware
 * 4. Memory-leak free
 *
 * Usage:
 * ```kotlin
 * val viewModel = ViewModelProvider.provideOffersViewModel()
 * ```
 *
 * Benefits:
 * - Centralized ViewModel creation
 * - Consistent dependency injection
 * - Proper ViewModel scoping
 * - Memory management through ViewModelStore
 */
object ViewModelProvider {
    // Factory instance to create ViewModels with dependencies
    private val factory = OffersViewModelFactory()
    
    // Store to maintain ViewModels and handle their lifecycle
    private val store = ViewModelStore()
    
    // Owner to provide lifecycle scope for ViewModels
    private val owner = object : ViewModelStoreOwner {
        override val viewModelStore: ViewModelStore = store
    }
    
    /**
     * Provides a shared instance of OffersViewModel.
     * The ViewModel will be:
     * 1. Created if it doesn't exist
     * 2. Reused if it already exists
     * 3. Properly scoped to the ViewModelStore
     *
     * @return An instance of OffersViewModel with all required dependencies
     */
    fun provideOffersViewModel(): OffersViewModel {
        return ViewModelProvider(owner, factory)[OffersViewModel::class.java]
    }
} 