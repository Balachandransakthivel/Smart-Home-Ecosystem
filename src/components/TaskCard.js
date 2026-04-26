import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TaskCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>[{item.type}] {item.title || item.name}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#f9f9f9', marginBottom: 8, borderRadius: 8 },
  title: { fontWeight: 'bold' }
});
