import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExpenseSummary({ expenses }: any) {
  const total = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total Monthly Expenses</Text>
      <Text style={styles.total}>${total.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff5f5', borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  label: { fontSize: 16, color: '#e53e3e', fontWeight: 'bold' },
  total: { fontSize: 32, fontWeight: 'bold', color: '#c53030', marginTop: 5 }
});