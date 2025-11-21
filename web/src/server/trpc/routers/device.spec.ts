import { describe, it, expect, beforeEach, vi } from 'vitest';
import { deviceRouter } from './device';
import { createInnerTRPCContext } from '../trpc';
import { prisma } from '../../prisma';

// Mock prisma
vi.mock('../../prisma', () => ({
  prisma: {
    dashboard: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('deviceRouter', () => {
  const ctx = createInnerTRPCContext({ req: {} as any, res: {} as any });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('link', () => {
    it('should link a device to a dashboard', async () => {
      const input = {
        dashboardId: 'test-dashboard-id',
        deviceId: 'test-device-id',
        code: 'test-code',
      };

      // Mock user context
      const userCtx = { ...ctx, user: { id: 'test-user-id' } } as any;

      // Mock prisma update
      (prisma.dashboard.update as any).mockResolvedValue({ id: 'test-dashboard-id' });

      const caller = deviceRouter.createCaller(userCtx);
      await caller.link(input);

      expect(prisma.dashboard.update).toHaveBeenCalledWith({
        where: {
          id: input.dashboardId,
          userId: 'test-user-id',
          qrCodes: {
            every: { code: input.code, dashboardId: input.dashboardId },
          },
        },
        data: { deviceId: input.deviceId, updatedAt: expect.any(Date) },
      });
    });

    it('should throw FORBIDDEN error if user is not found', async () => {
      const input = {
        dashboardId: 'test-dashboard-id',
        deviceId: 'test-device-id',
        code: 'test-code',
      };

      const caller = deviceRouter.createCaller(ctx);
      
      await expect(caller.link(input)).rejects.toThrow('User not found!');
    });
  });

  describe('info', () => {
    it('should return dashboard info and widgets for a valid deviceId', async () => {
      const input = { deviceId: 'test-device-id' };
      
      // Mock prisma findFirst
      const mockDashboard = {
        id: 'test-dashboard-id',
        name: 'Test Dashboard',
        isBlackTheme: true,
        Widget: [
          {
            id: 'widget-1',
            options: { test: 'option' },
            state: { test: 'state' },
            columnIndex: 1,
            rowIndex: 2,
            columnCount: 3,
            rowCount: 4,
            isBlackTheme: true,
            backgroundColor: '#000000',
            primaryColor: '#ffffff',
            positiveColor: '#00ff00',
            negativeColor: '#ff0000',
          },
        ],
      };
      
      (prisma.dashboard.findFirst as any).mockResolvedValue(mockDashboard);

      const caller = deviceRouter.createCaller(ctx);
      const result = await caller.info(input);

      expect(result).toEqual({
        id: 'test-dashboard-id',
        name: 'Test Dashboard',
        isBlackTheme: true,
        widgets: [
          {
            id: 'widget-1',
            options: { test: 'option' },
            state: { test: 'state' },
            columnIndex: 1,
            rowIndex: 2,
            columnCount: 3,
            rowCount: 4,
            isBlackTheme: true,
            backgroundColor: '#000000',
            primaryColor: '#ffffff',
            positiveColor: '#00ff00',
            negativeColor: '#ff0000',
          },
        ],
      });
    });

    it('should throw NOT_FOUND error if dashboard is not found', async () => {
      const input = { deviceId: 'invalid-device-id' };
      
      // Mock prisma findFirst to return null
      (prisma.dashboard.findFirst as any).mockResolvedValue(null);

      const caller = deviceRouter.createCaller(ctx);
      
      await expect(caller.info(input)).rejects.toThrow('Dashboard not found for this device');
    });
  });
});