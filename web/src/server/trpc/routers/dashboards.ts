import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
// Import our prisma instance and the Prisma client

import QRCode from 'qrcode';
import { LinkDeviceQRSchema } from '../../types/LinkDeviceQRSchema';

export const dashboardRouter = router({
  linkDevice: publicProcedure
    .input(
      z.object({
        dashboardId: z.string(),
      })
    )
    .output(LinkDeviceQRSchema)
    .query(async ({ input }) => ({
      qr: await QRCode.toDataURL(
        JSON.stringify({ dashboardId: input.dashboardId }),
        { width: 250 }
      ),
    })),
});
