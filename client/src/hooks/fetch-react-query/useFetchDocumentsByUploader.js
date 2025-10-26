import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { fetchDocumentsByUploaderId } from "../../api-calls/accreditation/accreditationAPI";
import { messageHandler } from "../../services/websocket/messageHandler";

const useFetchDocumentsByUploader = (uploaderId) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['documents-by-uploader', uploaderId], [uploaderId]);

  const queryFn = async ({ signal }) => {
    try {
      const res = await fetchDocumentsByUploaderId(uploaderId, signal);

      return res.data;

    } catch (error) {
      console.error('Error fetching documents by uploader:', error);
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
    uploaderDocuments: data || [],
    loadingUploaderDocuments: isLoading,
    errorUploaderDocuments: isError ? error?.message || 'Unknown error' : null,
    refetchUploaderDocuments: refetch
  };
};

export default useFetchDocumentsByUploader;