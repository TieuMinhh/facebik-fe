'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Minus, Send, Phone, Video, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMessages, useSendMessage } from '../hooks/useChat';
import { useAuthStore } from '@/store/authStore';
import { useSocket } from '@/providers/SocketProvider';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ChatBoxProps {
  conversationId: string;
  receiver: {
    _id: string;
    displayName: string;
    avatar?: string;
  };
  onClose: () => void;
}

export default function ChatBox({ conversationId, receiver, onClose }: ChatBoxProps) {
  const { user } = useAuthStore();
  const { socket } = useSocket();
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messagesData, refetch } = useMessages(conversationId);
  const sendMessageMutation = useSendMessage();

  const messages = messagesData?.data || [];

  // Handle real-time incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: any) => {
      if (newMessage.conversationId === conversationId) {
        refetch(); // Invalidate and refetch
      }
    };

    socket.on('receive_message', handleNewMessage);
    return () => {
      socket.off('receive_message', handleNewMessage);
    };
  }, [socket, conversationId, refetch]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || sendMessageMutation.isPending) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId,
        content: message
      });
      setMessage('');
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="w-48 bg-white dark:bg-zinc-800 shadow-xl border border-gray-200 dark:border-zinc-700 rounded-t-lg p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={receiver?.avatar} />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xs">
            {receiver?.displayName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold truncate flex-1">{receiver?.displayName}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-[320px] h-[450px] bg-white dark:bg-zinc-900 shadow-2xl border border-gray-200 dark:border-zinc-800 rounded-t-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between shadow-sm bg-white dark:bg-zinc-900 z-10">
        <div className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md p-1 transition-colors">
          <div className="relative">
            <Avatar className="h-8 w-8">
               <AvatarImage src={receiver?.avatar} />
               <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xs uppercase">
                 {receiver?.displayName?.charAt(0)}
               </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></span>
          </div>
          <div className="flex flex-col flex-1 truncate">
            <span className="text-sm font-bold truncate leading-tight">{receiver?.displayName}</span>
            <span className="text-[10px] text-gray-500 font-medium">Đang hoạt động</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 rounded-full hover:bg-gray-100"><Phone className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 rounded-full hover:bg-gray-100"><Video className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 rounded-full hover:bg-gray-100" onClick={() => setIsMinimized(true)}><Minus className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 rounded-full hover:bg-gray-100" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 scrollbar-hide bg-gray-50/30 dark:bg-zinc-900/50"
      >
        <div className="flex flex-col items-center py-6 gap-2">
           <Avatar className="h-16 w-16 mb-2">
             <AvatarImage src={receiver?.avatar} />
             <AvatarFallback className="text-xl">{receiver?.displayName?.charAt(0)}</AvatarFallback>
           </Avatar>
           <h3 className="font-bold text-lg">{receiver?.displayName}</h3>
           <p className="text-xs text-gray-500">Các bạn là bạn bè trên Facebook</p>
        </div>

        {messages.map((msg: any, i: number) => {
          const isMe = msg.sender._id === user?._id;
          return (
            <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
              {i === messages.length - 1 && (
                <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: vi })}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-2 bg-white dark:bg-zinc-900">
        <Input 
          placeholder="Nhập tin nhắn..." 
          className="flex-1 bg-gray-100 dark:bg-zinc-800 border-none rounded-full h-9 focus-visible:ring-blue-600 transition-all text-sm px-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button 
          type="submit" 
          variant="ghost" 
          size="icon" 
          className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
