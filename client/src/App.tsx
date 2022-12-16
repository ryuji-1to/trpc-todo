import { useState } from "react";
import { httpBatchLink } from "@trpc/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TodoList } from "./TodoList";
import { trpc } from "./trpc";

const url = "http://localhost:5000/trpc";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
