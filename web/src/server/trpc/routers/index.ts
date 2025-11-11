import { router } from '../trpc';
import { authRouter } from './auth';
import { dashboardRouter } from './dashboards';
import { telegramRouter } from './telegram';
import { userRouter } from './users';

export const appRouter = router({
  users: userRouter,
  telegram: telegramRouter,
  auth: authRouter,
  dashboards: dashboardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
