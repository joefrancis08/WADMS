import { useMemo } from "react";
import { fetchUserStatus } from "../../api-calls/Users/userAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchUserStatus = (email) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['user-status', email], [email]);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchUserStatus(email, signal);

      return res.data;

    } catch (error) {
      console.error('Error fetching user status:', error);
      throw error;
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn,
    staleTime: 0,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    const { cleanup } = messageHandler(() => {
      queryClient.refetchQueries({ queryKey, exact: true });
    });

    return () => {
      cleanup();
    };
  }, [queryClient, queryKey]);

  return {
    userData: data || [],
    loadingUserData: isLoading,
    errorUserData: isError ? error?.message || 'Unknown error' : null,
    refetchUserData: refetch
  };
};

export default useFetchUserStatus;