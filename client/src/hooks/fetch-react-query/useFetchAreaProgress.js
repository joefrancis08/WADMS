import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchAreaProgress } from "../../api-calls/accreditation/accreditationAPI";
import { useEffect } from "react";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchAreaProgress = (programId) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['area-progress'], []);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchAreaProgress(programId, signal);

      return res.data;

    } catch (error) {
      console.error('Error fetching area progress:', error);
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
    }
  }, [queryClient, queryKey]);

  return {
    areaProgressData: data || [],
    loadingAreaProgress: isLoading,
    errorAreaProgress: isError ? error?.message || 'Unknown error' : null,
    refetchAreaProgress: refetch
  };
};

export default useFetchAreaProgress;