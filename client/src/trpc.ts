import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../server/router";

export const trpc = createTRPCReact<AppRouter>();

// export const trpc = createTRPCProxyClient<AppRouter>({
//   links: [
//     httpBatchLink({
//       url: "http://localhost:5000/trpc",
//     }),
//   ],
// });
