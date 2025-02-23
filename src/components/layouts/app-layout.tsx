"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

// ~ ======= Create query client -->
const queryClient = new QueryClient();

type LayoutProps = React.ComponentProps<typeof ThemeProvider>;
const AppLayout: React.FC<LayoutProps> = ({ children, ...props }) => {
  return (
    <ThemeProvider {...props}>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster richColors position="bottom-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
};

export default AppLayout;
