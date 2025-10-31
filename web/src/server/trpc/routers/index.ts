import { router } from '../trpc';
import { authRouter } from './auth';
import { telegramRouter } from './telegram';
import { userRouter } from './users';

export const appRouter = router({
  users: userRouter,
  telegram: telegramRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
