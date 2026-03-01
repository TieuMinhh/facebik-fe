'use client';

import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, X, Plus, Minus, Maximize2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';
import { useToggleLike } from '../services/usePosts';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { REACTIONS, getReactionConfig } from './PostCard';
import CommentSection from './CommentSection';
import { DialogClose } from '@/components/ui/dialog';

interface PostDetailViewProps {
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

export default function PostDetailView({ post }: PostDetailViewProps) {
  const { user } = useAuthStore();
  const { mutate: toggleLike } = useToggleLike();

  const userReaction = user 
    ? post.likes.find(like => like.userId?._id === user._id || like.userId?.toString() === user._id) 
    : undefined;

  const isLiked = !!userReaction;
  const currentReactionConfig = isLiked ? getReactionConfig(userReaction.reactionType) : REACTIONS[0];

  const handleLike = (reactionType: string = 'like') => {
    toggleLike({ postId: post._id, reactionType });
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-black dark:bg-black font-sans">
      {/* Left Column: Image Area */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden border-r border-gray-800/50 transition-all">
        {/* Top bar controls */}
        <div className="absolute top-0 flex w-full items-center justify-between p-3 z-10 bg-linear-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-3">
             <DialogClose render={
                <Button variant="ghost" size="icon" className="h-10 w-10 cursor-pointer rounded-full bg-zinc-800/60 text-white hover:bg-zinc-700/80 transition-colors">
                   <X className="h-6 w-6" />
                </Button>
             } />
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 shadow-xl ring-2 ring-blue-500/20">
                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white text-blue-600 shrink-0">
                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-zinc-800/30 text-gray-200 hover:bg-zinc-700/60 transition-all">
               <Plus className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-zinc-800/30 text-gray-200 hover:bg-zinc-700/60 transition-all">
               <Minus className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-zinc-800/30 text-gray-200 hover:bg-zinc-700/60 transition-all">
               <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Image */}
        {post.images && (
           <div className="relative flex h-full w-full items-center justify-center p-4 md:p-8 lg:p-12 select-none">
              <Image 
                src={post.images[0]} 
                alt="Post content" 
                width={1600}
                height={1200}
                className="max-h-full max-w-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-300"
                priority
              />
           </div>
        )}
      </div>

      {/* Right Column: Post Info & Comments */}
      <div className="flex w-[360px] lg:w-[400px] flex-col bg-white dark:bg-zinc-950 shrink-0 shadow-2xl animate-in slide-in-from-right duration-500 ease-out z-20">
         {/* Sidebar Header */}
         <div className="flex items-center justify-between p-4 border-b dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
               <Avatar className="h-10 w-10 ring-1 ring-gray-100 dark:ring-zinc-800">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                    {post.author?.displayName?.charAt(0)}
                  </AvatarFallback>
               </Avatar>
               <div className="flex flex-col">
                  <h4 className="text-[15px] font-bold dark:text-zinc-100 hover:underline cursor-pointer tracking-tight">{post.author?.displayName}</h4>
                  <p className="text-[12px] text-gray-500 dark:text-zinc-500 font-medium opacity-80">
                     {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                  </p>
               </div>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800">
               <MoreHorizontal className="h-5 w-5" />
            </Button>
         </div>

         {/* Content & Comments - Scrollable section */}
         <div className="flex-1 overflow-y-auto scrollbar-hide hover:scrollbar-default transition-all">
            <div className="px-4 py-4">
               <p className="text-[15px] dark:text-zinc-200 whitespace-pre-wrap leading-relaxed tracking-normal">{post.content}</p>
            </div>

            {/* Interaction Stats */}
            <div className="mx-4 py-3 flex items-center justify-between text-[13px] text-gray-500 dark:text-zinc-400 border-b dark:border-zinc-800/60">
               <div className="flex items-center gap-1.5 group cursor-pointer">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white shadow-md transition-transform group-hover:scale-110">
                    <ThumbsUp className="h-2.5 w-2.5 fill-white" />
                  </div>
                  <span className="font-semibold hover:underline">{post.likes.length}</span>
               </div>
               <div className="flex items-center gap-4 font-semibold">
                  <span className="hover:underline cursor-pointer">{post.commentsCount} bình luận</span>
                  <span className="hover:underline cursor-pointer">0 lượt chia sẻ</span>
               </div>
            </div>

            {/* In-sidebar Action Buttons */}
            <div className="flex items-center px-2 py-1 mx-2 my-1 border-b dark:border-zinc-800/60">
               <div className="flex-1 relative group">
                  <div className="absolute bottom-full left-0 pb-3 hidden group-hover:block z-50">
                    <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-zinc-700 p-1.5 px-2.5 animate-in fade-in zoom-in duration-200">
                       {REACTIONS.map((reac) => (
                         <button key={reac.type} onClick={() => handleLike(reac.type)} className="hover:scale-135 transition-transform duration-200 p-1 cursor-pointer">
                           <span className="text-2xl drop-shadow-sm">{reac.icon}</span>
                         </button>
                       ))}
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => handleLike('like')} className={cn("w-full gap-2 font-bold transition-all h-10", isLiked ? currentReactionConfig.color : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800")}>
                     {isLiked ? <span className="text-xl">{currentReactionConfig.icon}</span> : <ThumbsUp className="h-5 w-5" />}
                     {isLiked ? currentReactionConfig.label : 'Thích'}
                  </Button>
               </div>
               <Button variant="ghost" className="flex-1 gap-2 font-bold text-gray-500 transition-all h-10 hover:bg-gray-100 dark:hover:bg-zinc-800">
                  <MessageSquare className="h-5 w-5" /> Bình luận
               </Button>
               <Button variant="ghost" className="flex-1 gap-2 font-bold text-gray-500 transition-all h-10 hover:bg-gray-100 dark:hover:bg-zinc-800">
                  <Share2 className="h-5 w-5" /> Chia sẻ
               </Button>
            </div>

            {/* Full Comment Section in Sidebar */}
            <div className="py-2 animate-in fade-in duration-700">
               <CommentSection postId={post._id} />
            </div>
         </div>
      </div>
    </div>
  );
}
