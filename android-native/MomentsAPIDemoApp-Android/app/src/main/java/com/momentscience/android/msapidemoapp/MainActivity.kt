package com.momentscience.android.msapidemoapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.momentscience.android.msapidemoapp.ui.theme.MSAPIDemoAppTheme
import androidx.compose.ui.zIndex

/**
 * The main entry point of the Moments API Demo Application.
 * This activity serves as the root container for the application's UI components
 * and handles the initial setup of the app's architecture.
 *
 * Features:
 * - Edge-to-edge content display
 * - Material3 theming integration
 * - Snackbar support for user notifications
 * - Proper layout hierarchy with z-indexing
 * - Full screen content rendering
 *
 * Architecture Components:
 * - Uses Jetpack Compose for UI
 * - Implements Material3 design system
 * - Manages system UI integration
 * - Handles screen layout hierarchy
 *
 * Layout Structure:
 * - Root: Material Theme wrapper
 * - Layer 1: Box container for z-index management
 * - Layer 2: Scaffold with snackbar support
 * - Layer 3: HomeScreen content
 *
 * Key Responsibilities:
 * - Activity lifecycle management
 * - UI composition setup
 * - Theme application
 * - System edge-to-edge handling
 * - Snackbar state management
 *
 * Usage:
 * This activity is declared as the main/launcher activity in the Android Manifest
 * and is automatically instantiated by the Android system when the app is launched.
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Enable edge-to-edge display, allowing content to draw behind system bars
        enableEdgeToEdge()
        
        // Set up the Compose UI content
        setContent {
            // Apply the application's Material3 theme
            MSAPIDemoAppTheme {
                // Create and remember a SnackbarHostState for showing snackbar messages
                val snackbarHostState = remember { SnackbarHostState() }
                
                // Root container for managing z-index layering
                Box(modifier = Modifier.fillMaxSize()) {
                    // Scaffold layer providing Material Design structure
                    Scaffold(
                        modifier = Modifier
                            .fillMaxSize()
                            .zIndex(0f),  // Ensure Scaffold is at the base layer
                        snackbarHost = { 
                            // Snackbar host for displaying temporary messages
                            SnackbarHost(snackbarHostState) 
                        }
                    ) { innerPadding ->
                        // Main content layer - HomeScreen
                        HomeScreen(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(innerPadding)  // Apply scaffold's inner padding
                        )
                    }
                }
            }
        }
    }
}
