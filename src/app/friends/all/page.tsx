'use client';

import { useState } from 'react';
import { useFriends } from '@/features/friends/hooks/useFriends';
import FriendCard from '@/features/friends/components/FriendCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Ghost } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Friend {
  _id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
}

export default function AllFriendsPage() {
  const { friends, isLoadingFriends, unfriend } = useFriends();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = (friends as Friend[]).filter((friend) => 
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tất cả bạn bè</h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm bạn bè"
            className="pl-10 h-10 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoadingFriends ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-3/4 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredFriends.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {filteredFriends.map((friend: Friend) => (
            <FriendCard
              key={friend._id}
              userId={friend._id}
              username={friend.username}
              displayName={friend.displayName}
              avatar={friend.avatar}
              bio={friend.bio}
              type="friend"
              onAction={() => unfriend(friend._id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800 text-center">
          <Ghost className="h-12 w-12 text-gray-300 dark:text-zinc-700 mb-2" />
          <p className="text-gray-500 dark:text-zinc-500 italic">
            {searchQuery ? 'Không tìm thấy ai phù hợp đạo hữu ơi!' : 'Đạo hữu chưa có người bạn nào ư? Hãy kết duyên nhé!'}
          </p>
        </div>
      )}
    </div>
  );
}
