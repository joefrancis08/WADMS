import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllUsers, fetchUserBy } from '../../api-calls/Users/userAPI';
import { messageHandler } from '../../services/websocket/messageHandler';
import { useEffect, useMemo } from 'react';

export const useUsersBy = (key, value) => {
  const queryClient = useQueryClient();

  // Define a stable query key
  const queryKey = useMemo(() => (key && value ? ['users', key, value] : ['users', 'all']), [key, value]);

  // Query function that always returns an array
  const queryFn = async ({ signal }) => {
    try {
      const res = !key || !value
        ? await fetchAllUsers({ signal })
        : await fetchUserBy(key, value, { signal });

      // Ensure we always return an array
      const users = Array.isArray(res?.data?.data) ? res.data.data : [];
      return users;
    } catch (err) {
      console.error('Error fetching users:', err);
      return []; // Fallback to empty array
    }
  };

  // Use React Query to fetch users
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // WebSocket effect to auto-refetch on updates
  useEffect(() => {
    const { cleanup } = messageHandler(() => {
      queryClient.refetchQueries({ queryKey });
    });

    return () => {
      console.log('Cleaning up WebSocket connection.');
      cleanup();
    };
  }, [key, value, queryClient, queryKey]);
  
  return {
    users: data || [],
    loading: isLoading,
    error: isError ? error?.message || 'Unknown error' : null,
    refetch,
  };
};
