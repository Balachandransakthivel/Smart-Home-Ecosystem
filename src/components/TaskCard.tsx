import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card } from './ui/Card';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function TaskCard({ item, onComplete, onDelete }: any) {
  const { colors } = useTheme();
  const isCompleted = item.status === 'completed';

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]} variant="elevated">
      <View style={styles.content}>
        <View style={[styles.priorityTab, { backgroundColor: item.priority === 'high' ? colors.error : item.priority === 'medium' ? colors.warning : colors.primary }]} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.black }, isCompleted && styles.completedText]}>{item.title}</Text>
          {item.description && (
            <Text style={[styles.desc, { color: colors.neutral[500] }]} numberOfLines={2}>{item.description}</Text>
          )}
          <View style={styles.footer}>
            <View style={[styles.badge, { backgroundColor: colors.neutral[50] }]}>
              <Ionicons name="flag" size={10} color={item.priority === 'high' ? colors.error : colors.neutral[400]} />
              <Text style={[styles.badgeText, { color: colors.neutral[600] }]}>{item.priority}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: isCompleted ? colors.success + '10' : colors.warning + '10' }]}>
              <Ionicons 
                name={isCompleted ? "checkmark-circle" : "time"} 
                size={10} 
                color={isCompleted ? colors.success : colors.warning} 
              />
              <Text style={[
                styles.badgeText, 
                { color: isCompleted ? colors.success : colors.warning }
              ]}>{item.status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          {!isCompleted && (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.success + '10' }]} onPress={onComplete}>
              <Ionicons name="checkmark" size={20} color={colors.success} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.error + '10' }]} onPress={onDelete}>
            <Ionicons name="trash" size={20} color={colors.error} />
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
  priorityTab: {
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
  desc: { 
    fontSize: 13,
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