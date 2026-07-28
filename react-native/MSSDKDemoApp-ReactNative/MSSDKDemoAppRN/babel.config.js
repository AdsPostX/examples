module.exports = api => {
  // In the jest 'test' env, skip react-native-dotenv (it requires a .env at
  // transform time with safe:true); '@env' is virtually mocked in jest.setup.js.
  const isTest = api.env('test');
  const plugins = [];
  if (!isTest) {
    plugins.push([
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        safe: true,
        allowUndefined: false,
      },
    ]);
  }
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins,
  };
};
