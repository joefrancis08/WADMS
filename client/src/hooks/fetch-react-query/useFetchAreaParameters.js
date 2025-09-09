import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAreaParameters } from "../../api/accreditation/accreditationAPI";
import { useEffect, useMemo } from "react";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchAreaParameters = (startDate, endDate, levelName, programName, areaName) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => ['parameters', startDate, endDate, levelName, programName, areaName],
    [startDate, endDate, levelName, programName, areaName]
  );
  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchAreaParameters({
        startDate,
        endDate,
        levelName,
        programName, 
        areaName
      }, signal);

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
    })

    return () => {
      cleanup();
    }
  }, [queryClient, queryKey]);

  return {
    parameters: data || [],
    loading: isLoading,
    error: isError ? error?.message || 'Unknown error' : null,
    refetch
  };
};

export default useFetchAreaParameters;