import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchSubParamByParamId } from "../../api-calls/accreditation/accreditationAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchSubparamByParamId = (paramId) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['subparam-by-param-id', paramId], [paramId]);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchSubParamByParamId(paramId, signal);

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
    subParamsByParamId: data || [],
    loadingSubParam: isLoading,
    errorSubParam: isError ? error?.message || 'Unknown error' : null,
    refetchSubParam: refetch
  };
};

export default useFetchSubparamByParamId;