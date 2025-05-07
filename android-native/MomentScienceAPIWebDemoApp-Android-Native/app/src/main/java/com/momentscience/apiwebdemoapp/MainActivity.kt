package com.momentscience.apiwebdemoapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.momentscience.apiwebdemoapp.ui.CheckoutView
import com.momentscience.apiwebdemoapp.ui.OffersView
import com.momentscience.apiwebdemoapp.ui.theme.MomentScienceAPIWebDemoAppTheme
import com.momentscience.apiwebdemoapp.viewmodels.OffersViewModel
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue

/**
 * Main entry point of the app.
 * Handles the creation of the Compose UI and sets up the app theme.
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Set the content of the activity using Jetpack Compose
        setContent {
            // Apply the custom theme to the app
            MomentScienceAPIWebDemoAppTheme {
                // Surface provides a background for the UI
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colors.background
                ) {
                    // Launch the main composable screen
                    MainScreen()
                }
            }
        }
    }
}

/**
 * Main composable that sets up navigation and view models.
 * Handles navigation between the offers screen and checkout screen.
 */
@Composable
fun MainScreen() {
    // Create a navigation controller for handling navigation between screens
    val navController = rememberNavController()
    // Get the OffersViewModel instance for managing offers data
    val offersViewModel: OffersViewModel = viewModel()
    // Collect the latest JSON response from the ViewModel as state
    val jsonResponse by offersViewModel.jsonResponse.collectAsState()
    val offerCount by offersViewModel.offerCount.collectAsState()
    val sdkId by offersViewModel.sdkId.collectAsState()
    val prefetchMode by offersViewModel.prefetchMode.collectAsState()
    val payload by offersViewModel.payload.collectAsState()

    // Set up the navigation graph with two destinations: offers and checkout
    NavHost(navController = navController, startDestination = "offers") {
        // Offers screen destination
        composable("offers") {
            OffersView(
                // Callback when navigating to the checkout screen
                onNavigateToCheckout = { sdkId, _, isFromAPIPrefetch ->
                    // Only navigate if sdkId is not blank
                    if (sdkId.isNotBlank()) {
                        navController.navigate("checkout/$sdkId?isFromAPIPrefetch=$isFromAPIPrefetch") {
                            // Pop up to the offers screen and save its state
                            popUpTo("offers") { saveState = true }
                            // Avoid multiple copies of the same destination
                            launchSingleTop = true
                            // Restore state if reselecting a previously selected item
                            restoreState = true
                        }
                    }
                },
                viewModel = offersViewModel // Pass the ViewModel to the OffersView
            )
        }
        // Checkout screen destination with arguments
        composable(
            route = "checkout/{sdkId}?isFromAPIPrefetch={isFromAPIPrefetch}",
            arguments = listOf(
                navArgument("sdkId") { 
                    type = NavType.StringType
                    nullable = false
                },
                navArgument("isFromAPIPrefetch") {
                    type = NavType.BoolType
                    defaultValue = false
                }
            )
        ) { backStackEntry ->
            // Retrieve the sdkId argument from the navigation back stack
            val sdkId = backStackEntry.arguments?.getString("sdkId") ?: ""
            // Retrieve the isFromAPIPrefetch argument, defaulting to false if not present
            val isFromAPIPrefetch = backStackEntry.arguments?.getBoolean("isFromAPIPrefetch") ?: false
            // Show the CheckoutView composable, passing necessary arguments and state
            CheckoutView(
                sdkId = sdkId,
                jsonResponse = jsonResponse,
                isFromAPIPrefetch = isFromAPIPrefetch,
                offerCount = offerCount,
                payload = payload,
                onBackPressed = { navController.popBackStack() } // Handle back navigation
            )
        }
    }
} 