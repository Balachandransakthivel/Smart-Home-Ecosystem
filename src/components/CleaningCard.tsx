import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card } from './ui/Card';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function CleaningCard({ item, onComplete, onDelete }: any) {
  const { colors } = useTheme();
  const isCompleted = item.status === 'completed';

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.content}>
        <View style={[styles.typeIndicator, { backgroundColor: colors.secondary }]} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.black }, isCompleted && styles.completedText]}>
            {item.type || item.taskName || 'Cleaning Task'}
          </Text>
          <View style={styles.details}>
            <Ionicons name="calendar-outline" size={14} color={colors.neutral[400]} />
            <Text style={[styles.dateText, { color: colors.neutral[500] }]}>
              {new Date(item.scheduledDate || item.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.footer}>
             <View style={[styles.badge, { backgroundColor: isCompleted ? colors.success + '15' : colors.secondary + '15' }]}>
              <Ionicons 
                name={isCompleted ? "checkmark-circle" : "sparkles-outline"} 
                size={12} 
                color={isCompleted ? colors.success : colors.secondary} 
              />
              <Text style={[
                styles.badgeText, 
                { color: isCompleted ? colors.success : colors.secondary }
              ]}>{item.status || 'Pending'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          {!isCompleted && (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.neutral[50] }]} onPress={onComplete}>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.neutral[50] }]} onPress={onDelete}>
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { 
    padding: 0, 
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  typeIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: spacing.md,
  },
  info: { 
    flex: 1,
    gap: 4,
  },
  title: { 
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase',
  },
  actions: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: spacing.md,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  }
});