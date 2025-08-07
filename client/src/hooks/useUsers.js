import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserBy } from "../api/Users/userAPI";
import { messageHandler } from "../services/websocket/messageHandler";
import { useEffect, useMemo } from 'react';

export const useUsersBy = (key, value) => {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['users', key, value], [key, value]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: ({ signal }) => fetchUserBy(key, value, { signal }).then(res => res.data),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const { cleanup } = messageHandler(() => {
      queryClient.refetchQueries({ queryKey });
    });

    return () => {
      console.log('Cleaning up WebSocket Connection.');
      cleanup();
    };
  }, [key, value, queryClient, queryKey]);

  return {
    users: data ?? [],
    loading: isLoading,
    error: isError ? error.message : null,
    refetch,
  };
};
