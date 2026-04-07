import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = (): PrismaClient => {
  const options: ConstructorParameters<typeof PrismaClient>[0] = {
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  };

  // Only set datasource URL if DATABASE_URL is provided
  // Otherwise Prisma will use the URL from schema.prisma
  if (process.env.DATABASE_URL) {
    options.datasources = {
      db: {
        url: process.env.DATABASE_URL,
      },
    };
  }

  return new PrismaClient(options);
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Development: Use --refresh-schema flag to reset client on schema changes
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
