'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { initStorage } from '@mfm/shared';
import { webStorageAdapter } from '@/lib/storage';

// Initialize platform storage before any store hydration
initStorage(webStorageAdapter);

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Ensure we don't recreate the client on every render
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
}

