'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface FriendCardProps {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  type: 'request' | 'suggestion' | 'friend';
  onAction?: () => void;
  onSecondaryAction?: () => void;
  isLoading?: boolean;
  mutualFriendsCount?: number;
  friendStatus?: 'none' | 'pending' | 'friends' | 'received';
  requestId?: string;
}

export default function FriendCard({
  userId,
  displayName,
  avatar,
  bio,
  type,
  onAction,
  onSecondaryAction,
  isLoading,
  mutualFriendsCount,
  friendStatus,
  requestId
}: FriendCardProps) {
  return (
    <Card className="overflow-hidden border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/profile/${userId}`}>
        <div className="relative aspect-square w-full bg-gray-100 dark:bg-zinc-800">
          <Avatar className="h-full w-full rounded-none">
            <AvatarImage src={avatar} className="object-cover" />
            <AvatarFallback className="text-4xl text-blue-600 font-bold uppercase">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </Link>
      
      <CardContent className="p-3">
        <Link href={`/profile/${userId}`} className="block transition-hover hover:underline">
          <h3 className="truncate text-base font-bold text-gray-900 dark:text-white">
            {displayName}
          </h3>
        </Link>
        {mutualFriendsCount !== undefined && mutualFriendsCount > 0 && (
          <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
            {mutualFriendsCount} bạn chung
          </p>
        )}
        {bio && (
          <p className="mt-1 line-clamp-1 text-sm text-gray-500 dark:text-zinc-400">
            {bio}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 p-3 pt-0">
        {type === 'request' && (
          <>
            <Button 
                onClick={onAction} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isLoading}
            >
              Xác nhận
            </Button>
            <Button 
                onClick={onSecondaryAction} 
                variant="secondary" 
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold"
                disabled={isLoading}
            >
              Xóa
            </Button>
          </>
        )}

        {type === 'suggestion' && (
          <>
            {friendStatus === 'pending' ? (
              <Button 
                onClick={onAction} 
                variant="secondary"
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold text-blue-600 dark:text-blue-400"
                disabled={isLoading}
              >
                Đã gửi lời mời
              </Button>
            ) : (
              <Button 
                onClick={onAction} 
                className="w-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 font-semibold"
                disabled={isLoading}
              >
                Thêm bạn bè
              </Button>
            )}
            
            {friendStatus !== 'pending' && (
              <Button 
                onClick={onSecondaryAction} 
                variant="secondary" 
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold"
                disabled={isLoading}
              >
                Gỡ
              </Button>
            )}
          </>
        )}

        {type === 'friend' && (
          <Button 
              onClick={onAction} 
              variant="secondary" 
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold"
              disabled={isLoading}
          >
            Hủy kết bạn
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
