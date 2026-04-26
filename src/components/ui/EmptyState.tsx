import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

import { Button } from './Button';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.prototype.props.name;
  title: string;
  message: string;
  onPress?: () => void;
  actionTitle?: string;
}

export default function EmptyState({ icon, title, message, onPress, actionTitle }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
        <Ionicons name={icon as any} size={48} color={colors.primary + '40'} />
      </View>
      <Text style={[styles.title, { color: colors.black }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.neutral[500] }]}>{message}</Text>
      {onPress && actionTitle && (
        <Button 
          title={actionTitle} 
          onPress={onPress} 
          style={styles.actionButton} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
    marginTop: spacing['2xl'],
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  actionButton: {
    marginTop: spacing.xl,
    minWidth: 200,
  },
});
