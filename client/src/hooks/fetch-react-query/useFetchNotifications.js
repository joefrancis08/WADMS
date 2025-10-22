import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchNotifications } from "../../api-calls/notification/notificationAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchNotifications = (userId) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => [
    'notifications', 
    userId,
  ], [userId]);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchNotifications(userId, signal);
      return res.data;

    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  };

  const { data,  isLoading, isError, error, refetch } = useQuery({
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
    notificationsData: data || [],
    notifLoading: isLoading,
    notifError: isError ? error?.message || 'Unknown error' : null,
    notifRefetch: refetch
  };
};

export default useFetchNotifications;