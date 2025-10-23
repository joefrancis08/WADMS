import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchAssignmentsByUserId } from "../../api-calls/accreditation/accreditationAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchAssignmentsByUserId = (userId) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => [
    'assignments-by-user-id',
    userId 
  ], [userId]);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchAssignmentsByUserId(userId, signal);

      return res.data;

    } catch (error) {
      console.error('Error fetching assignments by user id:', error);
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
    assignments: data || [],
    loading: isLoading,
    error: isError ? error?.message || 'Unknown error' : null,
    refetch
  };
};

export default useFetchAssignmentsByUserId;