import { PrismaClient } from '@prisma/client'
import { neon } from '@neondatabase/serverless'
import { PrismaNeonHTTP } from '@prisma/adapter-neon'

const sql = neon(process.env.DIRECT_URL!)
const adapter = new PrismaNeonHTTP(sql)

export const prismaEdge = new PrismaClient({ adapter })
