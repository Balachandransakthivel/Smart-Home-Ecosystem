import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const { width } = Dimensions.get('window');

interface StatCardProps {
  title: string;
  count: string | number;
  icon: keyof typeof Ionicons.prototype.props.name;
  gradient?: string[];
  subtitle?: string;
  onPress?: () => void;
}

export default function StatCard({ title, count, icon, gradient, subtitle }: StatCardProps) {
  const { colors, isDark } = useTheme();
  
  // Default gradient if none provided
  const activeGradient = gradient || colors.gradients.primary;

  return (
    <LinearGradient
      colors={activeGradient as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { shadowColor: activeGradient[0] }]}
    >
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name={icon as any} size={20} color="white" />
          </View>
          <Ionicons name="ellipsis-horizontal" size={16} color="rgba(255,255,255,0.6)" />
        </View>
        
        <View style={styles.info}>
          <Text style={styles.count}>{count}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <View style={styles.subtitleWrapper}>
               <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Decorative Circles */}
      <View style={[styles.circle, { top: -20, right: -20, opacity: 0.1 }]} />
      <View style={[styles.circle, { bottom: -30, left: -10, width: 80, height: 80, opacity: 0.05 }]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { 
    padding: spacing.md, 
    borderRadius: 28, 
    flex: 1, 
    height: 140,
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 12,
  },
  info: {
    marginTop: 'auto',
  },
  title: { 
    fontSize: 12, 
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  count: { 
    fontSize: 24, 
    fontFamily: typography.fontFamily.bold,
    color: 'white',
  },
  subtitleWrapper: {
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subtitle: {
    fontSize: 9,
    fontFamily: typography.fontFamily.bold,
    color: 'white',
    textTransform: 'uppercase',
  },
  circle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
  }
});