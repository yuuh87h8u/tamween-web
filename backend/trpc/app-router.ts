import { createTRPCRouter } from "./create-context";
import hiRoute, { healthProcedure } from "./routes/example/hi/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
    health: healthProcedure,
  }),
});

export type AppRouter = typeof appRouter;