import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL && !process.env.EXPO_PUBLIC_API_URL.includes('localhost')) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  const hostUri = Constants?.expoConfig?.hostUri;
  if (hostUri) {
    const pcIpAddress = hostUri.split(':')[0];
    return `http://${pcIpAddress}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({ 
  baseURL: getBaseUrl(),
  timeout: 10000 // 10 second timeout
});

console.log('Connecting to Backend at:', getBaseUrl());

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Handle 401 Unauthorized
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (refreshToken) {
          // Attempt to refresh the token
          const response = await axios.post(`${getBaseUrl()}/auth/refresh`, { token: refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          await SecureStore.setItemAsync('token', accessToken);
          await SecureStore.setItemAsync('refreshToken', newRefreshToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        console.error('Refresh token failed:', refreshErr);
        // Clear tokens and redirect to login if refresh fails
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('user');
        router.replace('/(auth)/login');
      }
    }
    
    return Promise.reject(err);
  }
);

export default api;
