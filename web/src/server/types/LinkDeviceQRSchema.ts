import { z } from 'zod';

export const LinkDeviceQRSchema = z.object({
  qr: z.string(),
});

export type LinkDeviceQRType = z.infer<typeof LinkDeviceQRSchema>;
