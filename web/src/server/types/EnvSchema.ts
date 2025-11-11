import { z } from 'zod';

export const EnvSchema = z.object({
  MY_DASHBOARD_DATABASE_POSTGRES_URL: z.string().nullish(),
  MY_DASHBOARD_TELEGRAM_AUTH_BOT_NAME: z.string().nullish(),
  MY_DASHBOARD_TELEGRAM_AUTH_BOT_TOKEN: z.string().nullish(),
});

export type EnvType = z.infer<typeof EnvSchema>;
