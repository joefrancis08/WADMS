import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchUserAssignments } from "../../api-calls/Users/userAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchAssignments = (IDs = {}) => {
  const { 
    userId = null,
    accredInfoId = null,
    levelId = null,
    programId = null,
    areaId = null,
    parameterId = null,
    subParameterId = null,
    indicatorId = null
  } = IDs;

  const queryClient = useQueryClient();

  const queryKey = useMemo(() => [
    'assignments', 
    userId,
    accredInfoId,
    levelId,
    programId,
    areaId,
    parameterId,
    subParameterId,
    indicatorId
  ], [userId, accredInfoId, levelId, programId, areaId, parameterId, subParameterId, indicatorId]);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchUserAssignments(userId, signal);

      return res.data;

    } catch (error) {
      console.error('Error fetching assignments:', error);
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

export default useFetchAssignments;