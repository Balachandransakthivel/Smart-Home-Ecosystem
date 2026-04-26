import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'guest';
  householdId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const accessToken = await SecureStore.getItemAsync('token');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      const userData = await SecureStore.getItemAsync('user');

      if (accessToken && userData) {
        setUser(JSON.parse(userData));
      } else if (refreshToken) {
        // Try to refresh token if we only have refresh token
        try {
          const response = await api.post('/auth/refresh', { token: refreshToken });
          const { accessToken: newAccess, refreshToken: newRefresh } = response.data;
          
          await SecureStore.setItemAsync('token', newAccess);
          await SecureStore.setItemAsync('refreshToken', newRefresh);
          
          // Re-load user data if possible, or we might need a /auth/me endpoint
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (err) {
          console.error('Refresh failed during startup');
          await logout();
        }
      }
    } catch (e) {
      console.error('Failed to load auth state', e);
    } finally {
      setIsLoading(false);
    }
  }

  const login = async (accessToken: string, refreshToken: string, userModel: any) => {
    const userData: User = {
      id: userModel.id || userModel._id,
      email: userModel.email,
      name: userModel.name,
      role: userModel.role || 'member',
      householdId: userModel.householdId,
    };

    await SecureStore.setItemAsync('token', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    await SecureStore.setItemAsync('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      const token = await SecureStore.getItemAsync('refreshToken');
      if (token) {
        await api.post('/auth/logout', { token });
      }
    } catch (err) {
      console.error('Logout request failed');
    } finally {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('user');
      setUser(null);
      router.replace('/(auth)/login');
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
