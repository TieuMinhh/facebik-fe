'use client';

import { useParams } from 'next/navigation';
import { useFriends } from '@/features/friends/hooks/useFriends';
import FriendCard from '@/features/friends/components/FriendCard';
import { Skeleton } from '@/components/ui/skeleton';

interface FriendUser {
  _id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
}

interface FriendRequest {
  _id: string;
  sender: FriendUser;
  recipient: string;
  status: string;
  createdAt: string;
}

export default function FriendCategoryPage() {
  const { category } = useParams();
  const { 
    friends, 
    isLoadingFriends,
    requests, 
    isLoadingRequests, 
    suggestions, 
    isLoadingSuggestions,
    acceptRequest,
    declineRequest,
    sendRequest,
    unfriend
  } = useFriends();

  let title = '';
  let content = null;
  let isEmpty = false;

  if (category === 'requests') {
    title = 'Lời mời kết bạn';
    if (isLoadingRequests) {
      content = renderSkeleton();
    } else {
      content = requests.map((req: FriendRequest) => (
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
      ));
      isEmpty = requests.length === 0;
    }
  } else if (category === 'suggestions') {
    title = 'Gợi ý';
    if (isLoadingSuggestions) {
      content = renderSkeleton();
    } else {
      content = suggestions.map((user: FriendUser) => (
        <FriendCard
          key={user._id}
          userId={user._id}
          username={user.username}
          displayName={user.displayName}
          avatar={user.avatar}
          bio={user.bio}
          type="suggestion"
          onAction={() => sendRequest(user._id)}
        />
      ));
      isEmpty = suggestions.length === 0;
    }
  } else if (category === 'all') {
    title = 'Tất cả bạn bè';
    if (isLoadingFriends) {
      content = renderSkeleton();
    } else {
      content = friends.map((friend: FriendUser) => (
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
      ));
      isEmpty = friends.length === 0;
    }
  }

  function renderSkeleton() {
    return Array.from({ length: 10 }).map((_, i) => (
      <Skeleton key={i} className="aspect-3/4 w-full rounded-xl" />
    ));
  }

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>

      {isEmpty ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-lg text-gray-500 dark:text-zinc-500">
            {category === 'requests' ? 'Không có lời mời kết bạn nào.' : 
             category === 'all' ? 'Đạo hữu chưa có người bạn nào!' : 
             'Hết gợi ý bạn bè rồi.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
           {content}
        </div>
      )}
    </div>
  );
}
