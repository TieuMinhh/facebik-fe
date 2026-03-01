import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { friendsService } from '../services/friends-service';

export const useFriends = (userId?: string) => {
  const queryClient = useQueryClient();

  const friendsQuery = useQuery({
    queryKey: ['friends', userId],
    queryFn: () => friendsService.getFriends(userId),
  });

  const requestsQuery = useQuery({
    queryKey: ['friendRequests'],
    queryFn: () => friendsService.getRequests(),
  });

  const suggestionsQuery = useQuery({
    queryKey: ['friendSuggestions'],
    queryFn: () => friendsService.getSuggestions(),
  });

  const sendRequestMutation = useMutation({
    mutationFn: (targetId: string) => friendsService.sendRequest(targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendSuggestions'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: (requestId: string) => friendsService.acceptRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const declineRequestMutation = useMutation({
    mutationFn: (requestId: string) => friendsService.declineRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });

  const unfriendMutation = useMutation({
    mutationFn: (friendId: string) => friendsService.unfriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendSuggestions'] });
    },
  });

  const cancelRequestMutation = useMutation({
    mutationFn: (requestId: string) => friendsService.cancelRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friendSuggestions'] });
    },
  });

  return {
    friends: friendsQuery.data || [],
    isLoadingFriends: friendsQuery.isLoading,
    requests: requestsQuery.data || [],
    isLoadingRequests: requestsQuery.isLoading,
    suggestions: suggestionsQuery.data || [],
    isLoadingSuggestions: suggestionsQuery.isLoading,
    sendRequest: sendRequestMutation.mutate,
    acceptRequest: acceptRequestMutation.mutate,
    declineRequest: declineRequestMutation.mutate,
    unfriend: unfriendMutation.mutate,
    cancelRequest: cancelRequestMutation.mutate,
  };
};
