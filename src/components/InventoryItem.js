import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InventoryItem({ item }) {
  return (
    <View style={styles.card}>
        <Text style={styles.title}>{item.itemName}</Text>
        <Text>Qty: {item.quantity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fff', marginBottom: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  title: { fontWeight: 'bold' }
});
