'use client';

import { Search, MoreHorizontal, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useFriends } from '@/features/user/hooks/useUser';
import { useChatStore } from '@/features/chat/components/ChatManager';
import { useGetOrCreateConversation } from '@/features/chat/hooks/useChat';
import { toast } from 'sonner';
import { useSocket } from '@/providers/SocketProvider';
import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface User {
  _id: string;
  displayName: string;
  avatar?: string;
  status?: 'online' | 'offline';
}

export default function RightSidebar() {
  const { data: friendsData, isLoading } = useFriends();
  const { openChat } = useChatStore();
  const getOrCreateConversation = useGetOrCreateConversation();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // Filter only online friends
  const onlineFriends = useMemo(() => {
    const allFriends = (friendsData?.data as User[]) || [];
    return allFriends.filter(friend => friend.status === 'online');
  }, [friendsData?.data]);

  useEffect(() => {
    if (!socket) return;

    const handleStatusChange = (data: { userId: string; status: 'online' | 'offline' }) => {
      // Update the query cache for 'friends'
      queryClient.setQueryData(['friends'], (oldData: { data: User[] } | undefined) => {
        if (!oldData || !('data' in oldData)) return oldData;
        
        return {
          ...oldData,
          data: oldData.data.map((friend) => 
            friend._id === data.userId ? { ...friend, status: data.status } : friend
          )
        };
      });

      // Also update generic 'profile' queries if they are visible
      queryClient.invalidateQueries({ queryKey: ['profile', data.userId] });
    };

    socket.on('user_status_change', handleStatusChange);

    return () => {
      socket.off('user_status_change', handleStatusChange);
    };
  }, [socket, queryClient]);

  const handleContactClick = async (friend: User) => {
    try {
      const response = await getOrCreateConversation.mutateAsync(friend?._id);
      openChat({
        conversationId: response.data._id,
        receiver: {
          _id: friend?._id,
          displayName: friend?.displayName,
          avatar: friend?.avatar
        }
      });
    } catch {
      toast.error('Không thể mở cuộc trò chuyện.');
    }
  };

  return (
    <div className="flex flex-col h-full w-full py-4 pr-4 overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2 text-gray-500 dark:text-zinc-400">
          <h3 className="text-base font-semibold">Người liên hệ</h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"><Video className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"><Search className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"><MoreHorizontal className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="flex flex-col">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-zinc-800"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded"></div>
              </div>
            ))
          ) : onlineFriends.length === 0 ? (
            <p className="px-2 py-2 text-sm text-gray-500 italic font-medium">Chưa có bạn bè nào trực tuyến.</p>
          ) : (
            onlineFriends.map((friend: User) => (
              <div 
                key={friend._id} 
                onClick={() => handleContactClick(friend)}
                className="flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer group"
              >
                <div className="relative h-9 w-9">
                  <Avatar className="h-9 w-9 border border-gray-100 dark:border-zinc-800 transition-opacity group-hover:opacity-90">
                    <AvatarImage src={friend?.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xs">
                      {friend?.displayName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-zinc-900 shadow-sm animate-pulse"></span>
                </div>
                <span className="text-sm font-medium dark:text-zinc-300 transition-colors group-hover:text-gray-900 dark:group-hover:text-zinc-50">{friend?.displayName}</span>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-zinc-800 mt-4 pt-4">
           <h3 className="mb-2 px-2 text-base font-semibold text-gray-500 dark:text-zinc-400">Cuộc trò chuyện nhóm</h3>
           <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 dark:text-zinc-400 font-medium hover:bg-gray-200 dark:hover:bg-zinc-800 py-6">
             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-800">
               <span className="text-xl">+</span>
             </div>
             Tạo nhóm mới
           </Button>
        </div>
      </div>
    </div>
  );
}
