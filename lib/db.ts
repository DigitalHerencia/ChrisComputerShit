import { PrismaClient } from "@prisma/client"
import { neonConfig, Pool } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import ws from "ws"

// Neon requires a WebSocket constructor in Node environments
neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable must be set")
}

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })

if (process.env.NODE_ENV !== "production") global.prisma = prisma
