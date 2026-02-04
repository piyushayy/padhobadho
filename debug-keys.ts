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
        console.log("Checking User keys...");
        const user = await prisma.user.findFirst();
        if (user) {
            console.log("Keys present in User object:", Object.keys(user).join(", "));
        } else {
            console.log("No user found.");
        }
    } catch (e) {
        console.error('Prisma check failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
