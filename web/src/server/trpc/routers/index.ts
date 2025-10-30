import { router } from '../trpc';
import { userRouter } from './users';

export const appRouter = router({
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;