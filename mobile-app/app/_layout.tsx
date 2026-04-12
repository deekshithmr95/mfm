import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { initStorage } from '@mfm/shared';
import { mobileStorageAdapter } from '../src/lib/storage';

// Initialize platform storage before any store hydration
initStorage(mobileStorageAdapter);

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
