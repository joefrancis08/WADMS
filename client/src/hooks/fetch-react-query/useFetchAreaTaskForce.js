import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchAreaTaskForce } from "../../api-calls/accreditation/accreditationAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchAreaTaskForce = ({ accredInfoId, levelId, programId, areaId }) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['task-force-members', accredInfoId, levelId, programId, areaId], [accredInfoId, levelId, programId, areaId]);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchAreaTaskForce({ accredInfoId, levelId, programId, areaId }, signal);

      return res.data;

    } catch (error) {
      console.error('Error fetching area task force:', error);
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
    areaTaskForceData: data || [],
    loadingATFD: isLoading,
    errorATFD: isError ? error?.message || 'Unknown error' : null,
    refetchATFD: refetch
  };
};

export default useFetchAreaTaskForce;