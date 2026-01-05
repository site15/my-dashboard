import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import { X_DEVICE_ID, X_SESSION_ID } from '../constants';
import { Session, User } from '../generated/prisma/client';
import { prisma } from '../prisma';
import { SerializeOptions } from '../utils/cookie';
import { getCookie, getCookies, setCookie } from '../utils/cookie-utils';
import { attachLoggerToContext } from '../utils/enhanced-logger';
import { isSSR } from '../utils/is-ssr';

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const getUserAndSessionFromHeader = async function (): Promise<{
    user: User | null;
    session: Session | null;
  }> {
    if (req.headers[X_SESSION_ID]) {
      const result = await prisma.session.findFirst({
        include: { User: true },
        where: { id: { equals: req.headers[X_SESSION_ID] }, deletedAt: null },
      });
      if (!result) {
        if (isSSR) {
          return { user: null, session: null };
        }
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Session not found!',
        });
      }
      return { user: result?.User, session: result };
    }
    return { user: null, session: null };
  };

  const getDeviceIdFromHeader = function () {
    return req.headers[X_DEVICE_ID] || null;
  };

  const getDashboardByDeviceId = async function (deviceId?: string) {
    if (deviceId) {
      const result = await prisma.dashboard.findFirst({
        include: { User: true },
        where: {
          deviceId: { equals: deviceId },
          deletedAt: null,
          isActive: true,
        },
      });
      if (!result) {
        if (isSSR) {
          return null;
        }
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'The device ID is not linked to the dashboard!',
        });
      }
      return result;
    }
    return null;
  };

  const deviceId = getDeviceIdFromHeader();
  const dashboard = await getDashboardByDeviceId(deviceId);
  let options = await getUserAndSessionFromHeader();

  if (!options?.user && dashboard?.User) {
    if (!options) {
      options = { user: null, session: null };
    }
    options.user = dashboard.User;
  }

  if (!options) {
    return attachLoggerToContext({
      deviceId: dashboard?.deviceId || deviceId,
      setCookie: (
        name: string,
        value?: string | null,
        options?: SerializeOptions
      ) => {
        setCookie(res, name, value, options);
      },
      getCookie: (name: string) => {
        return getCookie(res.req, name);
      },
      clearCookies: (options?: SerializeOptions) => {
        const items = Object.values(getCookies(res.req));
        for (const item of items) {
          if (item) {
            setCookie(res.req, item[0], null, options);
          }
        }
      },
    });
  }
  return attachLoggerToContext({
    req,
    user: options.user,
    session: options.session,
    deviceId: dashboard?.deviceId || deviceId,
    setCookie: (
      name: string,
      value?: string | null,
      options?: SerializeOptions
    ) => {
      setCookie(res, name, value, options);
    },
    getCookie: (name: string) => {
      return getCookie(res.req, name);
    },
    clearCookies: (options?: SerializeOptions) => {
      const items = Object.values(getCookies(res.req));
      for (const item of items) {
        if (item) {
          setCookie(res.req, item[0], null, options);
        }
      }
    },
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
