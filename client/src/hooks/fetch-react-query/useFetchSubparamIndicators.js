import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchSubparamIndicators } from "../../api/accreditation/accreditationAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchSubparamIndicators = ({
  title,
  year,
  accredBody,
  level,
  program,
  area,
  parameter,
  subParameter
}) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => [
    'indicators',
    title,
    year,
    accredBody,
    level,
    program,
    area,
    parameter,
    subParameter
  ], [title, year, accredBody, level, program, area, parameter, subParameter]);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchSubparamIndicators({
        title,
        year,
        accredBody,
        level,
        program,
        area,
        parameter,
        subParameter
      }, signal );

      return res.data;

    } catch (error) {
      console.error('Error fetching indicators:', error);
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
    indicators: data || [],
    loading: isLoading,
    error: isError ? error?.message || 'Unknown error' : null,
    refetch
  };
};

export default useFetchSubparamIndicators;