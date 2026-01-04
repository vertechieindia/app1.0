/**
 * API Hooks
 * React hooks for data fetching with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiResult<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
  mutate: (data: T) => void;
}

/**
 * Hook for fetching data from API
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  dependencies: unknown[] = []
): UseApiResult<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fetcher();
      setState({ data, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
  }, [...dependencies]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const mutate = useCallback((data: T) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  return { ...state, refetch, mutate };
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<T, P = unknown>(
  mutator: (params: P) => Promise<T>
): {
  mutate: (params: P) => Promise<T>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (params: P): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutator(params);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [mutator]
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { mutate, isLoading, error, reset };
}

/**
 * Hook for paginated data
 */
export function usePaginatedApi<T>(
  fetcher: (params: { skip: number; limit: number }) => Promise<T[]>,
  pageSize: number = 20
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number, append: boolean = false) => {
      const loading = append ? setIsLoadingMore : setIsLoading;
      loading(true);
      setError(null);

      try {
        const skip = pageNum * pageSize;
        const items = await fetcher({ skip, limit: pageSize });

        if (append) {
          setData((prev) => [...prev, ...items]);
        } else {
          setData(items);
        }

        setHasMore(items.length === pageSize);
        setPage(pageNum);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
      } finally {
        loading(false);
      }
    },
    [fetcher, pageSize]
  );

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchPage(page + 1, true);
    }
  }, [fetchPage, page, isLoadingMore, hasMore]);

  const refresh = useCallback(() => {
    setPage(0);
    fetchPage(0, false);
  }, [fetchPage]);

  useEffect(() => {
    fetchPage(0, false);
  }, []);

  return {
    data,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    page,
    loadMore,
    refresh,
  };
}

export default useApi;

