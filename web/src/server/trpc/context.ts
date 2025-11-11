import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from '../prisma';
import { X_SESSION_ID } from '../constants';

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
    return {};
  }
  return {
    user: options.user,
    session: options.session,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
