import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  StatusBar
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function InsightsScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Ionicons name="stats-chart" size={24} color={colors.secondary} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* === SECTION 1: Predictive Insights === */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="bar-chart" size={16} color="#64748B" />
          <Text style={styles.sectionTitle}>Predictive Insights</Text>
        </View>
        
        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="trending-up" size={18} color={colors.secondary} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>Next Month Forecast</Text>
            <View style={styles.valRow}>
              <Text style={styles.cardValue}>₹0</Text>
              <Ionicons name="arrow-up" size={14} color={colors.error} style={{marginLeft: 4}}/>
            </View>
            <Text style={styles.cardSubText}>Highly stable spending</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#F5F3FF' }]}>
            <Ionicons name="wallet-outline" size={18} color={colors.accent} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>Weekly Average</Text>
            <Text style={styles.cardValue}>₹50</Text>
            <Text style={styles.cardSubText}>You pay</Text>
          </View>
        </View>

        {/* === SECTION 2: Monthly Spending Trend === */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Monthly Spending Trend</Text>
        </View>
        
        <View style={styles.cardColumn}>
          <View style={styles.trendHeaderBox}>
            <View style={[styles.dot, { backgroundColor: colors.accent }]} />
            <Text style={styles.trendLegendText}>Total Spending</Text>
          </View>
          {/* Mock Chart Area */}
          <View style={styles.mockChartArea}>
            {/* Y Axis Mock */}
            <View style={styles.yAxis}>
              <Text style={styles.axisText}>800</Text>
              <Text style={styles.axisText}>600</Text>
              <Text style={styles.axisText}>400</Text>
              <Text style={styles.axisText}>200</Text>
              <Text style={styles.axisText}>0</Text>
            </View>
            {/* Graph Space */}
            <View style={styles.graphBody}>
              {/* Fake grid lines */}
              {[1, 2, 3, 4, 5].map((l) => <View key={l} style={styles.gridLine} />)}
              {/* Fake Area Path (Just CSS mock representing the image outline) */}
              <View style={styles.mockPathWrapper}>
                <View style={styles.mockPeakLine} />
                <View style={styles.mockPeakDot} />
              </View>
            </View>
          </View>
          {/* X Axis Mock */}
          <View style={styles.xAxis}>
            {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((m) => (
              <Text key={m} style={styles.axisText}>{m}</Text>
            ))}
          </View>
        </View>

        {/* === SECTION 3: Bill Payment Analytics === */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="cash-outline" size={16} color="#64748B" />
          <Text style={styles.sectionTitle}>Bill Payment Analytics</Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.secondary} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>On-Time Payments</Text>
            <Text style={styles.cardValue}>0</Text>
            <Text style={styles.cardSubText}>100% success rate</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="time-outline" size={20} color={colors.error} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>Late Payments</Text>
            <Text style={styles.cardValue}>1</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
            <Ionicons name="refresh-outline" size={20} color={colors.warning} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>Recurring Bills Total</Text>
            <Text style={styles.cardValue}>₹0</Text>
            <Text style={styles.cardSubText}>Monthly fixed expense</Text>
          </View>
        </View>

        {/* === SECTION 4: Spending by Category === */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
        </View>
        <View style={[styles.cardColumn, { flexDirection: 'row', alignItems: 'center' }]}>
          {/* Mock Pie Chart inside */}
          <View style={[styles.mockPie, { backgroundColor: colors.secondary }]} />
          <View style={{ marginLeft: 20 }}>
            <View style={styles.trendHeaderBox}>
              <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
              <Text style={styles.trendLegendText}>₹50 electricity</Text>
            </View>
          </View>
        </View>

        {/* === SECTION 5: Task Performance === */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="checkbox-outline" size={16} color="#64748B" />
          <Text style={styles.sectionTitle}>Task Performance</Text>
        </View>
        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.secondary} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>Completion Rate</Text>
            <Text style={styles.cardValue}>100%</Text>
            <Text style={styles.cardSubText}>Out of 2 tasks</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
            <Ionicons name="document-text-outline" size={20} color={colors.warning} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>Pending Tasks</Text>
            <Text style={styles.cardValue}>0</Text>
          </View>
        </View>

        {/* === SECTION 6: Tasks by Category === */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Tasks by Category</Text>
        </View>
        <View style={styles.cardColumn}>
          {/* Mock Bar chart */}
          <View style={[styles.mockChartArea, { height: 120 }]}>
            <View style={styles.yAxis}>
              <Text style={styles.axisText}>4</Text>
              <Text style={styles.axisText}>3</Text>
              <Text style={styles.axisText}>2</Text>
              <Text style={styles.axisText}>1</Text>
              <Text style={styles.axisText}>0</Text>
            </View>
            <View style={styles.graphBody}>
              {[1, 2, 3, 4, 5].map((l) => <View key={l} style={[styles.gridLine, {marginTop: 20}]} />)}
              <View style={{ position: 'absolute', bottom: 0, left: '20%', width: 24, height: '100%', backgroundColor: '#F3E8FF', borderRadius: 4 }} />
            </View>
          </View>
          <View style={styles.xAxis}>
            <Text style={[styles.axisText, { marginLeft: 50 }]}>yellow</Text>
          </View>
        </View>

        {/* === SECTION 7: Maintenance Analytics === */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="build-outline" size={16} color="#64748B" />
          <Text style={styles.sectionTitle}>Maintenance Analytics</Text>
        </View>
        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
            <Text style={{color: colors.secondary, fontWeight: 'bold'}}>$</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>Total Maintenance Cost</Text>
            <Text style={styles.cardValue}>₹800</Text>
            <Text style={styles.cardSubText}>Avg. ₹800</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
            <Ionicons name="calendar-outline" size={20} color={colors.warning} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>Upcoming Costs</Text>
            <Text style={styles.cardValue}>₹0</Text>
            <Text style={styles.cardSubText}>Next 30 days</Text>
          </View>
        </View>
        <View style={styles.cardColumn}>
          <Text style={styles.cardLabel}>Cost by Type</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <Text style={styles.cardSubText}>Appliance</Text>
            <Text style={[styles.cardValue, { fontSize: 13 }]}>₹800</Text>
          </View>
        </View>

        {/* === SECTION 8: Priority Actions === */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.sectionTitle}>Priority Actions</Text>
        </View>
        <View style={[styles.card, { alignItems: 'center' }]}>
          <View style={styles.cardIndicator} />
          <Text style={[styles.cardSubText, { marginLeft: 12, color: '#334155' }]}>Schedule 1 overdue maintenance task</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  scrollContent: { paddingHorizontal: 20 },
  
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.05, shadowRadius: 8,
  },
  cardColumn: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.05, shadowRadius: 8,
  },
  
  iconBox: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
  },
  cardBody: { flex: 1, justifyContent: 'center' },
  cardLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', marginBottom: 4 },
  cardValue: { fontSize: 18, color: '#0F172A', fontWeight: 'bold' },
  valRow: { flexDirection: 'row', alignItems: 'center' },
  cardSubText: { fontSize: 11, color: '#94A3B8', marginTop: 4 },

  trendHeaderBox: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginBottom: 16, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  trendLegendText: { fontSize: 11, color: '#64748B' },
  
  mockChartArea: { flexDirection: 'row', height: 160, paddingRight: 10 },
  yAxis: { justifyContent: 'space-between', paddingVertical: 10, paddingRight: 10, width: 40, alignItems: 'flex-end' },
  axisText: { fontSize: 10, color: '#94A3B8' },
  graphBody: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', justifyContent: 'space-between' },
  gridLine: { height: 1, backgroundColor: '#F1F5F9', width: '100%', marginTop: 30 },
  mockPathWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  mockPeakLine: { 
    position: 'absolute', left: '18%', bottom: 0, height: '80%', width: 30,
    backgroundColor: '#F3E8FF', borderTopLeftRadius: 15, borderTopRightRadius: 15, opacity: 0.8
  },
  mockPeakDot: { position: 'absolute', left: '21.5%', bottom: '80%', width: 8, height: 8, borderRadius: 4, backgroundColor: '#11B9A3' },
  xAxis: { flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 40, marginTop: 8, paddingRight: 10 },

  mockPie: { width: 120, height: 120, borderRadius: 60, marginLeft: 10 },
  
  cardIndicator: {
    position: 'absolute', left: 0, top: 16, bottom: 16, width: 4, backgroundColor: '#EF4444',
    borderTopRightRadius: 4, borderBottomRightRadius: 4,
  }
});
