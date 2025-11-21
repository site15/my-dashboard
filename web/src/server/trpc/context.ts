import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import { X_DEVICE_ID, X_SESSION_ID } from '../constants';
import { prisma } from '../prisma';
import { SerializeOptions } from '../utils/cookie';
import { getCookie, getCookies, setCookie } from '../utils/cookie-utils';
import { isSSR } from '../utils/is-ssr';

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const getUserAndSessionFromHeader = async function () {
    if (req.headers[X_SESSION_ID]) {
      const result = await prisma.session.findFirst({
        include: { User: true },
        where: { id: { equals: req.headers[X_SESSION_ID] }, deletedAt: null },
      });
      if (!result) {
        if (isSSR) {
          return null;
        }
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Session not found!',
        });
      }
      return { user: result?.User, session: result };
    }
    return null;
  };

  const getDeviceIdFromHeader = async function () {
    const deviceId = req.headers[X_DEVICE_ID];
    if (deviceId) {
      const result = await prisma.dashboard.findFirst({
        where: {
          deviceId: { equals: deviceId },
          deletedAt: null,
        },
      });
      if (!result) {
        if (isSSR) {
          return null;
        }
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Device ID not found!',
        });
      }
    }
    return deviceId;
  };

  const options = await getUserAndSessionFromHeader();
  if (!options) {
    return {
      deviceId: await getDeviceIdFromHeader(),
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
    };
  }
  return {
    user: options.user,
    session: options.session,
    deviceId: await getDeviceIdFromHeader(),
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
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
