import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProgramProgress } from "../../api-calls/accreditation/accreditationAPI";
import { useEffect } from "react";
import { messageHandler } from "../../services/websocket/messageHandler";
import { useMemo } from "react";

const useFetchProgramProgress = () => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['program-progress'], []);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchProgramProgress(signal);

      return res.data;

    } catch (error) {
      console.error('Error fetching program progress:', error);
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
    programProgressData: data || [],
    loadingProgramProgress: isLoading,
    errorProgramProgress: isError ? error?.message || 'Unknown error' : null,
    refetchProgramProgress: refetch
  };
};

export default useFetchProgramProgress;