import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import { X_SESSION_ID } from '../constants';
import { prisma } from '../prisma';
import { SerializeOptions } from '../utils/cookie';
import { getCookie, getCookies, setCookie } from '../utils/cookie-utils';
import { isSSR } from '../utils/is-ssr';

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  try {
    const origin =
      res.req?.headers?.['origin'] || res.req?.headers?.['referer'];
    if (origin) {
      if (res.req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader(
          'Access-Control-Allow-Methods',
          'GET, POST, PUT, DELETE, OPTIONS'
        );
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization'
        );
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '86400');
      } else {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }
    }
  } catch (err) {
    console.log(err);
  }
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
  const options = await getUserAndSessionFromHeader();
  if (!options) {
    return {
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
