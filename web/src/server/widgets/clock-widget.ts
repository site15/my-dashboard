import { z } from 'zod';

export const ClockWidgetTimezoneSchema = z.object({
  timezone: z.number(),
  label: z.string(),
});

export const ClockWidgetSchema = z.object({
  id: z.string().uuid(),
  hourFormat: z.enum(['12h', '24h']).default('24h'),
  timezones: z.array(ClockWidgetTimezoneSchema),
});

export type ClockWidgetTimezoneType = z.infer<typeof ClockWidgetTimezoneSchema>;

export type ClockWidgetType = z.infer<typeof ClockWidgetSchema>;
