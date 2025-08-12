import { Platform } from 'react-native';

const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
  }),
};

export const typography = {
  fontFamily,
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40,
    '4xl': 44,
    '5xl': 56,
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Text styles
  heading: {
    h1: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700' as const,
      fontFamily: fontFamily.bold,
    },
    h2: {
      fontSize: 30,
      lineHeight: 40,
      fontWeight: '700' as const,
      fontFamily: fontFamily.bold,
    },
    h3: {
      fontSize: 24,
      lineHeight: 36,
      fontWeight: '600' as const,
      fontFamily: fontFamily.medium,
    },
    h4: {
      fontSize: 20,
      lineHeight: 32,
      fontWeight: '600' as const,
      fontFamily: fontFamily.medium,
    },
    h5: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '500' as const,
      fontFamily: fontFamily.medium,
    },
    h6: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500' as const,
      fontFamily: fontFamily.medium,
    },
  },
  
  body: {
    large: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '400' as const,
      fontFamily: fontFamily.regular,
    },
    medium: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      fontFamily: fontFamily.regular,
    },
    small: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
      fontFamily: fontFamily.regular,
    },
  },
  
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    fontFamily: fontFamily.regular,
  },
  
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
    fontFamily: fontFamily.medium,
  },
};

export type Typography = typeof typography;