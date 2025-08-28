import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProgramsToBeAccredited } from "../../api/accreditation/accreditationAPI";
import { messageHandler } from '../../services/websocket/messageHandler';
import { useEffect, useMemo } from 'react';

export const useFetchProgramsToBeAccredited = () => {
  // Get access to the React Query client instance
  const queryClient = useQueryClient();

  // Define a stable query key for caching and invalidation
  // useMemo ensures the array reference doesn't change across renders
  const queryKey = useMemo(() => ['programs-to-be-accredited'], []);

  // Define the query function that React Query will call
  // It receives an AbortSignal (`signal`) for cancellation support
  const queryFn = async ({ signal }) => {
    try {
      // Call your API function to fetch data
      // Pass the `signal` so requests can be aborted if needed
      const res = await fetchProgramsToBeAccredited({ signal });

      // Return the result so React Query can cache and provide it
      return res.data;

    } catch (error) {
      // Handle and log any errors from the request
      console.error('Error fetching programs to be accredited: ', error);

      // Throw the error so React Query knows the query failed
      throw error;
    }
  };

  /* 
    Destructure the result of useQuery from React Query
    - data: the fetched data from the query function
    - isLoading: true while the query is loading
    - isError: true if the query failed
    - error: the error object if the query failed
    - refetch: function to manually re-fetch the query 
  */
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,                            // Unique key for caching and invalidation
    queryFn,                             // Function to fetch the data
    staleTime: 0,                        // Data is immediately stale; triggers refetch on mount
    refetchOnWindowFocus: true,          // Refetch the query automatically when the window gains focus
  });

  // WebSocket effect to auto-refetch on updates
  useEffect(() => {
    // Call messageHandler to listen for WebSocket messages
    // Pass a callback that refetches this query when relevant data changes
    const { cleanup } = messageHandler(() => {
      // Refetch only the exact query key to avoid triggering other queries
      queryClient.refetchQueries({ queryKey, exact: true });
    });

    return () => {
      // Cleanup function: removes event listeners and closes WebSocket
      console.log('Cleaning up WebSocket connection.');
      cleanup();
    };
  }, [queryClient, queryKey]); // Dependencies: queryClient and queryKey must be stable
  
  return {
    programsToBeAccredited: data || [], // Provide empty array as default to avoid undefined
    loading: isLoading,                 // True while fetching data
    error: isError ? error?.message || 'Unknown error' : null, // User-friendly error
    refetch,  // Allow manual re-fetch if needed
  };
};


