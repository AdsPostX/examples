// Native-module mocks so the render smoke test can run under jest.
jest.mock(
  '@env',
  () => ({
    API_BASE_URL: 'https://example.com',
    SDK_CDN_URL: 'https://cdn.example.com',
    SDK_DEFAULT_ID: 'test-sdk-id',
  }),
  {virtual: true},
);
jest.mock('react-native-webview', () => {
  const React = require('react');
  const {View} = require('react-native');
  const WebView = props => React.createElement(View, props);
  return {__esModule: true, WebView, default: WebView};
});
