import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import maintenanceService from '../services/maintenanceService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loading } from '../components/ui/Loading';
import EmptyState from '../components/ui/EmptyState';
import MaintenanceCard from '../components/MaintenanceCard';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function MaintenanceScreen() {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Form State
  const [deviceName, setDeviceName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const response = await maintenanceService.getMaintenanceTasks();
      setTasks(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch maintenance tasks');
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

  const handleAddTask = async () => {
    if (!deviceName || !dueDate) {
      Alert.alert('Error', 'Please fill in device name and date');
      return;
    }

    try {
      setIsSubmitting(true);
      await maintenanceService.createMaintenanceTask({
        deviceName,
        taskDescription,
        dueDate,
        status: 'pending'
      });
      setModalVisible(false);
      resetForm();
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!selectedTask) return;

    try {
      setIsSubmitting(true);
      await maintenanceService.updateMaintenanceTask(selectedTask._id, {
        status: 'completed',
        cost: cost ? parseFloat(cost) : 0
      });
      setCompleteModalVisible(false);
      setSelectedTask(null);
      setCost('');
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await maintenanceService.deleteMaintenanceTask(id);
          fetchData();
        } catch (error) {
          Alert.alert('Error', 'Failed to delete task');
        }
      }}
    ]);
  };

  const resetForm = () => {
    setDeviceName('');
    setTaskDescription('');
    setDueDate(new Date().toISOString().split('T')[0]);
  };

  if (loading && !refreshing) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList 
        data={tasks} 
        renderItem={({ item }) => (
          <MaintenanceCard 
            item={item} 
            onDelete={() => handleDelete(item._id)} 
            onComplete={() => {
              setSelectedTask(item);
              setCompleteModalVisible(true);
            }}
          />
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.black }]}>Home Maintenance</Text>
            <Text style={[styles.headerSubtitle, { color: colors.neutral[500] }]}>
              {tasks.filter(t => t.status === 'pending').length} tasks pending attention
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState 
            icon="construct-outline" 
            title="All clear" 
            message="No maintenance tasks found. Tap the + button to Schedule a checkup! ✨" 
          />
        } 
      />

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.black }]}>Schedule Maintenance</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.neutral[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContent}>
              <Input
                label="Device/Area Name"
                placeholder="e.g. AC Filter, Water Purifier"
                value={deviceName}
                onChangeText={setDeviceName}
              />

              <Input
                label="Task Description"
                placeholder="e.g. Cleaning filter, checking leaks"
                value={taskDescription}
                onChangeText={setTaskDescription}
                multiline
              />

              <Input
                label="Due Date"
                placeholder="YYYY-MM-DD"
                value={dueDate}
                onChangeText={setDueDate}
              />

              <Button 
                title="Schedule Task" 
                onPress={handleAddTask} 
                loading={isSubmitting}
                style={styles.submitButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Complete Task Modal */}
      <Modal visible={completeModalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.black }]}>Complete Task</Text>
              <TouchableOpacity onPress={() => setCompleteModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.neutral[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.formContent}>
              <Text style={[styles.confirmText, { color: colors.neutral[700] }]}>
                Marking "{selectedTask?.deviceName}" as completed.
              </Text>
              
              <Input
                label="Maintenance Cost (₹)"
                placeholder="0.00"
                keyboardType="numeric"
                value={cost}
                onChangeText={setCost}
              />
              <Text style={styles.helperText}>Adding cost will automatically create a spending entry.</Text>

              <Button 
                title="Complete Task" 
                onPress={handleCompleteTask} 
                loading={isSubmitting}
                style={styles.submitButton}
              />
            </View>
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
  confirmText: {
    fontSize: 16,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.medium,
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: -8,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});