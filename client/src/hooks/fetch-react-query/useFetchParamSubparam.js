import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchParamSubparams } from "../../api/accreditation/accreditationAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchParamSubparam = ({ title, year, accredBody, level, program, area, parameter }) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => [
    'sub-parameters', 
    title, 
    year, 
    accredBody, 
    level, 
    program, 
    area, 
    parameter
  ], [title, year, accredBody, level, program, area, parameter]);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchParamSubparams({
        title,
        year,
        accredBody,
        level,
        program,
        area,
        parameter
      }, signal);

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
    }
  }, [queryClient, queryKey]);

  return {
    subParameters: data || [],
    loading: isLoading,
    error: isError ? error?.message || 'Unknown error' : null,
    refetch
  };
};

export default useFetchParamSubparam;