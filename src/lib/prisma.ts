import { PrismaClient } from '@prisma/client';

// This is a best practice for using Prisma with Next.js in development.
// It prevents creating a new PrismaClient instance on every hot reload.
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// If prisma is not already defined in the global scope, create a new instance.
// In production, a new instance is always created.
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

// In development, store the prisma instance in the global scope.
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}