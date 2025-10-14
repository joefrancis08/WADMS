import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchAccreditationBodies } from "../../api-calls/accreditation/accreditationAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useAccreditationBodies = () => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['accreditation-body'], []);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchAccreditationBodies(signal);

      return res.data;

    } catch (error) {
      console.error('Error fetching accreditation levels:', error);
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
    accredBodies: data || [],
    loadingAccredBodies: isLoading,
    errorAccredBodies: isError ? error?.message || 'Unknown error' : null,
    refetchAccredBodies: refetch
  };
};

export default useAccreditationBodies;