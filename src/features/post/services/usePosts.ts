import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import postService, { CreatePostData } from './postService';

export const usePosts = () => {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => postService.getPosts(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => postService.createPost(data),
    onSuccess: () => {
      // Invalidate posts cache to show the new post
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, reactionType }: { postId: string; reactionType?: string }) => 
      postService.toggleLike(postId, reactionType),
    onSuccess: () => {
      // Optimistic update would be better, but for now just invalidate
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
