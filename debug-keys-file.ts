import { PrismaClient } from "@prisma/client"
import { Pool, neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { WebSocket } from "ws"
import fs from 'fs'

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
        const user = await prisma.user.findFirst();
        if (user) {
            fs.writeFileSync('keys.txt', Object.keys(user).join(", "));
            console.log("Keys written to keys.txt");
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
