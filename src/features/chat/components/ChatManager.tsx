'use client';

import { create } from 'zustand';
import ChatBox from './ChatBox';

interface ChatWindow {
  conversationId: string;
  receiver: {
    _id: string;
    displayName: string;
    avatar?: string;
  };
}

interface ChatStore {
  activeChats: ChatWindow[];
  openChat: (chat: ChatWindow) => void;
  closeChat: (conversationId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  activeChats: [],
  openChat: (chat) => set((state) => {
    // If already open, don't add again
    if (state.activeChats.some(c => c.conversationId === chat.conversationId)) {
      return state;
    }
    // Limit to 3 active chats for better UX on web
    const newChats = [...state.activeChats, chat].slice(-3);
    return { activeChats: newChats };
  }),
  closeChat: (conversationId) => set((state) => ({
    activeChats: state.activeChats.filter(c => c.conversationId !== conversationId)
  })),
}));

export default function ChatManager() {
  const { activeChats, closeChat } = useChatStore();

  if (activeChats.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-4 md:right-10 flex items-end gap-3 z-50 pointer-events-none">
      <div className="flex items-end gap-3 pointer-events-auto">
        {activeChats.map((chat) => (
          <ChatBox 
            key={chat.conversationId} 
            conversationId={chat.conversationId} 
            receiver={chat.receiver} 
            onClose={() => closeChat(chat.conversationId)} 
          />
        ))}
      </div>
    </div>
  );
}
