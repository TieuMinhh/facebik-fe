import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import chatService from '../services/chatService';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatService.getConversations(),
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId),
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) => 
      chatService.sendMessage(conversationId, content),
    onSuccess: (_, { conversationId }) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      // Also update conversations list to show newest message preview
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useGetOrCreateConversation = () => {
  return useMutation({
    mutationFn: (receiverId: string) => chatService.getOrCreateConversation(receiverId),
  });
};
