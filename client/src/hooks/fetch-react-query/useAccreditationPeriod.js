import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAccreditationPeriod } from '../../api/accreditation/accreditationAPI';
import { messageHandler } from '../../services/websocket/messageHandler';
import { useEffect, useMemo } from 'react';

const useAccreditationPeriod = () => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['accreditation-period'], []);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchAccreditationPeriod({ signal });

      return res.data;

    } catch (error) {
      console.error('Error fetching accreditation period:', error);
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
    period: data || [],
    loadingP: isLoading,
    errorP: isError ? error?.message || 'Unknown error' : null,
  };
};

export default useAccreditationPeriod;