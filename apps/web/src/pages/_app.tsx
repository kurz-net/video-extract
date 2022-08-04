// src/pages/_app.tsx
import type { AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import { useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "../utils/trpc";

function Layout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: "http://localhost:5000/trpc",
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
};
export default MyApp;
