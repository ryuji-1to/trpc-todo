# trpc-todo demo

## server

### start project

`npm init`

### install packages

`pnpm i fastify @trpc/server @fastify/cors zod`

`pnpm i -D @types/node nodemon ts-node typescript`

### eslint, tsc

`npx eslint --init`

`npx tsc --init`

### router.ts

```ts
import { z } from "zod";
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();
const todos: string[] = ["hoge", "fuga"];

export const appRouter = t.router({
  getAllTodos: t.procedure.query(() => {
    return todos;
  }),
  getTodo: t.procedure.input(z.string()).query(({ input }) => {
    return todos.find((t) => t === input) || "";
  }),
  createTodo: t.procedure.input(z.string()).mutation(({ input }) => {
    todos.push(input);
    return input;
  }),
});

export type AppRouter = typeof appRouter;
```

### index.ts

```ts
import cors from "@fastify/cors";
import fastify from "fastify";
import { inferAsyncReturnType } from "@trpc/server";
import {
  CreateFastifyContextOptions,
  fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify";
import { appRouter } from "./router";

const createContext = ({ req, res }: CreateFastifyContextOptions) => {
  const todo = { todo: req.headers.todo ?? "hoge" };
  return { req, res, todo };
};

export type Context = inferAsyncReturnType<typeof createContext>;

const server = fastify();

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

server.register(cors, {
  origin: "http://localhost:5173",
});

(async () => {
  try {
    await server.listen({ port: 5000 });
  } catch (e) {
    server.log.error(e);
    process.exit(1);
  }
})();
```

## client

### create react project with vite

`pnpm create vite`

### install packages

`pnpm i @trpc/client @trpc/server @trpc/react-query @tanstack/react-query`

`pnpm i -D tailwindcss postcss autoprefixer`

### eslint,tailwindcss

`npx eslint --init`

`npx tailwindcss init -p`

```ts
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

```yaml
env:
  browser: true
  es2021: true
extends:
  - eslint:recommended
  - plugin:react/recommended
  - plugin:@typescript-eslint/recommended
overrides: []
parser: "@typescript-eslint/parser"
parserOptions:
  ecmaVersion: latest
  sourceType: module
plugins:
  - react
  - "@typescript-eslint"
rules: { "react/jsx-uses-react": "off", "react/react-in-jsx-scope": "off" }
```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### trpc.ts

```ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../server/router";

export const trpc = createTRPCReact<AppRouter>();
```

### App.tsx

```tsx
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
```

### TodoList.tsx

```tsx
import { useState } from "react";
import { trpc } from "./trpc";

export const TodoList = () => {
  const [input, setInput] = useState("");
  const { data, refetch } = trpc.getAllTodos.useQuery();
  const mutation = trpc.createTodo.useMutation();
  const handleAddTodo = () => {
    mutation.mutate(input, {
      onSuccess: (todo) => {
        refetch();
      },
    });
    setInput("");
  };

  if (!data) {
    return <div>loading...</div>;
  }

  return (
    <div className="grid place-items-center pt-20">
      <section>
        <h1 className="text-3xl font-bold">Todo List</h1>
        <input
          type="text"
          className="border-b-2 border-gray-300"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
        />
        <button
          className="border bg-gray-300 ml-1 rounded-md px-1"
          onClick={handleAddTodo}
          disabled={mutation.isLoading}
        >
          add
        </button>
        <ul className="list-disc ml-4">
          {data.map((d, i) => (
            <li className="" key={i}>
              {d}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
```
