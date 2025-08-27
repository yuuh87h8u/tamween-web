import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export const hiProcedure = publicProcedure
  .input(z.object({ name: z.string() }))
  .mutation(({ input }: { input: { name: string } }) => {
    return {
      hello: input.name,
      date: new Date(),
    };
  });

export const healthProcedure = publicProcedure
  .query(() => {
    return {
      status: 'ok',
      timestamp: new Date(),
      message: 'Backend is running'
    };
  });

export default hiProcedure;