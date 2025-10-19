import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchParameterProgress } from "../../api-calls/accreditation/accreditationAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchParameterProgress = (areaId) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['parameter-progress'], []);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchParameterProgress(areaId, signal);

      return res.data;

    } catch (error) {
      console.error('Error fetching parameter progress:', error);
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
    paramProgressData: data || [],
    loadingParamProgress: isLoading,
    errorParamProgress: isError ? error?.message || 'Unknown error' : null,
    refetchParamProgress: refetch
  };
};

export default useFetchParameterProgress;