module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // WatermelonDB models use legacy decorators
  plugins: [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    ['@babel/plugin-transform-class-properties', {loose: true}],
  ],
};
