import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchIndicatorBySubparamId } from "../../api-calls/accreditation/accreditationAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchIndicatorBySubparamId = (subParamId) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['indicator-by-subparam', subParamId], [subParamId]);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchIndicatorBySubparamId(subParamId, signal);

      return res.data;

    } catch (error) {
      console.error('Error fetching sub-parameters:', error);
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
    indicatorsBySubparamId: data || [],
    loadingIndicators: isLoading,
    errorIndicators: isError ? error?.message || 'Unknown error' : null,
    refetchIndicators: refetch
  };

};

export default useFetchIndicatorBySubparamId;