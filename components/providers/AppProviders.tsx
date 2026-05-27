import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

import { useAuthListener } from '@/hooks/useAuthListener';
import { queryClient } from '@/services/api/queryClient';

function AppProvidersInner({ children }: PropsWithChildren) {
  useAuthListener();
  return children;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvidersInner>{children}</AppProvidersInner>
    </QueryClientProvider>
  );
}
