import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon ? { paddingLeft: spacing.xl * 1.5 } : null,
            error ? styles.inputError : null,
            style,
          ]}
          placeholderTextColor={colors.neutral[400]}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    ...typography.presets.caption,
    marginBottom: spacing.xs,
    color: colors.neutral[700],
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  rightIcon: {
    position: 'absolute',
    right: spacing.md,
  },
  leftIcon: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 1,
  },
  input: {
    ...typography.presets.body,
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingRight: spacing.xl * 1.5, // Make room for icon
    paddingVertical: spacing.sm,
    color: colors.neutral[900],
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.presets.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
