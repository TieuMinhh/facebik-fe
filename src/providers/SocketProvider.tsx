'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
      
      // Join personal room for private notifications
      socketInstance.emit('join_personal_room', user._id);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    // Handle generic notifications
    socketInstance.on('new_notification', (data) => {
      console.log('New notification received:', data);
      toast.success(data.message || 'Bạn có thông báo mới!', {
        description: data.content,
        action: {
          label: 'Xem',
          onClick: () => console.log('Notification clicked'),
        },
      });
    });

    // Handle real-time incoming messages global toast
    socketInstance.on('receive_message', (data) => {
      console.log('New message received:', data);
      toast.info(`Tin nhắn mới từ ${data.sender.displayName}`, {
        description: data.content,
        action: {
          label: 'Xem',
          onClick: () => console.log('Mở chat'),
        },
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
