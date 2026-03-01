import axiosInstance from '@/lib/axios';

export const friendsService = {
  getFriends: async (userId?: string) => {
    const url = userId ? `/friends?userId=${userId}` : '/friends';
    const response = await axiosInstance.get(url);
    return response.data;
  },

  getRequests: async () => {
    const response = await axiosInstance.get('/friends/requests');
    return response.data;
  },

  getSuggestions: async () => {
    const response = await axiosInstance.get('/friends/suggestions');
    return response.data;
  },

  sendRequest: async (userId: string) => {
    const response = await axiosInstance.post(`/friends/request/${userId}`);
    return response.data;
  },

  acceptRequest: async (requestId: string) => {
    const response = await axiosInstance.post(`/friends/accept/${requestId}`);
    return response.data;
  },

  declineRequest: async (requestId: string) => {
    const response = await axiosInstance.delete(`/friends/decline/${requestId}`);
    return response.data;
  },

  cancelRequest: async (requestId: string) => {
    const response = await axiosInstance.delete(`/friends/request/${requestId}`);
    return response.data;
  },

  unfriend: async (friendId: string) => {
    const response = await axiosInstance.delete(`/friends/unfriend/${friendId}`);
    return response.data;
  },
};
