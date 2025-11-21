import { z } from 'zod';

export const EnvSchema = z.object({
  MY_DASHBOARD_DATABASE_POSTGRES_URL: z.string().nullish(),
  MY_DASHBOARD_TELEGRAM_AUTH_BOT_NAME: z.string().nullish(),
  MY_DASHBOARD_TELEGRAM_AUTH_BOT_TOKEN: z.string().nullish(),
  MY_DASHBOARD_API_URL: z.string().nullish(),
  MY_DASHBOARD_PRETTY_LOGS: z
    .string()
    .transform(val => val === 'true')
    .default('false')
    .nullish(),
});

export type EnvType = z.infer<typeof EnvSchema>;
