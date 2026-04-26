import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import api from '@/services/api';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await api.post('/auth/register', { 
        email, 
        password, 
        name,
        role,
        username: email.split('@')[0]
      });
      
      const loginResponse = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = loginResponse.data;
      
      await login(accessToken, refreshToken, user);
      router.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="home-outline" size={40} color={theme.colors.success} />
          </View>
          <Text style={styles.header}>Create Account</Text>
          <Text style={styles.subtitle}>Join our smart home community</Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.neutral[400]} />}
          />
          <Input
            label="Email Address"
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.roleLabel}>Select Your Role</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'admin' && styles.roleButtonActive]} 
              onPress={() => setRole('admin')}
            >
              <Ionicons name="shield-checkmark" size={24} color={role === 'admin' ? 'white' : theme.colors.neutral[500]} />
              <Text style={[styles.roleText, role === 'admin' && styles.roleTextActive]}>Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'member' && styles.roleButtonActive]} 
              onPress={() => setRole('member')}
            >
              <Ionicons name="people" size={24} color={role === 'member' ? 'white' : theme.colors.neutral[500]} />
              <Text style={[styles.roleText, role === 'member' && styles.roleTextActive]}>Member</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.roleHint}>
            {role === 'admin' ? 'Admins have full control over the household.' : 'Members can view and control devices.'}
          </Text>

          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={theme.colors.neutral[400]} />
              </TouchableOpacity>
            }
          />
          <Input
            label="Confirm Password"
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Button
            title="Register"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerBtn}
          />

          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.footerLink}>
            <Text style={styles.footerText}>Already have an account? <Text style={styles.footerLinkBold}>Login</Text></Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl,
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  header: {
    ...theme.typography.presets.h1,
    color: theme.colors.neutral[900],
  },
  subtitle: {
    ...theme.typography.presets.body,
    color: theme.colors.neutral[500],
    marginTop: theme.spacing.xs,
  },
  formCard: {
    padding: theme.spacing.lg,
    borderRadius: 20,
    ...theme.shadows.md,
  },
  roleLabel: {
    ...theme.typography.presets.caption,
    color: theme.colors.neutral[700],
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    backgroundColor: 'white',
    gap: theme.spacing.sm,
  },
  roleButtonActive: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  roleText: {
    ...theme.typography.presets.body,
    fontWeight: '600',
    color: theme.colors.neutral[600],
  },
  roleTextActive: {
    color: 'white',
  },
  roleHint: {
    ...theme.typography.presets.caption,
    color: theme.colors.neutral[500],
    fontStyle: 'italic',
    marginBottom: theme.spacing.md,
  },
  registerBtn: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.success,
    borderRadius: 12,
    height: 56,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: theme.spacing.sm,
  },
  errorText: {
    ...theme.typography.presets.caption,
    color: theme.colors.error,
  },
  footerLink: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.presets.body,
    color: theme.colors.neutral[600],
  },
  footerLinkBold: {
    color: theme.colors.success,
    fontWeight: 'bold',
  },
});