import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Alert, 
  Modal, 
  Image,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import householdService from '../services/householdService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function SettingsScreen() {
  const { user, logout, updateUser } = useAuth();
  const { mode, setMode, colors, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  
  // Household Management states
  const [householdName, setHouseholdName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user?.householdId) {
      fetchMembers();
      fetchInviteCode();
    }
  }, [user]);

  const fetchMembers = async () => {
    try {
      const res = await householdService.getMembers();
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch members', err);
    }
  };

  const fetchInviteCode = async () => {
    try {
      const res = await householdService.getInviteCode();
      setInviteCode(res.data.code);
    } catch (err) {
      console.error('Failed to fetch invite code', err);
    }
  };

  const handleCreateHousehold = async () => {
    if (!householdName) return Alert.alert('Error', 'Please enter a household name');
    try {
      setLoading(true);
      const res = await householdService.createHousehold(householdName);
      await updateUser({ householdId: res.data._id, role: 'admin' });
      Alert.alert('Success', 'Household created!');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create household';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinHousehold = async () => {
    if (!joinCode) return Alert.alert('Error', 'Please enter an invite code');
    try {
      setLoading(true);
      const res = await householdService.joinHousehold(joinCode);
      await updateUser({ householdId: res.data._id });
      Alert.alert('Success', 'Joined household!');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid code or failed to join';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (memberId: string, name: string) => {
    if (memberId === user?.id) return;
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: async () => {
          try {
            await householdService.removeMember(memberId);
            fetchMembers();
          } catch (err) {
            Alert.alert('Error', 'Failed to remove member');
          }
        }}
      ]
    );
  };

  const SettingRow = ({ icon, title, subtitle, value, type = 'toggle', onPress, options }: any) => (
    <TouchableOpacity 
      style={[styles.settingRow, { borderBottomColor: colors.neutral[100] }]} 
      onPress={onPress}
      disabled={type === 'toggle'}
    >
      <View style={styles.settingIconContainer}>
        <View style={[styles.iconBox, { backgroundColor: colors.primary + '10' }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, { color: colors.black }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: colors.neutral[500] }]}>{subtitle}</Text>}
      </View>
      {type === 'toggle' && (
        <Switch 
          value={value} 
          onValueChange={onPress}
          trackColor={{ false: colors.neutral[200], true: colors.primary + '80' }}
          thumbColor={value ? colors.primary : colors.neutral[400]}
        />
      )}
      {type === 'link' && (
        <Ionicons name="chevron-forward" size={20} color={colors.neutral[300]} />
      )}
      {type === 'text' && (
        <Text style={[styles.settingValue, { color: colors.primary }]}>{value}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {/* Profile Section */}
      <Card style={[styles.profileCard, { backgroundColor: colors.surface }]}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.black }]}>{user?.name}</Text>
            <Text style={[styles.profileEmail, { color: colors.neutral[500] }]}>{user?.email}</Text>
            <View style={[styles.roleBadge, { backgroundColor: isAdmin ? colors.primary + '15' : colors.neutral[100] }]}>
              <Text style={[styles.roleBadgeText, { color: isAdmin ? colors.primary : colors.neutral[600] }]}>
                {user?.role?.toUpperCase()}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.editBtn, { backgroundColor: colors.primary + '10' }]}>
            <Ionicons name="pencil" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Theme Settings */}
      <Text style={[styles.sectionTitle, { color: colors.neutral[500] }]}>Appearance</Text>
      <Card style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
        <View style={styles.themeSelector}>
          {[
            { id: 'light', icon: 'sunny-outline', label: 'Light' },
            { id: 'dark', icon: 'moon-outline', label: 'Dark' },
            { id: 'system', icon: 'settings-outline', label: 'System' }
          ].map(t => (
            <TouchableOpacity 
              key={t.id}
              style={[
                styles.themeOption, 
                mode === t.id && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setMode(t.id as any)}
            >
              <Ionicons 
                name={t.icon as any} 
                size={20} 
                color={mode === t.id ? 'white' : colors.neutral[500]} 
              />
              <Text style={[
                styles.themeLabel, 
                { color: mode === t.id ? 'white' : colors.neutral[700] }
              ]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Household Settings */}
      <Text style={[styles.sectionTitle, { color: colors.neutral[500] }]}>Household</Text>
      {!user?.householdId ? (
        <Card style={[styles.noHouseholdCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.noHouseholdTitle, { color: colors.black }]}>No Household Yet</Text>
          <Text style={[styles.noHouseholdDesc, { color: colors.neutral[500] }]}>
            Create a new household to manage your home or join an existing one.
          </Text>
          <Input 
            placeholder="Household Name" 
            value={householdName}
            onChangeText={setHouseholdName}
          />
          <Button title="Create Household" onPress={handleCreateHousehold} loading={loading} />
          <View style={styles.divider} />
          <Input 
            placeholder="Invite Code" 
            value={joinCode}
            onChangeText={setJoinCode}
          />
          <Button title="Join Household" variant="outline" onPress={handleJoinHousehold} loading={loading} />
        </Card>
      ) : (
        <Card style={[styles.settingsCard, { backgroundColor: colors.surface, padding: 0 }]}>
          <View style={styles.memberHeader}>
            <Text style={[styles.memberTitle, { color: colors.black }]}>Members</Text>
            {isAdmin && (
              <TouchableOpacity onPress={() => setShowInviteModal(true)}>
                <Ionicons name="person-add-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          {members.map((member, idx) => (
            <View key={member._id} style={[styles.memberRow, idx === members.length - 1 && { borderBottomWidth: 0 }, { borderBottomColor: colors.neutral[50] }]}>
              <View style={[styles.memberAvatarSmall, { backgroundColor: colors.neutral[100] }]}>
                <Text style={[styles.memberAvatarTextSmall, { color: colors.neutral[600] }]}>
                  {member.name.charAt(0)}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={[styles.memberName, { color: colors.black }]}>
                  {member.name} {member._id === user?.id && '(You)'}
                </Text>
                <Text style={[styles.memberRole, { color: colors.neutral[400] }]}>
                  {member.role === 'admin' ? 'Household Admin' : 'Member'}
                </Text>
              </View>
              {isAdmin && member._id !== user?.id && (
                <TouchableOpacity onPress={() => handleRemoveMember(member._id, member.name)}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </Card>
      )}

      {/* Account Settings */}
      <Text style={[styles.sectionTitle, { color: colors.neutral[500] }]}>Account</Text>
      <Card style={[styles.settingsCard, { backgroundColor: colors.surface, padding: 0 }]}>
        <SettingRow icon="person-outline" title="Profile Settings" type="link" onPress={() => {}} />
        <SettingRow icon="notifications-outline" title="Notifications" type="toggle" value={true} onPress={() => {}} />
        <SettingRow icon="lock-closed-outline" title="Security" type="link" onPress={() => {}} />
      </Card>

      <Button 
        title="Logout" 
        variant="ghost" 
        onPress={logout} 
        style={styles.logoutBtn}
        textStyle={{ color: colors.error }}
      />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.neutral[400] }]}>Smart Home Management v2.0</Text>
      </View>

      {/* Invite Modal */}
      <Modal visible={showInviteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.black }]}>Invite Family Member</Text>
            <Text style={[styles.modalDesc, { color: colors.neutral[500] }]}>
              Share this code with your family members so they can join your household.
            </Text>
            <View style={[styles.inviteCodeContainer, { backgroundColor: colors.primary + '10' }]}>
              <Text style={[styles.inviteCode, { color: colors.primary }]}>{inviteCode || 'LOADING...'}</Text>
            </View>
            <Button title="Close" onPress={() => setShowInviteModal(false)} style={{ width: '100%' }} />
          </View>
        </View>
      </Modal>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  profileCard: {
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    color: 'white',
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  profileName: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
  },
  profileEmail: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    marginTop: spacing.md,
  },
  settingsCard: {
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    marginRight: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
  },
  settingSubtitle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
  },
  settingValue: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 8,
  },
  themeLabel: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
  },
  noHouseholdCard: {
    padding: spacing.xl,
    borderRadius: 20,
    alignItems: 'center',
  },
  noHouseholdTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 4,
  },
  noHouseholdDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: spacing.xl,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  memberTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  memberAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarTextSmall: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
  },
  memberName: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
  },
  memberRole: {
    fontSize: 12,
    marginTop: 1,
  },
  logoutBtn: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  footerText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.sm,
  },
  modalDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inviteCodeContainer: {
    width: '100%',
    padding: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  inviteCode: {
    fontSize: 32,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 4,
  },
});