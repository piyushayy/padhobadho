import { prisma } from "./src/lib/prisma"

async function main() {
    try {
        const users = await prisma.user.findMany({
            where: { username: "piyushayy" },
            include: { targetExam: true }
        })
        console.log("Users found:", JSON.stringify(users, null, 2))
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
