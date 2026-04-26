import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import cleaningService from '../services/cleaningService';
import TaskCard from '../components/TaskCard';
import CleaningCard from '../components/CleaningCard';
import { Loading } from '../components/ui/Loading';
import EmptyState from '../components/ui/EmptyState';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function TasksScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [cleaningModalVisible, setCleaningModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');

  // Cleaning Form State
  const [cleaningType, setCleaningType] = useState('');
  const [cleaningDate, setCleaningDate] = useState(new Date().toISOString());

  const fetchData = async () => {
    if (!user?.householdId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const [tRes, cRes] = await Promise.all([
        taskService.getTasks(), 
        cleaningService.getCleanings()
      ]);
      
      const tasks = tRes.data.map((t: any) => ({ ...t, kind: 'task' }));
      const cleans = cRes.data.map((c: any) => ({ ...c, kind: 'cleaning' }));
      
      const combined = [...tasks, ...cleans].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setItems(combined);
    } catch (err) { 
      console.error(err); 
      Alert.alert('Error', 'Failed to fetch tasks');
    } finally { 
      setLoading(false); 
      setRefreshing(false);
    }
  };

  const handleAddTask = async () => {
    if (!taskTitle) return Alert.alert('Error', 'Please enter a title');
    try {
      setIsSubmitting(true);
      await taskService.createTask({
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority
      });
      setTaskModalVisible(false);
      setTaskTitle('');
      setTaskDesc('');
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCleaning = async () => {
    if (!cleaningType) return Alert.alert('Error', 'Please enter a cleaning type');
    try {
      setIsSubmitting(true);
      await cleaningService.createCleaning({
        type: cleaningType,
        scheduledDate: cleaningDate
      });
      setCleaningModalVisible(false);
      setCleaningType('');
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to create cleaning task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => { fetchData(); }, []);

  const delTask = async (id: string, kind: string) => {
    try {
      if (kind === 'task') await taskService.deleteTask(id);
      else await cleaningService.deleteCleaning(id);
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete data');
    }
  };

  const compTask = async (id: string, kind: string) => {
    try {
      if (kind === 'task') await taskService.updateTask(id, { status: 'completed' });
      else await cleaningService.updateCleaning(id, { status: 'completed' });
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to update data');
    }
  };

  if (loading && !refreshing) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.black }]}>Daily Operations</Text>
            <Text style={[styles.headerSubtitle, { color: colors.neutral[500] }]}>
              {items.filter((i: any) => i.status !== 'completed').length} tasks remaining for today
            </Text>
          </View>
        }
        ListEmptyComponent={
          !user?.householdId ? (
            <EmptyState 
              icon="home-outline" 
              title="No Household" 
              message="Join or create a household in Settings to start managing tasks." 
              onPress={() => router.push('/settings')}
              actionTitle="Go to Settings"
            />
          ) : (
            <EmptyState 
              icon="rocket-outline" 
              title="No tasks yet 🚀" 
              message="Your home is all caught up! Add a new task or cleaning schedule to get started." 
            />
          )
        }
        renderItem={({ item }) => item.kind === 'task' ? 
          <TaskCard item={item} onComplete={() => compTask(item._id, 'task')} onDelete={() => delTask(item._id, 'task')} /> :
          <CleaningCard item={item} onComplete={() => compTask(item._id, 'cleaning')} onDelete={() => delTask(item._id, 'cleaning')} />}
      />
      
      <TouchableOpacity 
        style={[
          styles.fab, 
          { backgroundColor: colors.primary },
          !user?.householdId && { backgroundColor: colors.neutral[300], opacity: 0.5 }
        ]}
        onPress={() => {
          if (!user?.householdId) {
            Alert.alert('Household Required', 'Please join or create a household in Settings first.');
          } else {
            Alert.alert('Add New', 'What would you like to add?', [
                { text: 'General Task', onPress: () => setTaskModalVisible(true) },
                { text: 'Cleaning Task', onPress: () => setCleaningModalVisible(true) },
                { text: 'Cancel', style: 'cancel' }
            ]);
          }
        }}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>

      {/* General Task Modal */}
      <Modal visible={taskModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.black }]}>New General Task</Text>
              <TouchableOpacity onPress={() => setTaskModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.neutral[500]} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.formContent}>
              <Input label="Task Title" value={taskTitle} onChangeText={setTaskTitle} placeholder="e.g. Fix leaky faucet" />
              <Input label="Description" value={taskDesc} onChangeText={setTaskDesc} placeholder="Optional details..." multiline />
              
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityContainer}>
                {['low', 'medium', 'high'].map(p => (
                  <TouchableOpacity 
                    key={p} 
                    style={[styles.priorityBtn, taskPriority === p && { backgroundColor: colors.primary }]} 
                    onPress={() => setTaskPriority(p)}
                  >
                    <Text style={[styles.priorityText, taskPriority === p && { color: 'white' }]}>{p.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button title="Create Task" onPress={handleAddTask} loading={isSubmitting} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Cleaning Task Modal */}
      <Modal visible={cleaningModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.black }]}>New Cleaning Task</Text>
              <TouchableOpacity onPress={() => setCleaningModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.neutral[500]} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.formContent}>
              <Input label="Cleaning Type" value={cleaningType} onChangeText={setCleaningType} placeholder="e.g. Living Room, Bathroom" />
              <Button title="Schedule Cleaning" onPress={handleAddCleaning} loading={isSubmitting} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  headerTitleContainer: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: spacing.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
  },
  formContent: {
    paddingBottom: spacing['2xl'],
  },
  label: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
  },
});