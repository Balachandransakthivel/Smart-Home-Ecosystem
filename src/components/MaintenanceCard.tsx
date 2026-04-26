import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card } from './ui/Card';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function MaintenanceCard({ item, onComplete, onDelete }: any) {
  const { colors } = useTheme();
  const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'completed';
  const isCompleted = item.status === 'completed';

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: isOverdue ? colors.error + '15' : colors.primary + '15' }]}>
            <Ionicons 
              name={isCompleted ? "checkmark-done" : "construct-outline"} 
              size={24} 
              color={isOverdue ? colors.error : (isCompleted ? colors.success : colors.primary)} 
            />
          </View>
        </View>
        
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.black }, isCompleted && styles.completedText]}>{item.deviceName}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={12} color={isOverdue ? colors.error : colors.neutral[400]} />
            <Text style={[styles.metaText, { color: colors.neutral[500] }, isOverdue && styles.overdueText]}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: isCompleted ? colors.success + '10' : colors.neutral[50] }]}>
            <Text style={[styles.statusText, { color: isCompleted ? colors.success : colors.neutral[500] }]}>
              {item.status.toUpperCase()}
            </Text>
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
  card: { padding: 0, marginBottom: spacing.md },
  content: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
  },
  overdueText: {
    fontWeight: '700',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
  },
  actions: { 
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  }
});