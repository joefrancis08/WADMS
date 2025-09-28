import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchPrograms } from "../../api-calls/programs/programAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const usePrograms = () => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['programs'], []);
  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchPrograms({ signal });
      return res.data;

    } catch (error) {
      console.error('Error fetching programs:', error);
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
    programsData: data || [],
    loadingPr: isLoading,
    errorPr: isError ? error?.message || 'Unknown error' : null,
    refetch,
  };
};

export default usePrograms;
