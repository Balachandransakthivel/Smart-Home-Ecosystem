import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MaintenanceCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.deviceName}</Text>
      <Text>Due: {item.dueDate || item.date}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#eef', marginBottom: 8, borderRadius: 8 },
  title: { fontWeight: 'bold' }
});
