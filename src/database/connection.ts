/**
 * Database Connection Utility
 *
 * This module provides a singleton Prisma client instance for database connections.
 * In development, it prevents hot-reloading from creating new connections on every reload.
 * In production, it provides a single optimized connection pool.
 *
 * Usage:
 * import { prisma } from '@/database/connection';
 * const users = await prisma.userProfile.findMany();
 */

import { PrismaClient } from '@/generated/prisma';

// Declare global type for development singleton
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Create Prisma client with optional logging configuration
 */
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
};

/**
 * Singleton Prisma client instance
 *
 * In development: Uses globalThis to prevent multiple instances during hot-reload
 * In production: Creates a single instance
 */
export const prisma = global.prisma || createPrismaClient();

// In development, attach to globalThis to preserve across hot-reloads
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Disconnect from database
 * Useful for graceful shutdown in serverless environments or testing
 */
export const disconnect = async () => {
  await prisma.$disconnect();
};

/**
 * Connect to database explicitly
 * Prisma connects automatically on first query, but this can be used for health checks
 */
export const connect = async () => {
  await prisma.$connect();
};

/**
 * Health check - verifies database connectivity
 * Returns true if connected, false otherwise
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};
