import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card } from './ui/Card';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function AlertCard({ alert, onRead }: any) {
  const { colors } = useTheme();
  const isRead = alert.isRead || alert.read; // Support both naming variants if they exist

  return (
    <TouchableOpacity 
      onPress={() => onRead(alert._id)} 
      disabled={isRead}
      activeOpacity={0.7}
    >
      <Card style={[
        styles.card, 
        { backgroundColor: colors.surface },
        !isRead && { borderLeftColor: colors.primary, borderLeftWidth: 4 }
      ]}>
        <View style={styles.content}>
          <View style={[styles.iconWrapper, { backgroundColor: isRead ? colors.neutral[100] : colors.primary + '15' }]}>
            <Ionicons 
              name={alert.type === 'low_stock' ? 'cube-outline' : 'notifications-outline'} 
              size={20} 
              color={isRead ? colors.neutral[400] : colors.primary} 
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={[
              styles.message, 
              { color: isRead ? colors.neutral[500] : colors.black },
              !isRead && { fontFamily: typography.fontFamily.bold }
            ]}>
              {alert.message}
            </Text>
            <Text style={[styles.time, { color: colors.neutral[400] }]}>
              {new Date(alert.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          {!isRead && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  content: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textWrapper: {
    flex: 1,
  },
  message: { 
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: typography.fontFamily.medium,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
  }
});