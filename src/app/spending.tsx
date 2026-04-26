import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import expenseService, { ExpenseData } from '../services/expenseService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import EmptyState from '../components/ui/EmptyState';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const CATEGORIES = ['Inventory', 'Maintenance', 'Other'];

export default function SpendingScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [selectedCategory]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const filters = selectedCategory ? { category: selectedCategory } : {};
      const response = await expenseService.getExpenses(filters);
      setExpenses(response.data.expenses);
      setMonthlyTotal(response.data.monthlyTotal);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch expenses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddExpense = async () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await expenseService.addExpense({
        title,
        amount: parseFloat(amount),
        category: category as any,
        date: new Date().toISOString()
      });
      setModalVisible(false);
      resetForm();
      fetchExpenses();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await expenseService.deleteExpense(id);
              fetchExpenses();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('Other');
  };

  const renderExpenseItem = ({ item }: { item: ExpenseData }) => (
    <Card style={styles.expenseCard}>
      <View style={styles.expenseInfo}>
        <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(item.category) }]}>
          <Ionicons 
            name={getCategoryIcon(item.category)} 
            size={20} 
            color={colors.white} 
          />
        </View>
        <View style={styles.expenseDetails}>
          <Text style={[styles.expenseTitle, { color: colors.black }]}>{item.title}</Text>
          <Text style={[styles.expenseDate, { color: colors.neutral[500] }]}>
            {new Date(item.date).toLocaleDateString()} • {item.userId?.name || 'User'}
          </Text>
        </View>
        <View style={styles.expenseAmountContainer}>
          <Text style={[styles.expenseAmount, { color: colors.error }]}>
            -₹{item.amount.toLocaleString()}
          </Text>
          <TouchableOpacity onPress={() => handleDeleteExpense(item._id)}>
            <Ionicons name="trash-outline" size={18} color={colors.neutral[400]} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Inventory': return 'cube-outline';
      case 'Maintenance': return 'build-outline';
      default: return 'card-outline';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Inventory': return colors.primary;
      case 'Maintenance': return colors.warning;
      default: return colors.secondary;
    }
  };

  if (loading && !refreshing) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Summary */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerLabel}>Monthly Spending</Text>
        <Text style={styles.headerAmount}>₹{monthlyTotal.toLocaleString()}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setFilterVisible(true)}
          >
            <Ionicons name="filter" size={20} color={colors.white} />
            <Text style={styles.headerButtonText}>
              {selectedCategory || 'All'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            fetchExpenses();
          }} />
        }
        ListEmptyComponent={
          !user?.householdId ? (
            <EmptyState 
              icon="home-outline" 
              title="No Household" 
              message="Join or create a household in Settings to track your spending and budget." 
              onPress={() => router.push('/settings')}
              actionTitle="Go to Settings"
            />
          ) : (
            <EmptyState 
              title="No expenses yet" 
              message="Your spending will appear here once you add an expense or restock inventory."
              icon="wallet-outline"
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

      {/* Add Expense Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.black }]}>Add Expense</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.neutral[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContent}>
              <Input
                label="Expense Title"
                placeholder="e.g. Grocery, Plumber Fee"
                value={title}
                onChangeText={setTitle}
              />

              <Input
                label="Amount (₹)"
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={[styles.label, { color: colors.neutral[700] }]}>Category</Text>
              <View style={styles.categoryContainer}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      { borderColor: colors.neutral[200] },
                      category === cat && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[
                      styles.categoryText,
                      { color: colors.neutral[700] },
                      category === cat && { color: colors.white }
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button 
                title="Add Expense" 
                onPress={handleAddExpense} 
                loading={isSubmitting}
                style={styles.submitButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={filterVisible} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.filterOverlay} 
          activeOpacity={1} 
          onPress={() => setFilterVisible(false)}
        >
          <View style={[styles.filterContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.filterTitle, { color: colors.black }]}>Filter by Category</Text>
            <TouchableOpacity 
              style={styles.filterItem} 
              onPress={() => { setSelectedCategory(null); setFilterVisible(false); }}
            >
              <Text style={{ color: !selectedCategory ? colors.primary : colors.black }}>All Categories</Text>
            </TouchableOpacity>
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat}
                style={styles.filterItem} 
                onPress={() => { setSelectedCategory(cat); setFilterVisible(false); }}
              >
                <Text style={{ color: selectedCategory === cat ? colors.primary : colors.black }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing['2xl'] + 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
  },
  headerAmount: {
    color: '#FFFFFF',
    fontSize: 42,
    fontFamily: typography.fontFamily.bold,
    marginVertical: spacing.xs,
  },
  headerActions: {
    marginTop: spacing.md,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  headerButtonText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontFamily: typography.fontFamily.medium,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  expenseCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  expenseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  expenseTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
  },
  expenseDate: {
    fontSize: 12,
    marginTop: 2,
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 4,
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
  },
  formContent: {
    paddingBottom: spacing['2xl'],
  },
  label: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  filterOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  filterContent: {
    width: '100%',
    borderRadius: 20,
    padding: spacing.xl,
  },
  filterTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.md,
  },
  filterItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});
