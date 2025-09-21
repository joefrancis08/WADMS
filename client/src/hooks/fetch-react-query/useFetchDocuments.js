import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMemo } from "react";
import { messageHandler } from "../../services/websocket/messageHandler";
import { fetchDocuments } from "../../api/accreditation/accreditationAPI";

const useFetchDocuments = (props = {}) => {
  const {
    title,
    year,
    accredBody, 
    level,
    program,
    area,
    parameter,
    subParameter,
    indicator
  } = props;

  const queryClient = useQueryClient();

  const queryKey = useMemo(() => [
    'documents',
    title,
    year,
    accredBody,
    level,
    program,
    area,
    parameter,
    subParameter,
    indicator
  ], [title, year, accredBody, level, program, area, parameter, subParameter, indicator]);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchDocuments({
        title,
        year,
        accredBody,
        level,
        program,
        area,
        parameter,
        subParameter,
        indicator
      }, signal );

      return res.data;

    } catch (error) {
      console.error('Error fetching documents:', error);
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
    documents: data || [],
    loadingDocs: isLoading,
    errorDocs: isError? error?.message || 'Unknown error' : null,
    refetchDocs: refetch
  };
};

export default useFetchDocuments;