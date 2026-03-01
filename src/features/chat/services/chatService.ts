import api from '@/lib/axios';

const chatService = {
  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },

  getMessages: async (conversationId: string) => {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
  },

  sendMessage: async (conversationId: string, content: string) => {
    const response = await api.post('/messages', { conversationId, content });
    return response.data;
  },

  getOrCreateConversation: async (receiverId: string) => {
    const response = await api.post('/conversations', { receiverId });
    return response.data;
  }
};

export default chatService;
