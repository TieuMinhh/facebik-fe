'use client';

import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToggleLike } from '../services/usePosts';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import CommentSection from './CommentSection';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog";
import PostDetailView from './PostDetailView';
// Not using Radix VisuallyHidden to avoid extra dependency, using Tailwind sr-only instead.

export const REACTIONS = [
  { type: 'like', icon: '👍', label: 'Thích', color: 'text-blue-600' },
  { type: 'love', icon: '❤️', label: 'Yêu thích', color: 'text-red-500' },
  { type: 'haha', icon: '😆', label: 'Haha', color: 'text-yellow-500' },
  { type: 'wow', icon: '😮', label: 'Wow', color: 'text-yellow-500' },
  { type: 'sad', icon: '😢', label: 'Buồn', color: 'text-yellow-500' },
  { type: 'angry', icon: '😠', label: 'Phẫn nộ', color: 'text-orange-500' }
];

export const getReactionConfig = (type: string) => {
  return REACTIONS.find(r => r.type === type) || REACTIONS[0];
};

interface PostCardProps {
  post: {
    _id: string;
    author: {
      _id: string;
      username: string;
      displayName: string;
      avatar?: string;
    };
    content: string;
    images?: string[];
    likes: {
      userId: {
        _id: string;
        username: string;
        displayName: string;
        avatar?: string;
      };
      reactionType: string;
      createdAt: string;
    }[];
    commentsCount: number;
    createdAt: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { mutate: toggleLike } = useToggleLike();
  
  const [showComments, setShowComments] = useState(false);
  
  const userReaction = user 
    ? post.likes.find(like => like.userId?._id === user._id || like.userId?.toString() === user._id) 
    : undefined;

  const isLiked = !!userReaction;
  const currentReactionConfig = isLiked ? getReactionConfig(userReaction.reactionType) : REACTIONS[0];

  const handleLike = (reactionType: string = 'like') => {
    toggleLike({ postId: post._id, reactionType });
  };

  return (
    <Card className="w-full shadow-sm rounded-xl border-gray-200 dark:border-zinc-800 overflow-hidden">
      <CardHeader className="p-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar 
              onClick={() => router.push(`/profile/${post.author?._id}`)}
              className="h-10 w-10 border border-gray-100 dark:border-zinc-800 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <AvatarImage src={post.author?.avatar} alt={post.author?.displayName} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold uppercase transition-colors">
                {post.author?.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h4 
                onClick={() => router.push(`/profile/${post.author?._id}`)}
                className="text-sm font-semibold hover:underline cursor-pointer transition-all dark:text-zinc-100"
              >
                {post.author?.displayName}
              </h4>
              <p className="text-xs text-gray-500 dark:text-zinc-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-500">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-3 pt-0">
        <p className="text-sm dark:text-zinc-200 whitespace-pre-wrap">{post.content}</p>
        
        {post.images && post.images.length > 0 && (
          <Dialog>
            <DialogTrigger nativeButton={false} render={
              <div className="relative mt-3 -mx-4 h-[400px] cursor-pointer group/img">
                 <Image 
                   src={post.images[0]} 
                   alt="Post content" 
                   fill
                   className="object-cover transition-all group-hover:brightness-90" 
                 />
              </div>
            } />
            <DialogContent 
              showCloseButton={false}
              className="fixed inset-0 z-50 transform-none translate-x-0 translate-y-0 max-w-none w-screen h-screen p-0 border-none bg-black rounded-none transition-none overflow-hidden sm:max-w-none"
            >
              <div className="sr-only">
                <DialogTitle>Chi tiết bài viết</DialogTitle>
              </div>
              <PostDetailView post={post} />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col p-0 pb-2">
        <div className="flex items-center justify-between w-full px-4 text-xs text-gray-500 dark:text-zinc-500 py-2 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-1">
             <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
               <ThumbsUp className="h-2.5 w-2.5 fill-white" />
             </div>
             <span>{post.likes.length} lượt thích</span>
          </div>
          <div className="flex items-center gap-3">
             <span 
               className="cursor-pointer hover:underline"
               onClick={() => setShowComments(!showComments)}
             >
               {post.commentsCount} bình luận
             </span>
             <span>0 lượt chia sẻ</span>
          </div>
        </div>
        
        <div className="flex items-center w-full px-2 py-1">
          <div 
            className="flex-1 relative group"
            onMouseEnter={() => {}}
          >
            {/* Reactions Popover */}
            <div className="absolute bottom-full left-0 pb-2 hidden group-hover:block z-50">
              <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-gray-100 dark:border-zinc-700 p-1 px-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {REACTIONS.map((reaction, i) => (
                  <button
                    key={reaction.type}
                    onClick={() => handleLike(reaction.type)}
                    className="hover:scale-125 transition-transform duration-200 transform origin-bottom p-1"
                    style={{ animationDelay: `${i * 50}ms` }}
                    title={reaction.label}
                  >
                    <span className="text-3xl drop-shadow-sm">{reaction.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              variant="ghost" 
              onClick={() => handleLike(isLiked ? 'like' : 'like')}
              className={cn(
                "w-full flex gap-2 transition-colors py-5 font-semibold",
                isLiked ? currentReactionConfig.color : "text-gray-500/80 hover:bg-gray-100 dark:hover:bg-zinc-800"
              )}
            >
              {isLiked && currentReactionConfig.type !== 'like' ? (
                <span className="text-xl">{currentReactionConfig.icon}</span>
              ) : (
                <ThumbsUp className={cn("h-5 w-5", isLiked && "fill-blue-600 outline-blue-600")} /> 
              )}
              {isLiked ? currentReactionConfig.label : 'Thích'}
            </Button>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex gap-2 text-gray-500/80 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors py-5 font-semibold text-sm"
          >
            <MessageSquare className="h-5 w-5" /> Bình luận
          </Button>
          <Button variant="ghost" className="flex-1 flex gap-2 text-gray-500/80 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors py-5 font-semibold text-sm">
            <Share2 className="h-5 w-5" /> Chia sẻ
          </Button>
        </div>
        
        {/* Comment Section Toggle */}
        {showComments && <CommentSection postId={post._id} />}
      </CardFooter>
    </Card>
  );
}
