'use client';

import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { ReactNode, useState } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  // ✅ move QueryClient to state to avoid recreation on every render
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
