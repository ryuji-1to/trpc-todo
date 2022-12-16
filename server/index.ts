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
