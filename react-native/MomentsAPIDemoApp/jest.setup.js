// Native-module mocks so the render smoke test can run under jest.
jest.mock('react-native-config', () => ({__esModule: true, default: {}}));
jest.mock('react-native-device-info', () =>
  require('react-native-device-info/jest/react-native-device-info-mock'),
);
