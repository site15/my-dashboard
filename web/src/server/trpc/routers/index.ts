import { router } from '../trpc';
import { authRouter } from './auth';
import { dashboardsRouter } from './dashboards';
import { deviceRouter } from './device';
import { financeRouter } from './finance';
import { telegramRouter } from './telegram';
import { userStorageRouter } from './user-storage';
import { userRouter } from './users';
import { widgetsRouter } from './widgets';
import { releasesRouter } from './releases';

export const appRouter = router({
  users: userRouter,
  telegram: telegramRouter,
  auth: authRouter,
  dashboards: dashboardsRouter,
  widgets: widgetsRouter,
  userStorage: userStorageRouter,
  device: deviceRouter,
  releases: releasesRouter,
  finance: financeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
