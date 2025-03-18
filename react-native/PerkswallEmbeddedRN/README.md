To open an offer links in a new screen, as an inapp webview screen, it requires a different treatment. it requires special handling of webview interactions. in this document we have tried to explained it.

# Handling Interactions in WebView

## Overview

This document provides a guide on how to handle interactions within a `WebView` in a React Native application. The `WebView` component allows you to embed web content within your app and interact with it using JavaScript. This guide will cover how to inject JavaScript into the `WebView`, handle navigation events, and communicate between the web content and the React Native app.

## Key Components

### 1. Injecting JavaScript

To interact with the web content, you can inject JavaScript into the `WebView`. This is useful for setting up event listeners.

```javascript
const injectedJavaScript = `
  window.addEventListener('message', function(event) {
    // Forward any messages from the iframe to React Native
    window.ReactNativeWebView.postMessage(event.data);
  });
  true; // Note: this is needed to ensure the script is injected properly
`;
```

### 2. Handling Navigation Events

The `WebView` provides a method `onShouldStartLoadWithRequest` to intercept navigation events. This can be used to prevent certain URLs from loading or to handle specific actions when a URL is clicked.

```javascript
const handleNavigation = event => {
  console.log('Navigation type:', event.navigationType);
  console.log('URL:', event.url);

  if (event.url.includes('offer-click')) {
    return false; // Prevent navigation, as we are handling them through 'onMessage'
  }
  return true; // Allow navigation
};
```

### 3. Communicating with React Native

You can send messages from the web content to the React Native app using `window.ReactNativeWebView.postMessage`. This allows you to handle events or data from the web content within your app.

If the post message has the name 'url_clicked' and includes a 'target_url', then 'target_url' represents the URL link that the user has clicked or tapped.

```javascript
<WebView
  ...
  onMessage={event => {
    const message = event.nativeEvent.data;
    try {
      let parsedData = JSON.parse(message);

      if (
        parsedData &&
        typeof parsedData === 'object' &&
        parsedData.name === 'url_clicked' &&
        parsedData.target_url &&
        parsedData.target_url.trim().length > 0
      ) {
        console.log(
          'URL clicked, navigating to:',
          parsedData.target_url,
        );
        navigation.navigate('InAppWebView', {
          url: parsedData.target_url,
        });
      }
    } catch (e) {
      console.log('Error processing message:', e);
      console.log('Original message:', message);
    }
  }}
/>
```

## Example Usage

In the [`ProductDetailScreen`](src/screens/product_detail_screen.js) component, the `WebView` is used to display a HTML page. JavaScript is injected to listen for messages from the web content, which are then handled in the `onMessage` callback. Navigation events are intercepted to prevent certain URLs from loading.
