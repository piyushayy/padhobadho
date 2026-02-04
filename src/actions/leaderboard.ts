import { prisma } from "@/lib/prisma"

export async function getLeaderboard() {
    // Rank by XP primarily
    const users = await prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { xp: "desc" },
        take: 20,
        select: {
            id: true,
            username: true,
            name: true,
            image: true,
            xp: true,
            level: true,
            performance: {
                select: {
                    totalCorrect: true,
                    totalAttempted: true
                }
            }
        }
    })

    return users.map((user, index) => {
        const totalCorrect = user.performance.reduce((acc, curr) => acc + curr.totalCorrect, 0)
        const totalAttempted = user.performance.reduce((acc, curr) => acc + curr.totalAttempted, 0)
        const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0

        return {
            rank: index + 1,
            userId: user.id,
            name: user.username || user.name || "Anonymous",
            image: user.image,
            score: user.xp,
            level: user.level,
            accuracy
        }
    })
}

export async function getUserRank(userId: string) {
    const users = await prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { xp: "desc" },
        select: { id: true }
    })

    const rank = users.findIndex(u => u.id === userId) + 1
    return rank || 0
}
