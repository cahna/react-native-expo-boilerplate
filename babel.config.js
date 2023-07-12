module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-typescript'],
    plugins: [
      // Required for expo-router
      'expo-router/babel',
      '@babel/transform-react-jsx-source',
      'babel-plugin-transform-typescript-metadata',
      '@babel/plugin-proposal-export-namespace-from',
    ],
  };
};
