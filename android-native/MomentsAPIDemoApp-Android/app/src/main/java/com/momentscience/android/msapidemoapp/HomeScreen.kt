package com.momentscience.android.msapidemoapp

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.momentscience.android.msapidemoapp.di.ViewModelProvider

/**
 * The main entry screen of the application that handles API key input and offers loading.
 * This composable provides a simple interface for users to enter their API key and
 * initiate the offers loading process.
 *
 * Features:
 * - API key input field with automatic whitespace trimming
 * - Development mode toggle switch
 * - Load button with enabled/disabled state based on input
 * - Conditional rendering of offers screen
 * - Centralized layout with proper spacing
 *
 * State Management:
 * - Maintains API key input state
 * - Tracks development mode state
 * - Tracks offers screen visibility
 * - Manages ViewModel instance
 *
 * UI Components:
 * - OutlinedTextField for API key input
 * - Switch for development mode toggle
 * - Button for loading offers
 * - Conditional OffersScreen rendering
 *
 * Layout:
 * - Centered column layout
 * - Consistent padding and spacing
 * - Full width components
 * - Fixed height button
 *
 * Default Values:
 * - Pre-filled API key for testing
 * - Initial offers visibility set to false
 * - Development mode initially set to false
 *
 * @param modifier Optional modifier for customizing the layout. Default is [Modifier].
 *                Applied to the root Column composable.
 *
 * Usage Example:
 * ```
 * HomeScreen(
 *     modifier = Modifier
 *         .fillMaxSize()
 *         .padding(horizontal = 16.dp)
 * )
 * ```
 */
@Composable
fun HomeScreen(
    modifier: Modifier = Modifier
) {
    // State management for API key input and offers screen visibility
    val defaultAPIKey = "b167f9d7-c479-41d8-b58f-4a5b26e561f1"  // Default API key for testing
    var apiKey by remember { mutableStateOf(defaultAPIKey) }
    var showOffers by remember { mutableStateOf(false) }
    var isDevelopmentMode by remember { mutableStateOf(false) }  // Development mode state
    
    // Initialize ViewModel instance that persists across recompositions
    val offersViewModel = remember { ViewModelProvider.provideOffersViewModel() }

    // Conditional rendering of the offers screen
    // Only shown when showOffers is true
    if (showOffers) {
        OffersScreen(
            viewModel = offersViewModel,
            apiKey = apiKey,
            isDevelopment = isDevelopmentMode,
            payload = mapOf(
                "adpx_fp" to "unique_user_id",  // Example payload parameter
                "pub_user_id" to "unique_user_id",
                "placement" to "checkout",
                "ua" to offersViewModel.getUserAgent(),
            ),
            onClose = { showOffers = false }
        )
    }

    // Main content column with centered alignment and padding
    Column(
        modifier = modifier.padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // API Key input field with automatic whitespace trimming
        OutlinedTextField(
            value = apiKey,
            onValueChange = { apiKey = it.trim() },  // Remove leading/trailing whitespace
            label = { Text("Enter API Key") },
            singleLine = true,  // Prevent multi-line input
            modifier = Modifier
                .fillMaxWidth()  // Use full available width
                .padding(bottom = 16.dp)  // Add space before switch
        )

        // Development mode toggle switch
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Development Mode")
            Switch(
                checked = isDevelopmentMode,
                onCheckedChange = { isDevelopmentMode = it }
            )
        }

        // Load Offers button with dynamic enabled state
        Button(
            onClick = { 
                showOffers = true
            },
            enabled = apiKey.isNotEmpty(),  // Disable button when API key is empty
            modifier = Modifier
                .fillMaxWidth()  // Use full available width
                .height(50.dp)  // Fixed height for better touch target
        ) {
            Text("Load Offers")
        }
    }
}
