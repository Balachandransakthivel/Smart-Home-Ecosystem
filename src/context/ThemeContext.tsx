import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as lightColors } from '../theme/colors';

// Define dark colors based on light colors with appropriate adjustments
export const darkColors = {
  ...lightColors,
  white: '#FFFFFF', // Keep true white for icons and buttons
  black: '#FFFFFF', 
  background: '#000000', // Pure black for OLED
  surface: '#1C1C1E', // standard dark mode surface
  neutral: {
    50: '#1C1C1E',
    100: '#2C2C2E',
    200: '#3A3A3C',
    300: '#48484A',
    400: '#636366',
    500: '#8E8E93',
    600: '#AEAEB2',
    700: '#C7C7CC',
    800: '#D1D1D6',
    900: '#E5E5EA',
  },
  glass: {
    light: 'rgba(28, 28, 30, 0.9)',
    medium: 'rgba(28, 28, 30, 0.75)',
    dark: 'rgba(28, 28, 30, 0.5)',
  }
};

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: typeof lightColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('themeMode');
      if (savedMode) {
        setModeState(savedMode as ThemeMode);
      }
    } catch (e) {
      console.error('Failed to load theme', e);
    }
  };

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      if (newMode === 'system') {
        await AsyncStorage.removeItem('themeMode');
      } else {
        await AsyncStorage.setItem('themeMode', newMode);
      }
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const isDark = mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, setMode, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
