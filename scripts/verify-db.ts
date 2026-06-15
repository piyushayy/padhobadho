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
    log: ["query"],
})

async function main() {
    try {
        console.log('Connecting to database...');
        // Test query
        const count = await prisma.user.count();
        console.log(`Successfully connected! Found ${count} users.`);
    } catch (e) {
        console.error('Connection failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

main();
