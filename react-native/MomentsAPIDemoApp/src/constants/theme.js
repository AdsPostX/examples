/**
 * theme.js
 * 
 * Centralized theme configuration for the application.
 * Defines colors, spacing, typography, and other design constants.
 * 
 * Benefits:
 * - Consistent styling across the app
 * - Easy to maintain and update
 * - Single source of truth for design values
 * - Facilitates theme switching (dark mode, etc.)
 */

import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

/**
 * Color palette
 * All colors used throughout the application
 */
export const Colors = {
  // Primary colors
  primary: '#3565A9',
  primaryLight: '#81b0ff',
  primaryDark: '#1e3a5f',
  
  // Background colors
  background: '#ffffff',
  backgroundLight: '#f8f8f8',
  backgroundDark: '#000000',
  
  // Text colors
  text: '#000000',
  textLight: '#666666',
  textSecondary: '#999999',
  textWhite: '#ffffff',
  
  // UI element colors
  border: '#cccccc',
  borderLight: '#eeeeee',
  borderDark: '#000000',
  
  // State colors
  error: '#ff0000',
  success: '#00ff00',
  warning: '#f5dd4b',
  info: '#0000ff',
  
  // Interactive elements
  disabled: '#cccccc',
  disabledText: '#999999',
  
  // Navigation
  navigationBackground: '#000000',
  navigationButton: '#808080',
  navigationText: '#ffffff',
  
  // Transparent
  transparent: 'transparent',
};

/**
 * Spacing scale
 * Consistent spacing values for margins, padding, gaps, etc.
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Typography scale
 * Font sizes for different text elements
 */
export const Typography = {
  h1: 24,
  h2: 20,
  h3: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  small: 10,
};

/**
 * Font weights
 * Standardized font weight values
 */
export const FontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

/**
 * Border radius values
 * Consistent border radius for UI elements
 */
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  circle: 9999,
};

/**
 * Shadow styles
 * Pre-configured shadow styles for elevation
 */
export const Shadows = {
  none: {
    shadowColor: Colors.transparent,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: Colors.text,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.text,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.text,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

/**
 * Screen dimensions
 * Useful for responsive design
 */
export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
};

/**
 * Animation durations
 * Standardized animation timing
 */
export const Animations = {
  fast: 150,
  normal: 300,
  slow: 500,
};

/**
 * Default theme object
 * Combines all theme values
 */
export const Theme = {
  colors: Colors,
  spacing: Spacing,
  typography: Typography,
  fontWeights: FontWeights,
  borderRadius: BorderRadius,
  shadows: Shadows,
  layout: Layout,
  animations: Animations,
};

export default Theme;

