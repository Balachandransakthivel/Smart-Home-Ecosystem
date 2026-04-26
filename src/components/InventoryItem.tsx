import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card } from './ui/Card';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function InventoryItem({ item, onDelete }: any) {
  const { colors } = useTheme();
  const isLow = item.quantity <= item.threshold;
  const isCritical = item.quantity === 0;
  const stockPercentage = Math.min((item.quantity / (item.threshold * 2)) * 100, 100);

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]} variant="elevated">
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.black }]}>{item.itemName}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: colors.neutral[50] }]}>
              <Text style={[styles.categoryText, { color: colors.neutral[500] }]}>{item.category || 'General'}</Text>
            </View>
          </View>
          
          <View style={styles.stockInfo}>
            <View style={styles.stockLabels}>
              <Text style={[styles.quantity, { color: isCritical ? colors.error : isLow ? colors.warning : colors.neutral[600] }]}>
                {item.quantity} units left
              </Text>
              <Text style={[styles.threshold, { color: colors.neutral[400] }]}>
                Threshold: {item.threshold}
              </Text>
            </View>
            <View style={[styles.progressContainer, { backgroundColor: colors.neutral[50] }]}>
              <View style={[
                styles.progressBar, 
                { 
                  width: `${stockPercentage}%`, 
                  backgroundColor: isCritical ? colors.error : isLow ? colors.warning : colors.success 
                }
              ]} />
            </View>
          </View>
        </View>
        <View style={styles.rightSide}>
          <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: colors.error + '10' }]} onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
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
  mainInfo: {
    flex: 1,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase',
  },
  stockInfo: {
    gap: 6,
  },
  stockLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantity: {
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
  },
  threshold: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
  },
  progressContainer: {
    height: 6,
    borderRadius: 3,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  rightSide: {
    paddingLeft: spacing.md,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});