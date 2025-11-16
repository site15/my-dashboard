import { router } from '../trpc';
import { authRouter } from './auth';
import { dashboardsRouter } from './dashboards';
import { telegramRouter } from './telegram';
import { userStorageRouter } from './user-storage';
import { userRouter } from './users';
import { widgetsRouter } from './widgets';

export const appRouter = router({
  users: userRouter,
  telegram: telegramRouter,
  auth: authRouter,
  dashboards: dashboardsRouter,
  widgets: widgetsRouter,
  userStorage: userStorageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
