import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// Context creation function
export const createContext = async () => {
  return {};
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;