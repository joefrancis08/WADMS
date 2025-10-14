// useUsersBy.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllUsers, fetchUserBy } from '../../api-calls/Users/userAPI';
// import { fetchUsersBy } from '../../api-calls/Users/userAPI'; // if you add a multi-filter endpoint
import { messageHandler } from '../../services/websocket/messageHandler';
import { useEffect, useMemo } from 'react';

/** Deterministic stringify for objects/arrays (stable key for React Query) */
const stableStringify = (val) => {
  const sort = (v) => {
    if (Array.isArray(v)) return v.map(sort);
    if (v && typeof v === 'object') {
      return Object.keys(v)
        .sort()
        .reduce((acc, k) => {
          acc[k] = sort(v[k]);
          return acc;
        }, {});
    }
    return v;
  };
  return JSON.stringify(sort(val));
};

/** Normalize any backend shape into an array */
const toArray = (res) => {
  const payload = res?.data ?? res;           // axios vs. fetch/mock
  if (Array.isArray(payload)) return payload; // already an array
  if (Array.isArray(payload?.data)) return payload.data; // { data: [...] }
  if (payload && typeof payload === 'object') return [payload]; // single object
  return []; // null/undefined/other
};

/**
 * Flexible users hook
 * - Accepts either:
 *    - (key, value)  — legacy 2-arg mode
 *    - (filters)     — an object like { role: 'student', active: true } or { role: ['student','staff'] }
 * - Example: useUsersBy({ role: ['student', 'staff'], active: true })
 */
export const useUsersBy = (arg1, arg2) => {
  const queryClient = useQueryClient();

  // Normalize inputs to a single "filters" object
  const filters = useMemo(() => {
    if (typeof arg1 === 'string') {
      const key = arg1;
      const value = arg2;
      if (!key || value == null) return {};
      return { [key]: value };
    }
    return arg1 && typeof arg1 === 'object' ? arg1 : {};
  }, [arg1, arg2]);

  const hasFilters = Object.keys(filters).length > 0;

  // Stable query key
  const queryKey = useMemo(
    () => (hasFilters ? ['users', 'by', stableStringify(filters)] : ['users', 'all']),
    [hasFilters, filters]
  );

  // Query function with multi-filter support
  const queryFn = async ({ signal }) => {
    try {
      // No filters → return all
      if (!hasFilters) {
        const res = await fetchAllUsers({ signal });
        return toArray(res);
      }

      // If you have a multi-filter API, prefer it:
      // const res = await fetchUsersBy(filters, { signal });
      // return toArray(res);

      const entries = Object.entries(filters);

      // Single filter
      if (entries.length === 1) {
        const [key, value] = entries[0];

        // If array of values, fetch all and filter client-side
        if (Array.isArray(value)) {
          const res = await fetchAllUsers({ signal });
          const list = toArray(res);
          return list.filter((u) => value.includes(u?.[key]));
        }

        // Else use the specific endpoint (works if it returns array or object)
        const res = await fetchUserBy(key, value, { signal });
        return toArray(res);
      }

      // Multiple filters → fetch all then filter locally
      const res = await fetchAllUsers({ signal });
      const list = toArray(res);

      return list.filter((u) =>
        entries.every(([k, v]) => {
          if (Array.isArray(v)) return v.includes(u?.[k]);
          if (v != null && typeof v === 'object') {
            // deep equality by stable stringify
            return stableStringify(u?.[k]) === stableStringify(v);
          }
          return u?.[k] === v;
        })
      );
    } catch (err) {
      // Don't surface canceled requests as errors; react-query often cancels in-flight queries.
      if (err?.code === 'ERR_CANCELED') return [];
      console.error('Error fetching users:', err);
      return [];
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: (count, err) => (err?.code === 'ERR_CANCELED' ? false : count < 2),
    select: (rows) => (Array.isArray(rows) ? rows : toArray(rows)), // extra safety
  });

  // WebSocket auto-refetch on updates
  useEffect(() => {
    const { cleanup } = messageHandler(() => {
      queryClient.refetchQueries({ queryKey });
    });
    return () => cleanup();
  }, [queryClient, queryKey]);

  return {
    users: data || [],
    loading: isLoading,
    error: isError ? error?.message || 'Unknown error' : null,
    refetch,
  };
};
