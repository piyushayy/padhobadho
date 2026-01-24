const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany();
    console.log("Found users:", users.map(u => u.email));

    if (users.length > 0) {
        await prisma.user.updateMany({
            where: { id: { in: users.map(u => u.id) } },
            data: { role: "ADMIN" }
        })
        console.log(`Promoted ${users.length} users to ADMIN.`);
    } else {
        console.log("No users found to promote.");
    }

    console.log("✅ Authority Granted! Please refresh your app.")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
