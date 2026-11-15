import { PrismaClient } from "@prisma/client"
import { Pool, neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { WebSocket } from "ws"

const connectionString = `${process.env.DATABASE_URL}`

const isNeon = connectionString.includes("neon.tech")

let adapter = null

if (isNeon) {
  neonConfig.webSocketConstructor = WebSocket
  const pool = new Pool({ connectionString })
  adapter = new PrismaNeon(pool)
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  (adapter
    ? new PrismaClient({ adapter, log: ["error"] })
    : new PrismaClient({ log: ["error"] }))

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
