import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: 'http://localhost:5000/trpc',
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Demo />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const Demo = () => {
  const user = trpc.useQuery(["getUser"]);

  return <div>
    hello {JSON.stringify(user)}
  </div>
}

export default Home;
