import api from '@/lib/axios';

const userService = {
  getProfile: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (data: FormData) => {
    const response = await api.put('/users/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getUserPosts: async (userId: string, cursor?: string, limit: number = 10) => {
    const response = await api.get(`/posts/user/${userId}`, {
      params: { cursor, limit }
    });
    return response.data;
  },

  getFriends: async () => {
    const response = await api.get('/friends');
    return response.data;
  },

  sendFriendRequest: async (userId: string) => {
    const response = await api.post(`/friends/request/${userId}`);
    return response.data;
  },

  acceptFriendRequest: async (requestId: string) => {
    const response = await api.post(`/friends/accept/${requestId}`);
    return response.data;
  },
  
  searchUsers: async (query: string) => {
    const response = await api.get('/users/search', {
      params: { q: query }
    });
    return response.data;
  },

  cancelFriendRequest: async (requestId: string) => {
    const response = await api.delete(`/friends/request/${requestId}`);
    return response.data;
  },

  unfriend: async (friendId: string) => {
    const response = await api.delete(`/friends/unfriend/${friendId}`);
    return response.data;
  },

  unfollow: async (userId: string) => {
    const response = await api.post(`/users/${userId}/unfollow`);
    return response.data;
  },

  follow: async (userId: string) => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  }
};

export default userService;
