/**
 * Prisma Client Singleton
 *
 * Ensures a single Prisma Client instance is used across the application.
 * In development, this prevents exhausting database connections due to hot reloading.
 *
 * @module lib/prisma
 */

import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient options for logging and error handling
 */
const prismaOptions = {
  log:
    process.env.NODE_ENV === 'development'
      ? (['query', 'error', 'warn'] as const)
      : (['error'] as const),
};

/**
 * Global Prisma Client instance declaration
 * Used to persist the client across hot reloads in development
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Prisma Client singleton instance
 *
 * In production: Creates a new instance
 * In development: Reuses global instance to prevent connection exhaustion
 */
export const prisma = globalThis.prisma || new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

/**
 * Disconnect Prisma Client on process termination
 * Ensures clean shutdown and releases database connections
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
