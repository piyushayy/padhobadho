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

const prisma = new PrismaClient({
    adapter,
})

async function main() {
    try {
        console.log("Checking User record...");
        const user = await prisma.user.findFirst();
        console.log("First user:", JSON.stringify(user, null, 2));
    } catch (e) {
        console.error('Prisma check failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
