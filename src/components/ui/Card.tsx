import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { colors, spacing } from '../../theme';

import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'flat' | 'outline' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={[
      styles.card, 
      styles[variant], 
      { backgroundColor: variant === 'flat' ? colors.neutral[50] : colors.surface },
      variant === 'outline' && { borderColor: colors.neutral[200], backgroundColor: 'transparent' },
      variant === 'glass' && { backgroundColor: colors.glass.light },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...Platform.select({
      web: {
        transition: 'all 0.3s ease-in-out',
      }
    })
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  flat: {},
  outline: {
    borderWidth: 1,
  },
  glass: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  }
});
