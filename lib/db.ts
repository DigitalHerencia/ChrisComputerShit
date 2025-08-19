import { PrismaClient } from '@prisma/client'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'

const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL
  if (typeof url !== 'string' || url.length === 0) {
    throw new Error('DATABASE_URL environment variable must be a non-empty string')
  }
  return url
}

const pool = new Pool({ connectionString: getDatabaseUrl() })
const adapter = new PrismaNeon(pool)

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
