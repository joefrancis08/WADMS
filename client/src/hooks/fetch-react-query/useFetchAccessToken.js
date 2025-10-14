import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchAccessToken } from "../../api-calls/Users/userAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchAccessToken = () => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['access-token'], []);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchAccessToken({ signal });

      return res.data.tokens;

    } catch (error) {
      console.error('Error access token:', error);
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
      accessTokens: data || [],
      loadingAccessTokens: isLoading,
      errorAccessTokens: isError ? error?.message || 'Unknown error' : null,
      refetchAccessTokens: refetch
    };
};

export default useFetchAccessToken;
