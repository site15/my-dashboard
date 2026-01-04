import { z } from 'zod';

export const SupabaseUserDataSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  aud: z.string().optional(),
  role: z.string().optional(),
  emailConfirmedAt: z.string().optional(), // ISO date string
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
});

export type SupabaseUserDataType = z.infer<typeof SupabaseUserDataSchema>;
