/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';


const prismaGlobal = global as typeof global & {
    prisma?: PrismaClient;
};

export const prisma: PrismaClient = prismaGlobal.prisma ?? new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env["MY_DASHBOARD_DATABASE_POSTGRES_URL"] }) });
prismaGlobal.prisma = prisma;