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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import inventoryService from '../services/inventoryService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loading } from '../components/ui/Loading';
import EmptyState from '../components/ui/EmptyState';
import InventoryItem from '../components/InventoryItem';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function InventoryScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [threshold, setThreshold] = useState('1');
  const [category, setCategory] = useState('General');
  const [cost, setCost] = useState(''); // Cost for auto-sync with spending
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const response = await inventoryService.getInventory();
      setInventory(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch inventory');
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

  const handleAddItem = async () => {
    if (!itemName || !quantity) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await inventoryService.addInventory({
        itemName,
        quantity: parseInt(quantity),
        threshold: parseInt(threshold),
        category,
        cost: cost ? parseFloat(cost) : 0
      });
      setModalVisible(false);
      resetForm();
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await inventoryService.deleteInventory(id);
          fetchData();
        } catch (error) {
          Alert.alert('Error', 'Failed to delete item');
        }
      }}
    ]);
  };

  const resetForm = () => {
    setItemName('');
    setQuantity('');
    setThreshold('1');
    setCategory('General');
    setCost('');
  };

  if (loading && !refreshing) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList 
        data={inventory} 
        renderItem={({ item }) => (
          <InventoryItem item={item} onDelete={() => handleDelete(item._id)} />
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.black }]}>Pantry & Stock</Text>
            <Text style={[styles.headerSubtitle, { color: colors.neutral[500] }]}>
              {inventory.length} items tracked in your home
            </Text>
          </View>
        }
        ListEmptyComponent={
          !user?.householdId ? (
            <EmptyState 
              icon="home-outline" 
              title="No Household" 
              message="Join or create a household in Settings to start managing inventory." 
              onPress={() => router.push('/settings')}
              actionTitle="Go to Settings"
            />
          ) : (
            <EmptyState 
              icon="basket-outline" 
              title="Empty pantry" 
              message="No items found. Tap the + button to add your first inventory item! 🍎" 
            />
          )
        } 
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
            setModalVisible(true);
          }
        }}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.black }]}>Add Inventory Item</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.neutral[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContent}>
              <Input
                label="Item Name"
                placeholder="e.g. Rice, Detergent, Milk"
                value={itemName}
                onChangeText={setItemName}
              />

              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: spacing.md }}>
                  <Input
                    label="Quantity"
                    placeholder="0"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Alert Threshold"
                    placeholder="1"
                    keyboardType="numeric"
                    value={threshold}
                    onChangeText={setThreshold}
                  />
                </View>
              </View>

              <Input
                label="Total Purchase Cost ($)"
                placeholder="Optional (Syncs to Spending)"
                keyboardType="numeric"
                value={cost}
                onChangeText={setCost}
              />
              <Text style={styles.helperText}>Adding cost will automatically create a spending entry.</Text>

              <Button 
                title="Add to Inventory" 
                onPress={handleAddItem} 
                loading={isSubmitting}
                style={styles.submitButton}
              />
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
  formRow: {
    flexDirection: 'row',
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