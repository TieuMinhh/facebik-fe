'use client';

import Link from 'next/link';
import { useFriends } from '@/features/friends/hooks/useFriends';
import FriendCard from '@/features/friends/components/FriendCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

interface FriendUser {
  _id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  mutualFriendsCount?: number;
  friendStatus?: 'none' | 'pending' | 'friends' | 'received';
  requestId?: string;
}

interface FriendRequest {
  _id: string;
  sender: FriendUser;
  recipient: string;
  status: string;
  createdAt: string;
}

export default function FriendsPage() {
  const { 
    requests, 
    isLoadingRequests, 
    suggestions, 
    isLoadingSuggestions,
    acceptRequest,
    declineRequest,
    sendRequest,
    cancelRequest
  } = useFriends();

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      {/* Friend Requests Section */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lời mời kết bạn</h2>
          <Link href="/friends/requests" className="text-sm font-medium text-blue-600 hover:underline">
            Xem tất cả
          </Link>
        </div>
        
        {isLoadingRequests ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-3/4 w-full rounded-xl" />
            ))}
          </div>
        ) : requests.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {requests.map((req: FriendRequest) => (
              <FriendCard
                key={req._id}
                userId={req.sender._id}
                username={req.sender.username}
                displayName={req.sender.displayName}
                avatar={req.sender.avatar}
                type="request"
                onAction={() => acceptRequest(req._id)}
                onSecondaryAction={() => declineRequest(req._id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800">
            <p className="text-gray-500 dark:text-zinc-500 italic">Không có lời mời nào đạo hữu ơi!</p>
          </div>
        )}
      </section>

      <Separator className="my-8" />

      {/* People You May Know Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Những người bạn có thể biết</h2>
          <Link href="/friends/suggestions" className="text-sm font-medium text-blue-600 hover:underline">
            Xem tất cả
          </Link>
        </div>

        {isLoadingSuggestions ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-3/4 w-full rounded-xl" />
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {suggestions.map((user: FriendUser) => (
              <FriendCard
                key={user._id}
                userId={user._id}
                username={user.username}
                displayName={user.displayName}
                avatar={user.avatar}
                bio={user.bio}
                type="suggestion"
                mutualFriendsCount={user.mutualFriendsCount}
                friendStatus={user.friendStatus}
                requestId={user.requestId}
                onAction={() => {
                  if (user.friendStatus === 'pending' && user.requestId) {
                    cancelRequest(user.requestId);
                  } else {
                    sendRequest(user._id);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800">
            <p className="text-gray-500 dark:text-zinc-500 italic">Hết gợi ý rồi đạo hữu!</p>
          </div>
        )}
      </section>
    </div>
  );
}
