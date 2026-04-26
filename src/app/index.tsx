import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import inventoryService from '../services/inventoryService';
import expenseService from '../services/expenseService';
import alertService from '../services/alertService';
import maintenanceService from '../services/maintenanceService';
import aiService from '../services/aiService';
import StatCard from '../components/StatCard';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    tasks: 0,
    inventory: 0,
    monthlySpending: 0,
    alerts: 0,
    maintenance: 0,
  });
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [predictedSavings, setPredictedSavings] = useState(0);

  const fetchData = async () => {
    if (!user?.householdId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const [tRes, iRes, eRes, aRes, mRes] = await Promise.all([
        taskService.getTasks(), 
        inventoryService.getInventory(), 
        expenseService.getExpenses(), 
        alertService.getAlerts(), 
        maintenanceService.getMaintenanceTasks()
      ]);

      setStats({
        tasks: tRes.data.length,
        inventory: iRes.data.length,
        monthlySpending: eRes.data.monthlyTotal || 0,
        alerts: aRes.data.length,
        maintenance: mRes.data.length,
      });

      // Fetch AI Suggestions
      try {
        const aiRes = await aiService.getSuggestions(iRes.data);
        if (aiRes.data.suggestions) {
          setAiSuggestions(aiRes.data.suggestions);
        }
        
        const aiRec = await aiService.getDeviceRecommendations({ usage_history: [2, 4, 1, 5, 3] });
        if (aiRec.data.predictedSavings) {
          setPredictedSavings(aiRec.data.predictedSavings);
        }
      } catch (aiErr) {
        console.log('AI Service offline or error');
      }
    } catch (err) {
      console.error('Data fetch error', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  if (loading && !refreshing) return <Loading />;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.neutral[500] }]}>Welcome back,</Text>
          <Text style={[styles.userName, { color: colors.black }]}>{user?.name || 'Homeowner'}</Text>
        </View>
        <TouchableOpacity style={[styles.profileBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="person-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Premium AI Insights Card */}
      <Card style={[styles.aiCard, { backgroundColor: isDark ? colors.surface : '#1A1C1E' }]} variant="elevated">
        <View style={styles.aiHeader}>
          <View style={styles.aiTitleWrapper}>
            <LinearGradient
              colors={colors.gradients.primary as any}
              style={styles.aiIconWrapper}
            >
              <Ionicons name="sparkles" size={16} color="white" />
            </LinearGradient>
            <Text style={styles.aiTitle}>Smart Insights</Text>
          </View>
          <View style={[styles.savingsBadge, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
            <Text style={[styles.savingsText, { color: colors.primary }]}>+${predictedSavings} predicted</Text>
          </View>
        </View>
        
        {aiSuggestions.length > 0 ? (
          <View style={styles.suggestionList}>
            {aiSuggestions.slice(0, 2).map((s, i) => (
              <View key={i} style={styles.suggestionItem}>
                <View style={[styles.suggestionDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.suggestionText}>{s}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noAiText}>All systems optimal. Your home is running efficiently! 🚀</Text>
        )}
      </Card>

      {/* Statistics Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.row}>
          <StatCard 
            title="Tasks Pending" 
            count={stats.tasks} 
            icon="checkbox-outline" 
            gradient={colors.gradients.secondary} 
            subtitle="Today"
          />
          <StatCard 
            title="Pantry Items" 
            count={stats.inventory} 
            icon="basket-outline" 
            gradient={colors.gradients.success} 
            subtitle="In Stock"
          />
        </View>
        <View style={styles.row}>
          <StatCard 
            title="Monthly Spending" 
            count={`₹${Math.round(stats.monthlySpending)}`} 
            icon="wallet-outline" 
            gradient={colors.gradients.warning} 
            subtitle="Budgeted"
          />
          <StatCard 
            title="System Alerts" 
            count={stats.alerts} 
            icon="notifications-outline" 
            gradient={colors.gradients.danger} 
            subtitle="Urgent"
          />
        </View>
      </View>

      {/* Quick Actions Section */}
      <Text style={[styles.sectionTitle, { color: colors.black }]}>Quick Actions</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
        {[
          { label: 'Fixes', icon: 'construct-outline', color: colors.primary, route: '/maintenance' },
          { label: 'Insights', icon: 'stats-chart-outline', color: colors.accent, route: '/insights' },
          { label: 'Spending', icon: 'wallet-outline', color: colors.warning, route: '/spending' },
          { label: 'Alerts', icon: 'notifications-outline', color: colors.error, route: '/alerts' }
        ].map((action, i) => (
          <TouchableOpacity 
            key={i} 
            style={[styles.actionBtn, { backgroundColor: colors.surface, width: '48%', marginBottom: spacing.xs }]}
            onPress={() => router.push(action.route as any)}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: action.color + '15' }]}>
              <Ionicons name={action.icon as any} size={24} color={action.color} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.neutral[700] }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  greeting: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  userName: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
  },
  profileBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aiCard: {
    padding: spacing.lg,
    borderRadius: 24,
    marginBottom: spacing.lg,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  aiTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
  },
  savingsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  savingsText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
  },
  suggestionList: {
    gap: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  suggestionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  suggestionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    flex: 1,
  },
  noAiText: {
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
    fontSize: 14,
  },
  statsGrid: {
    marginBottom: spacing.lg,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.md,
  },
  actionBtn: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  actionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  maintenanceRow: {
    marginBottom: spacing.md,
  },
  maintenanceCard: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: 20,
  },
  mIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  mTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
  mStatus: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
});