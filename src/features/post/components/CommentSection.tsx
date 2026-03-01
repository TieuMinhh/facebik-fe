import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import postService from '@/features/post/services/postService';

interface Comment {
  _id: string;
  author: {
    _id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes?: { userId: string, reactionType: string }[];
  replies?: Comment[];
}

const COMMENT_REACTIONS = [
  { type: 'like', label: 'Thích', icon: '👍', color: 'text-blue-600' },
  { type: 'love', label: 'Yêu thích', icon: '❤️', color: 'text-red-500' },
  { type: 'haha', label: 'Haha', icon: '😆', color: 'text-yellow-500' },
  { type: 'wow', label: 'Wow', icon: '😮', color: 'text-yellow-500' },
  { type: 'sad', label: 'Buồn', icon: '😢', color: 'text-yellow-600' },
  { type: 'angry', label: 'Phẫn nộ', icon: '😡', color: 'text-orange-500' }
];

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await postService.getComments(postId);
      return res.data as Comment[];
    },
  });

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: () => postService.addComment(postId, content, replyTo?.id),
    onSuccess: () => {
      setContent('');
      setReplyTo(null);
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] }); // Update comment count
    },
  });

  const { mutate: toggleLikeComment } = useMutation({
    mutationFn: ({ commentId, reactionType }: { commentId: string; reactionType: string }) => 
      postService.toggleLikeComment(commentId, reactionType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPending) return;
    addComment();
  };

  const handleReply = (commentId: string, username: string) => {
    setReplyTo({ id: commentId, username });
    setContent(`@${username} `);
  };

  return (
    <div className="w-full border-t border-gray-100 dark:border-zinc-800 p-4 pt-3 flex flex-col gap-4">
      {/* Comments List */}
      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <div className="text-center text-sm text-gray-500 py-2 animate-pulse">Đang tải bình luận...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-2">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
        ) : (
          comments.map((comment, i) => {
            const userLike = user && comment.likes?.find((l) => l.userId === user._id);
            const userReaction = userLike ? COMMENT_REACTIONS.find(r => r.type === userLike.reactionType) : null;
            return (
              <div key={comment._id || `comment-${i}`} className="flex gap-2 relative">
                <Avatar className="h-8 w-8 border border-gray-100 dark:border-zinc-800 shrink-0 z-10">
                  <AvatarImage src={comment.author?.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-bold uppercase text-xs">
                    {comment.author?.displayName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl px-3 py-2 w-fit relative z-10">
                    <h4 className="text-xs font-semibold dark:text-zinc-100">{comment.author?.displayName}</h4>
                    <p className="text-sm dark:text-zinc-200">{comment.content}</p>
                    {(comment.likes?.length || 0) > 0 && (
                      <div className="flex items-center ml-2 text-gray-500 bg-white dark:bg-zinc-900 rounded-full px-1 py-[2px] shadow-sm border border-gray-100 dark:border-zinc-800 absolute right-0 translate-x-3 bottom-0 translate-y-2 z-20">
                        <div className="flex -space-x-1 items-center">
                           {[...new Set(comment.likes?.map(l => l.reactionType))].slice(0, 3).map(rType => (
                             <span key={rType} className="text-[10px] w-4 h-4 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-sm z-10">{COMMENT_REACTIONS.find(r => r.type === rType)?.icon || '👍'}</span>
                           ))}
                        </div>
                        <span className="text-[10px] pl-[2px] pr-1 leading-none text-gray-500">{comment.likes?.length}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 px-2 mt-1 text-[11px] text-gray-500 font-medium items-center relative">
                    <div className="relative group/react pb-1 -mb-1 hover:z-50">
                      <span 
                        className={`cursor-pointer hover:underline ${userReaction ? userReaction.color + ' font-bold' : ''}`}
                        onClick={() => toggleLikeComment({ commentId: comment._id, reactionType: userReaction ? userReaction.type : 'like' })}
                      >
                        {userReaction ? userReaction.label : 'Thích'}
                      </span>
                      <div className="absolute bottom-full left-0 pb-1 hidden group-hover/react:block z-50">
                        <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-gray-100 dark:border-zinc-700 p-1 px-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                          {COMMENT_REACTIONS.map((re, i) => (
                            <button
                              key={re.type}
                              onClick={() => toggleLikeComment({ commentId: comment._id, reactionType: re.type })}
                              className="hover:scale-125 transition-transform duration-200 transform origin-bottom hover:-translate-y-1 p-0.5"
                              style={{ animationDelay: `${i * 50}ms` }}
                              title={re.label}
                            >
                              <span className="text-xl drop-shadow-sm">{re.icon}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span 
                      className="cursor-pointer hover:underline"
                      onClick={() => handleReply(comment._id, comment.author?.displayName)}
                    >
                      Phản hồi
                    </span>
                    <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}</span>
                  </div>
                  
                  {/* Render Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="flex flex-col mt-1 relative">
                      {/* Connection Line */}
                      {expandedReplies[comment._id] && <div className="absolute top-[-8px] left-[-22px] bottom-6 w-4 border-l-2 border-b-2 border-gray-200 dark:border-zinc-800 rounded-bl-xl origin-top" />}
                      
                      {!expandedReplies[comment._id] ? (
                        <div 
                          className="flex items-center gap-2 text-[11px] font-semibold text-gray-500 hover:underline cursor-pointer ml-3 mt-1"
                          onClick={() => toggleReplies(comment._id)}
                        >
                          <svg className="w-4 h-4 ml-[-18px] text-gray-400 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                          <span>{comment.author?.displayName} đã trả lời · {comment.replies.length} phản hồi</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3 mt-1">
                          {/* Close button at the top */}
                          <div 
                            className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:underline cursor-pointer ml-3 mb-1"
                            onClick={() => toggleReplies(comment._id)}
                          >
                            <span>Ẩn phản hồi</span>
                          </div>
                      
                      {comment.replies.map((reply, j) => {
                        const userReplyLike = user && reply.likes?.find((l) => l.userId === user._id);
                        const replyReaction = userReplyLike ? COMMENT_REACTIONS.find(r => r.type === userReplyLike.reactionType) : null;
                        return (
                          <div key={reply._id || `reply-${j}`} className="flex gap-2 relative">
                            <Avatar className="h-6 w-6 border border-gray-100 dark:border-zinc-800 shrink-0 z-10">
                              <AvatarImage src={reply.author?.avatar} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold uppercase text-[10px]">
                                {reply.author?.displayName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col flex-1 min-w-0">
                              <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl px-3 py-2 w-fit relative z-10">
                                <h4 className="text-[11px] font-semibold dark:text-zinc-100">{reply.author?.displayName}</h4>
                                <p className="text-xs dark:text-zinc-200">{reply.content}</p>
                                {(reply.likes?.length || 0) > 0 && (
                                  <div className="flex items-center ml-2 text-gray-500 bg-white dark:bg-zinc-900 rounded-full px-1 py-[2px] shadow-sm border border-gray-100 dark:border-zinc-800 absolute right-0 translate-x-3 bottom-0 translate-y-2 z-20">
                                    <div className="flex -space-x-1 items-center">
                                       {[...new Set(reply.likes?.map(l => l.reactionType))].slice(0, 3).map(rType => (
                                         <span key={rType} className="text-[9px] w-3 h-3 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-sm z-10">{COMMENT_REACTIONS.find(r => r.type === rType)?.icon || '👍'}</span>
                                       ))}
                                    </div>
                                    <span className="text-[9px] pl-[2px] pr-1 leading-none text-gray-500">{reply.likes?.length}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-3 px-2 mt-1 text-[10px] text-gray-500 font-medium items-center relative">
                                <div className="relative group/react pb-1 -mb-1 hover:z-50">
                                  <span 
                                    className={`cursor-pointer hover:underline ${replyReaction ? replyReaction.color + ' font-bold' : ''}`}
                                    onClick={() => toggleLikeComment({ commentId: reply._id, reactionType: replyReaction ? replyReaction.type : 'like' })}
                                  >
                                    {replyReaction ? replyReaction.label : 'Thích'}
                                  </span>
                                  <div className="absolute bottom-full left-0 pb-1 hidden group-hover/react:block z-50">
                                    <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-gray-100 dark:border-zinc-700 p-1 px-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                      {COMMENT_REACTIONS.map((re, i) => (
                                        <button
                                          key={re.type}
                                          onClick={() => toggleLikeComment({ commentId: reply._id, reactionType: re.type })}
                                          className="hover:scale-125 transition-transform duration-200 transform origin-bottom hover:-translate-y-1 p-0.5"
                                          style={{ animationDelay: `${i * 50}ms` }}
                                          title={re.label}
                                        >
                                          <span className="text-xl drop-shadow-sm">{re.icon}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <span 
                                  className="cursor-pointer hover:underline"
                                  onClick={() => handleReply(comment._id, reply.author?.displayName)}
                                >
                                  Phản hồi
                                </span>
                                <span>{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: vi })}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Comment Input */}
      <div className="flex flex-col gap-1 mt-1">
         {replyTo && (
           <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 dark:bg-zinc-900 px-3 py-1 rounded-t-lg mx-8 border border-b-0 border-gray-100 dark:border-zinc-800">
             <span>Đang trả lời <strong>{replyTo.username}</strong></span>
             <button onClick={() => { setReplyTo(null); setContent(''); }} className="hover:underline text-red-500">Hủy</button>
           </div>
         )}
         <div className="flex items-center gap-2">
           <Avatar className="h-8 w-8 shrink-0">
             <AvatarImage src={user?.avatar} />
             <AvatarFallback className="bg-blue-100 text-blue-600 font-bold uppercase text-xs">
               {user?.displayName?.charAt(0) || 'U'}
             </AvatarFallback>
           </Avatar>
           <form onSubmit={handleSubmit} className="flex-1 flex relative">
             <Input 
               placeholder={replyTo ? "Viết phản hồi..." : "Viết bình luận..."} 
               className={`rounded-full bg-gray-100 dark:bg-zinc-800 border-none pr-10 focus-visible:ring-1 ${replyTo ? 'rounded-tl-none' : ''}`}
               value={content}
               onChange={(e) => setContent(e.target.value)}
               autoFocus={!!replyTo}
             />
             <Button 
               type="submit" 
               size="icon" 
               variant="ghost" 
               className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-transparent disabled:opacity-50"
               disabled={!content.trim() || isPending}
             >
               <SendHorizontal className="h-4 w-4" />
             </Button>
           </form>
         </div>
      </div>
    </div>
  );
}
