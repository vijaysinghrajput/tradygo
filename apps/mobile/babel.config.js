module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/navigation': './src/navigation',
          '@/store': './src/store',
          '@/services': './src/services',
          '@/utils': './src/utils',
          '@/theme': './src/theme',
          '@/api': './src/api',
          '@/auth': './src/auth',
        },
      },
    ],
    'react-native-reanimated/plugin', // This should be last
  ],
};