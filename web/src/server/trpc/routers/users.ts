import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
// Import our prisma instance and the Prisma client

import { prisma } from '../../prisma';
import { Prisma } from '../../generated/prisma/browser';
/**
 * Default selector for Note.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultUserSelect = {
    id: true,
    externalId: true,
    createdAt: true,
} satisfies Prisma.UserSelect;

export const userRouter = router({
    create: publicProcedure
        .input(
            z.object({
                externalId: z.string().uuid(),
            })
        )
        .mutation(({ input }) =>
            prisma.user.create({
                data: {
                    externalId: input.externalId,
                },
                select: defaultUserSelect,
            })
        ),
    update: publicProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                externalId: z.string().uuid(),
            })
        )
        .mutation(({ input }) =>
            prisma.user.update({
                data: {
                    externalId: input.externalId,
                },
                where: { id: input.id }
            })
        ),
    remove: publicProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(({ input }) => {
            return prisma.user.delete({
                where: {
                    id: input.id,
                },
            });
        }),
    list: publicProcedure.query(() => {
        return prisma.user.findMany({
            select: defaultUserSelect,
        });
    }),
});