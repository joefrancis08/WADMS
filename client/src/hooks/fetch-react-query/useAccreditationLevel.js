import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAccreditationLevels } from "../../api-calls/accreditation/accreditationAPI";
import { messageHandler } from '../../services/websocket/messageHandler';
import { useEffect, useMemo } from 'react';

const useAccreditationLevel = () => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['accreditation-level'], []);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchAccreditationLevels({ signal });

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
    levels: data || [],
    loadingAL: isLoading,
    errorAL: isError ? error?.message || 'Unknown error' : null,
    refetch
  };
};

export default useAccreditationLevel;