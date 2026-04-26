import os

base_dir = r"d:\projects\Mini Project\Smart_home"

files = {
    "src/components/StatCard.tsx": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ title, count, color = '#2b6cb0' }: any) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, backgroundColor: 'white', borderRadius: 8, margin: 5, flex: 1, borderLeftWidth: 4, elevation: 2 },
  title: { fontSize: 14, color: '#666' },
  count: { fontSize: 24, fontWeight: 'bold', marginTop: 5 }
});""",

    "src/components/AlertCard.tsx": """import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function AlertCard({ alert, onRead }: any) {
  return (
    <TouchableOpacity onPress={() => onRead(alert._id)} style={[styles.card, alert.read ? styles.read : styles.unread]}>
      <View style={styles.content}>
        <Text style={styles.message}>{alert.message}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, marginVertical: 5, borderRadius: 8, elevation: 1 },
  unread: { backgroundColor: '#ffeebc' },
  read: { backgroundColor: '#f0f0f0' },
  content: { flexDirection: 'row', justifyContent: 'space-between' },
  message: { fontSize: 16 }
});""",

    "src/components/TaskCard.tsx": """import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TaskCard({ item, onComplete, onDelete }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.meta}>Status: {item.status} | Priority: {item.priority}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => onComplete(item._id)}><Text style={styles.btnText}>Done</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={() => onDelete(item._id)}><Text style={styles.btnText}>Del</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8, elevation: 2 },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
  desc: { color: '#666', marginTop: 4 },
  meta: { fontSize: 12, color: '#888', marginTop: 6 },
  actions: { justifyContent: 'space-around', alignItems: 'center' },
  btn: { backgroundColor: '#48bb78', padding: 8, borderRadius: 4, marginBottom: 5 },
  deleteBtn: { backgroundColor: '#e53e3e' },
  btnText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});""",

    "src/components/CleaningCard.tsx": """import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CleaningCard({ item, onComplete, onDelete }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.type}</Text>
        <Text style={styles.meta}>Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}</Text>
        <Text style={styles.meta}>Recurring: {item.recurring} | Status: {item.status}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => onComplete(item._id)}><Text style={styles.btnText}>Done</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={() => onDelete(item._id)}><Text style={styles.btnText}>Del</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 15, backgroundColor: '#ebf8ff', marginBottom: 10, borderRadius: 8, elevation: 2 },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2b6cb0' },
  meta: { fontSize: 12, color: '#4a5568', marginTop: 6 },
  actions: { justifyContent: 'space-around', alignItems: 'center' },
  btn: { backgroundColor: '#48bb78', padding: 8, borderRadius: 4, marginBottom: 5 },
  deleteBtn: { backgroundColor: '#e53e3e' },
  btnText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});""",

    "src/components/InventoryItem.tsx": """import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function InventoryItem({ item, onDelete }: any) {
  const isLow = item.quantity <= item.threshold;
  return (
    <View style={[styles.card, isLow && styles.lowStockCard]}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.itemName}</Text>
        <Text style={styles.meta}>Qty: {item.quantity} / Threshold: {item.threshold}</Text>
        <Text style={styles.meta}>Category: {item.category}</Text>
      </View>
      {isLow && <View style={styles.badge}><Text style={styles.badgeText}>LOW</Text></View>}
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item._id)}>
        <Text style={styles.btnText}>Del</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8, elevation: 2, alignItems: 'center' },
  lowStockCard: { borderLeftWidth: 4, borderLeftColor: '#e53e3e' },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
  meta: { fontSize: 12, color: '#666', marginTop: 4 },
  badge: { backgroundColor: '#e53e3e', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 10 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  deleteBtn: { backgroundColor: '#e53e3e', padding: 8, borderRadius: 4 },
  btnText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});""",

    "src/components/ExpenseSummary.tsx": """import React from 'react';
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
});""",

    "src/components/MaintenanceCard.tsx": """import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MaintenanceCard({ item, onComplete, onDelete }: any) {
  const isOverdue = new Date(item.dueDate) < new Date();
  return (
    <View style={[styles.card, isOverdue ? styles.overdue : null]}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.deviceName}</Text>
        <Text style={styles.meta}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
        <Text style={styles.meta}>Status: {item.status}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => onComplete(item._id)}><Text style={styles.btnText}>Done</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={() => onDelete(item._id)}><Text style={styles.btnText}>Del</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8, elevation: 2 },
  overdue: { borderLeftWidth: 4, borderLeftColor: '#e53e3e' },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
  meta: { fontSize: 12, color: '#666', marginTop: 4 },
  actions: { justifyContent: 'space-around' },
  btn: { backgroundColor: '#48bb78', padding: 8, borderRadius: 4, marginBottom: 5 },
  deleteBtn: { backgroundColor: '#e53e3e' },
  btnText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});""",

    "src/app/(auth)/login.tsx": """import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true); setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      await SecureStore.setItemAsync('token', token);
      router.replace('/');
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Log In</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.link}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f7fafc' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#2d3748' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  btn: { backgroundColor: '#3182ce', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#3182ce', fontSize: 14 },
  errorText: { color: '#e53e3e', marginBottom: 15, textAlign: 'center' }
});""",

    "src/app/(auth)/register.tsx": """import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import api from '@/services/api';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) return setError("Passwords don't match");
    try {
      setLoading(true); setError('');
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await api.post('/auth/register', { uid: cred.user.uid, email, name });
      const token = await cred.user.getIdToken();
      await SecureStore.setItemAsync('token', token);
      router.replace('/');
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Register</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f7fafc' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#2d3748' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  btn: { backgroundColor: '#48bb78', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#48bb78', fontSize: 14 },
  errorText: { color: '#e53e3e', marginBottom: 15, textAlign: 'center' }
});""",

    "src/app/index.tsx": """import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import taskService from '@/services/taskService';
import inventoryService from '@/services/inventoryService';
import expenseService from '@/services/expenseService';
import alertService from '@/services/alertService';
import maintenanceService from '@/services/maintenanceService';
import aiService from '@/services/aiService';
import StatCard from '@/components/StatCard';
import AlertCard from '@/components/AlertCard';

export default function HomeScreen() {
  const [data, setData] = useState<any>({ tasks: 0, lowStock: 0, maintenance: 0, spend: 0 });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, iRes, eRes, aRes, mRes] = await Promise.all([
        taskService.getTasks(), inventoryService.getInventory(), expenseService.getExpenses(), alertService.getAlerts(), maintenanceService.getMaintenance()
      ]);
      const tasks = tRes.data.filter((t: any) => t.status !== 'completed').length;
      const inv = iRes.data.filter((i: any) => i.quantity <= i.threshold).length;
      const spend = eRes.data.reduce((acc: number, item: any) => acc + item.amount, 0);
      const maint = mRes.data.length;
      setData({ tasks, lowStock: inv, maintenance: maint, spend });
      setAlerts(aRes.data);

      const aiRes = await aiService.getSuggestions(iRes.data);
      setAiSuggestions(aiRes.data.suggestions || []);
    } catch (err) { console.log(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRead = async (id: string) => {
    await alertService.markRead(id);
    fetchData();
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <View style={styles.row}>
        <StatCard title="Pending Tasks" count={data.tasks} color="#3182ce" />
        <StatCard title="Low Stock" count={data.lowStock} color="#e53e3e" />
      </View>
      <View style={styles.row}>
        <StatCard title="Due Maintenance" count={data.maintenance} color="#dd6b20" />
        <StatCard title="This Month Spend" count={`$${data.spend.toFixed(0)}`} color="#38a169" />
      </View>
      <Text style={styles.subHeader}>Recent Alerts</Text>
      {alerts.length === 0 ? <Text style={styles.empty}>No new alerts</Text> : alerts.map(a => <AlertCard key={a._id} alert={a} onRead={handleRead} />)}
      
      <Text style={styles.subHeader}>AI Suggestions</Text>
      {aiSuggestions.map((s, idx) => <Text key={idx} style={styles.aiItem}>💡 {s}</Text>)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f7fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#2d3748' },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#4a5568' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  empty: { color: '#a0aec0', fontStyle: 'italic' },
  aiItem: { backgroundColor: '#eebcf3', padding: 10, borderRadius: 8, marginVertical: 4, color: '#440055', fontWeight: 'bold' }
});""",

    "src/app/tasks.tsx": """import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import TaskCard from '@/components/TaskCard';
import CleaningCard from '@/components/CleaningCard';
import taskService from '@/services/taskService';
import cleaningService from '@/services/cleaningService';

export default function TasksScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, cRes] = await Promise.all([taskService.getTasks(), cleaningService.getCleanings()]);
      const tasks = tRes.data.map((t: any) => ({ ...t, kind: 'task' }));
      const cleans = cRes.data.map((c: any) => ({ ...c, kind: 'cleaning' }));
      setItems([...tasks, ...cleans].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const delTask = async (id: string, kind: string) => {
    if (kind === 'task') await taskService.deleteTask(id);
    else await cleaningService.deleteCleaning(id);
    fetchData();
  };

  const compTask = async (id: string, kind: string) => {
    if (kind === 'task') await taskService.updateTask(id, { status: 'completed' });
    else await cleaningService.updateCleaning(id, { status: 'completed' });
    fetchData();
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        refreshing={loading}
        onRefresh={fetchData}
        keyExtractor={item => item._id}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add your first task!</Text>}
        renderItem={({ item }) => item.kind === 'task' ? 
          <TaskCard item={item} onComplete={() => compTask(item._id, 'task')} onDelete={() => delTask(item._id, 'task')} /> :
          <CleaningCard item={item} onComplete={() => compTask(item._id, 'clean')} onDelete={() => delTask(item._id, 'clean')} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f7fafc' },
  center: { flex: 1, justifyContent: 'center' },
  empty: { textAlign: 'center', marginTop: 50, color: '#a0aec0', fontSize: 16 }
});""",

    "src/app/inventory.tsx": """import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import InventoryItem from '@/components/InventoryItem';
import ExpenseSummary from '@/components/ExpenseSummary';
import inventoryService from '@/services/inventoryService';
import expenseService from '@/services/expenseService';

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try { setLoading(true);
      const [iRes, eRes] = await Promise.all([inventoryService.getInventory(), expenseService.getExpenses()]);
      setInventory(iRes.data); setExpenses(eRes.data);
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const delInv = async (id: string) => { await inventoryService.deleteInventory(id); fetchData(); };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <ExpenseSummary expenses={expenses} />
      <Text style={styles.header}>Pantry & Inventory</Text>
      <FlatList data={inventory} refreshing={loading} onRefresh={fetchData} keyExtractor={i => i._id}
        renderItem={({ item }) => <InventoryItem item={item} onDelete={delInv} />}
        ListEmptyComponent={<Text style={{textAlign: 'center'}}>No items in inventory.</Text>} />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 15 }, center: { flex: 1, justifyContent: 'center' }, header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }});""",

    "src/app/maintenance.tsx": """import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import MaintenanceCard from '@/components/MaintenanceCard';
import maintenanceService from '@/services/maintenanceService';

export default function Maintenance() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async() => { setLoading(true); try { const r = await maintenanceService.getMaintenance(); setData(r.data); } catch{} finally{setLoading(false);}}
  useEffect(() => { fetch(); }, []);

  const del = async (id: string) => { await maintenanceService.deleteMaintenance(id); fetch(); };
  const comp = async (id: string) => { await maintenanceService.updateMaintenance(id, {status: 'completed'}); fetch(); };

  if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator /></View>;
  return (
    <View style={{flex: 1, padding: 15, backgroundColor: '#f7fafc'}}>
      <FlatList data={data} onRefresh={fetch} refreshing={loading} keyExtractor={i => i._id}
        renderItem={({item}) => <MaintenanceCard item={item} onDelete={del} onComplete={comp}/>}
        ListEmptyComponent={<Text style={{textAlign: 'center'}}>No devices tracked yet.</Text>} />
    </View>
  );
}""",

    "src/app/alerts.tsx": """import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import AlertCard from '@/components/AlertCard';
import alertService from '@/services/alertService';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async() => { setLoading(true); try { const r = await alertService.getAlerts(); setAlerts(r.data); } catch{} finally{setLoading(false);}}
  useEffect(() => { fetch(); }, []);

  const markAll = async() => { await alertService.markAllRead(); fetch(); }
  const read = async(id: string) => { await alertService.markRead(id); fetch(); }

  if(loading) return <ActivityIndicator style={{marginTop: 50}} />
  return(
    <View style={{flex:1, padding: 15}}>
      <TouchableOpacity onPress={markAll} style={{backgroundColor:'#3182ce', padding:10, borderRadius:8, marginBottom:10}}><Text style={{color:'white', textAlign:'center', fontWeight:'bold'}}>Mark All Read</Text></TouchableOpacity>
      <FlatList data={alerts} onRefresh={fetch} refreshing={loading} keyExtractor={i => i._id}
        renderItem={({item}) => <AlertCard alert={item} onRead={read} />}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20}}>You're all caught up!</Text>} />
    </View>
  )
}""",

    "src/app/household.tsx": """import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import householdService from '@/services/householdService';

export default function HouseholdScreen() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [createName, setCreateName] = useState('');

  const fetch = async() => { setLoading(true); try { const r = await householdService.getMembers(); setMembers(r.data); } catch{} finally{setLoading(false);}}
  useEffect(() => { fetch(); }, []);

  const create = async() => { await householdService.createHousehold(createName); fetch(); }
  const join = async() => { await householdService.joinHousehold(inviteCode); fetch(); }

  if (loading) return <ActivityIndicator style={{marginTop: 50}} />
  
  if (members.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Join or Create a Household</Text>
        <TextInput placeholder="Household Name" value={createName} onChangeText={setCreateName} style={styles.input} />
        <TouchableOpacity style={styles.btn} onPress={create}><Text style={styles.btnText}>Create Household</Text></TouchableOpacity>
        <Text style={{textAlign:'center', marginVertical:20}}>OR</Text>
        <TextInput placeholder="Invite Code" value={inviteCode} onChangeText={setInviteCode} style={styles.input} />
        <TouchableOpacity style={styles.btnAlt} onPress={join}><Text style={styles.btnText}>Join Household</Text></TouchableOpacity>
      </View>
    );
  }

  return(
    <View style={styles.container}>
      <Text style={styles.header}>My Household</Text>
      {members.map(m => (
        <View key={m.uid} style={styles.card}>
          <Text style={styles.name}>{m.name}</Text>
          <Text style={styles.role}>{m.role}</Text>
        </View>
      ))}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {flex:1, padding:20, backgroundColor: '#f7fafc'}, header: {fontSize:24, fontWeight:'bold', marginBottom:20},
  input: {backgroundColor:'white', padding:15, borderRadius:8, marginBottom:10, borderWidth:1, borderColor:'#ddd'},
  btn: {backgroundColor:'#48bb78', padding:15, borderRadius:8, alignItems:'center'}, btnText: {color:'white', fontWeight:'bold'},
  btnAlt: {backgroundColor:'#3182ce', padding:15, borderRadius:8, alignItems:'center'},
  card: {backgroundColor:'white', padding:15, borderRadius:8, marginBottom:10, flexDirection:'row', justifyContent:'space-between'},
  name: {fontSize:18, fontWeight:'bold'}, role: {color:'#718096'}
});"""
}

# Write files
for p, content in files.items():
    full_path = os.path.join(base_dir, p)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding='utf-8') as f:
        f.write(content)

print(f"Successfully generated {len(files)} frontend React Native screens and components!")
