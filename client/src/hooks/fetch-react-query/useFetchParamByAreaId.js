import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchParamByAreaId } from "../../api-calls/accreditation/accreditationAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchParamByAreaId = (areaId) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['param-by-areas', areaId], [areaId]);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchParamByAreaId(areaId, signal);

      return res.data;

    } catch (error) {
      console.error('Error fetching parameters:', error);
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
    paramsByAreaId: data || [],
    loadingParam: isLoading,
    errorParam: isError ? error?.message || 'Unknown error' : null,
    refetchParam: refetch
  };
};

export default useFetchParamByAreaId;