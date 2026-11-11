import {QueryClient} from '@tanstack/react-query';

// Data is local (SQLite), so there is no network staleness to manage; mutations invalidate by key.
export const queryClient = new QueryClient({
  defaultOptions: {queries: {staleTime: Infinity, gcTime: Infinity}},
});
