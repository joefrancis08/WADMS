import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchProgramAreas } from "../../api/accreditation/accreditationAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchProgramAreas = ({ title, year, accredBody, level, program }) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => [
    'areas', title, year, accredBody, level, program
  ], [title, year, accredBody, level, program]);
  
  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchProgramAreas(
        { 
          title, 
          year, 
          accredBody, 
          level, 
          program,
        },
        {
          signal
        }
      );

      return res.data;

    } catch (error) {
      console.error('Error fetching areas:', error);
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
    areas: data || [],
    loading: isLoading,
    error: isError ? error?.message || 'Unknown error': null,
    refetch
  };
};

export default useFetchProgramAreas;

