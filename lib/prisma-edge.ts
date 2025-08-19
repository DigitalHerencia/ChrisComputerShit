import { PrismaClient } from '@prisma/client'
import { neon } from '@neondatabase/serverless'
import { PrismaNeonHTTP } from '@prisma/adapter-neon'

const getDirectUrl = (): string => {
  const url = process.env.DIRECT_URL
  if (typeof url !== 'string' || url.length === 0) {
    throw new Error('DIRECT_URL environment variable must be a non-empty string')
  }
  return url
}

const sql = neon(getDirectUrl())
const adapter = new PrismaNeonHTTP(sql)

export const prismaEdge = new PrismaClient({ adapter })
