import { useEffect, useRef, useState } from 'react';
import { connect as io } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const getSocketUrl = () => {
  const hostUri = Constants?.expoConfig?.hostUri;
  if (hostUri) {
    const pcIpAddress = hostUri.split(':')[0];
    return `http://${pcIpAddress}:5000`;
  }
  return 'http://localhost:5000';
};

export const useRealtime = () => {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    const connectSocket = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (!token) return;

      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const socket = io(getSocketUrl(), {
        auth: { token },
        transports: ['websocket'], // Faster and avoids some CORS issues in Expo
      });

      socket.on('connect', () => {
        if (mounted) setIsConnected(true);
        console.log('Socket connected');
      });

      socket.on('disconnect', () => {
        if (mounted) setIsConnected(false);
        console.log('Socket disconnected');
      });

      socket.on('connect_error', (err: Error) => {
        console.error('Socket error:', err);
      });

      socketRef.current = socket;
    };

    connectSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const emit = (event: string, data: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
    // Return cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    };
  };

  return { isConnected, emit, on };
};
