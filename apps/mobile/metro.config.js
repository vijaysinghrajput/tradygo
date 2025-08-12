const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    // Include the root directory to watch for changes in shared packages
    path.resolve(__dirname, '../../'),
  ],
  resolver: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    // Add support for additional file extensions
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
    // Ensure we can resolve packages from the monorepo
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
    ],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);