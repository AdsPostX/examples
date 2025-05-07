# MomentScienceAPIWebDemoApp-Android-Native

A demonstration Android native app that shows how to integrate with the MomentScience Web SDK for displaying offers to users.

## Overview

This Android app demonstrates two approaches for integrating the MomentScience Web SDK:

1. **API Prefetch Mode**: Native API is called first, and its response is sent to the Web SDK on the checkout screen.
2. **Web SDK Prefetch Mode**: Web SDK is loaded in a hidden WebView on the offers screen, and the response is saved locally by Web SDK. When the Web SDK is used again on the checkout screen, the saved response is used.
