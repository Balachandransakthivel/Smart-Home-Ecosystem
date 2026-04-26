import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function ExpenseSummary({ expenses }) {
  const total = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Total Expenses: ${total}</Text>
      {expenses.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.subtitle}>Itemised List:</Text>
          {expenses.map((exp, index) => (
            <View key={exp._id || exp.id || index} style={styles.expenseItem}>
              <Text>{exp.description || exp.name || 'Expense'}</Text>
              <Text>${exp.amount}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fee', borderRadius: 8 },
  title: { fontWeight: 'bold', color: 'red', marginBottom: 10 },
  listContainer: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#fcc', paddingTop: 10 },
  subtitle: { fontWeight: 'bold', marginBottom: 5 },
  expenseItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }
});
