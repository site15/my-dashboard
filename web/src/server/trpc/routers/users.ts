import { z } from 'zod';

import { prisma } from '../../prisma';
import { UserSchema, UserType } from '../../types/UserSchema';
import { publicProcedure, router } from '../trpc';

export const userRouter = router({
  list: publicProcedure.output(z.array(UserSchema)).query(async () => {
    return (await prisma.user.findMany()) as UserType[];
  }),
});
