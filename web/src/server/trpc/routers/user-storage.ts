import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const userStorageRouter = router({
  get: publicProcedure
    .input(z.object({ name: z.string() }))
    .output(z.object({ name: z.string(), value: z.string().nullish() }))
    .query(({ input, ctx }) => {
      const name = input.name;
      const value = ctx.getCookie(name);
      return {
        name,
        value,
      };
    }),

  set: publicProcedure
    .input(z.object({ name: z.string(), value: z.string().nullish() }))
    .output(z.object({ name: z.string(), value: z.string().nullish() }))
    .mutation(({ input, ctx }) => {
      const name = input.name;
      const value = input.value;
      if (!value) {
        ctx.setCookie(name, null, {
          httpOnly: true,
          path: '/',
          maxAge: 0,
          sameSite: 'strict',
          ...{ secure: process.env?.['NODE_ENV'] === 'production' },
        });
      } else {
        ctx.setCookie(name, value, {
          httpOnly: true,
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
          sameSite: 'strict',
          ...{ secure: process.env?.['NODE_ENV'] === 'production' },
        });
      }
      return {
        name,
        value,
      };
    }),

  del: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      const name = input.name;
      ctx.setCookie(name, null, {
        httpOnly: true,
        path: '/',
        maxAge: 0,
        sameSite: 'strict',
        ...{ secure: process.env?.['NODE_ENV'] === 'production' },
      });
    }),
});
