import cors from "@fastify/cors";
import fastify from "fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter } from "./router";

const server = fastify();

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter },
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
