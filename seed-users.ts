import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Seeding Users...")

    const dummyUsers = [
        { name: "Aarav Patel", xp: 12500, level: 12 },
        { name: "Ishita Sharma", xp: 11200, level: 11 },
        { name: "Vihaan Gupta", xp: 9800, level: 9 },
        { name: "Ananya Singh", xp: 9500, level: 9 },
        { name: "Rohan Verma", xp: 8900, level: 8 },
        { name: "Priya Das", xp: 8200, level: 8 },
        { name: "Aditya Kumar", xp: 7600, level: 7 },
        { name: "Sanya Malhotra", xp: 7100, level: 7 },
        { name: "Kabir Joshi", xp: 6800, level: 6 },
        { name: "Meera Reddy", xp: 6400, level: 6 },
        { name: "Arjun Nair", xp: 5900, level: 5 },
        { name: "Diya Kaplan", xp: 5500, level: 5 },
        { name: "Reyansh Mehta", xp: 5100, level: 5 },
        { name: "Zara Khan", xp: 4800, level: 4 },
        { name: "Devansh Shah", xp: 4500, level: 4 },
    ]

    const passwordHash = await bcrypt.hash("password123", 10)

    for (const u of dummyUsers) {
        // Create email from name
        const email = `${u.name.toLowerCase().replace(" ", ".")}@example.com`

        await prisma.user.upsert({
            where: { email },
            update: {
                xp: u.xp,
                level: u.level
            },
            create: {
                name: u.name,
                email,
                password: passwordHash,
                role: "STUDENT",
                xp: u.xp,
                level: u.level,
                image: `https://api.dicebear.com/7.x/notionists/svg?seed=${u.name}`
            }
        })
    }

    console.log("✅ Seeded 15 dummy users for leaderboard!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
