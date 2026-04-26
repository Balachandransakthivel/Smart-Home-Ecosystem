import { TextStyle } from 'react-native';

export const typography = {
  fontFamily: {
    regular: 'System', 
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  presets: {
    h1: {
      fontSize: 30,
      fontWeight: 'bold',
      lineHeight: 36,
    } as TextStyle,
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    } as TextStyle,
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    } as TextStyle,
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24,
    } as TextStyle,
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20,
      color: '#6b7280', // Default to neutral 500
    } as TextStyle,
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    } as TextStyle,
  },
};
