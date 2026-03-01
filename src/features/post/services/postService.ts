import api from '@/lib/axios';

export interface CreatePostData {
  content: string;
  images?: File[];
}

const postService = {
  getPosts: async (cursor?: string, limit: number = 10) => {
    const response = await api.get('/posts', {
      params: { cursor, limit }
    });
    return response.data;
  },

  createPost: async (data: CreatePostData) => {
    const formData = new FormData();
    formData.append('content', data.content);
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  toggleLike: async (postId: string, reactionType: string = 'like') => {
    const response = await api.post(`/posts/${postId}/like`, { reactionType });
    return response.data;
  },

  getComments: async (postId: string) => {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  },

  addComment: async (postId: string, content: string, parentCommentId?: string) => {
    const response = await api.post(`/comments/post/${postId}`, {
      content,
      parentCommentId
    });
    return response.data;
  },

  toggleLikeComment: async (commentId: string, reactionType?: string) => {
    const response = await api.post(`/comments/${commentId}/like`, { reactionType });
    return response.data;
  }
};

export default postService;
