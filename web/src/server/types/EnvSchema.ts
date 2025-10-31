import { z } from 'zod';

export const EnvSchema = z.object({
  MY_DASHBOARD_DATABASE_POSTGRES_URL: z.string(),
  MY_DASHBOARD_TELEGRAM_AUTH_BOT_NAME: z.string(),
  MY_DASHBOARD_TELEGRAM_AUTH_BOT_TOKEN: z.string(),
});

export type EnvType = z.infer<typeof EnvSchema>;
