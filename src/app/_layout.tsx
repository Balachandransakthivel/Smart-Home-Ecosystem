import { Tabs, router, Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { Loading } from '../components/ui/Loading';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

function RootContent() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/(auth)/login');
      }
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <Loading message="Starting Smart Home..." overlay />;
  }

  if (isAuthenticated) {
    return (
      <Tabs 
        screenOptions={{ 
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            color: colors.black,
            fontFamily: 'Inter-Bold', // Assuming Inter is available or fallback to system
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.neutral[400],
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.neutral[100],
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 5,
          }
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }} 
        />
        <Tabs.Screen 
          name="tasks" 
          options={{ 
            title: 'Tasks',
            tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" size={size} color={color} />,
          }} 
        />
        <Tabs.Screen 
          name="inventory" 
          options={{ 
            title: 'Inventory',
            tabBarIcon: ({ color, size }) => <Ionicons name="cube-outline" size={size} color={color} />,
          }} 
        />
        <Tabs.Screen 
          name="maintenance" 
          options={{ 
            title: 'Maintenance',
            tabBarIcon: ({ color, size }) => <Ionicons name="construct-outline" size={size} color={color} />,
          }} 
        />
        <Tabs.Screen 
          name="spending" 
          options={{ href: null }} 
        />
        <Tabs.Screen 
          name="alerts" 
          options={{ href: null }} 
        />
        <Tabs.Screen 
          name="settings" 
          options={{ 
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
          }} 
        />
        <Tabs.Screen name="(auth)" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="insights" options={{ href: null }} />
      </Tabs>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
