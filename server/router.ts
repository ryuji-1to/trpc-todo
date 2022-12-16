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
