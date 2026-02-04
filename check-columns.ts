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
        console.log("Checking User table columns...");
        // @ts-ignore
        const columns = await prisma.$queryRaw`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'User';
        `;
        console.log(JSON.stringify(columns, null, 2));
    } catch (e) {
        console.error('Failed to fetch columns:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
