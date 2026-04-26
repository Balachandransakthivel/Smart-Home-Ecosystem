import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  RefreshControl,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import alertService from '../services/alertService';
import AlertCard from '../components/AlertCard';
import EmptyState from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function AlertsScreen() {
  const { colors } = useTheme();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await alertService.getAlerts();
      setAlerts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await alertService.markAllRead();
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  const handleRead = async (id: string) => {
    try {
      await alertService.markRead(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading && !refreshing) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={alerts}
        renderItem={({ item }) => (
          <AlertCard alert={item} onRead={() => handleRead(item._id)} />
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          alerts.length > 0 ? (
            <View style={styles.headerTitleContainer}>
              <View style={styles.headerRow}>
                <View>
                  <Text style={[styles.headerTitle, { color: colors.black }]}>Notifications</Text>
                  <Text style={[styles.headerSubtitle, { color: colors.neutral[500] }]}>
                    {alerts.filter(a => !a.isRead).length} unread alerts
                  </Text>
                </View>
                <TouchableOpacity onPress={handleMarkAllRead}>
                  <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all read</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState 
            icon="notifications-off-outline" 
            title="All caught up!" 
            message="No new alerts at the moment. Your home is safe and secure. 🛡️" 
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  headerTitleContainer: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  markAllText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
  },
});