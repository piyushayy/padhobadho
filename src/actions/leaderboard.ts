import { prisma } from "@/lib/prisma"

export interface LeaderboardEntry {
    rank: number
    userId: string
    name: string
    image: string | null
    score: number
    level: number
    accuracy: number
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    const users = await prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { xp: "desc" },
        take: 50,
        select: {
            id: true,
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
            name: user.name || "Anonymous Aspirant",
            image: user.image,
            score: user.xp,
            level: user.level,
            accuracy
        }
    })
}

export async function getUserRank(userId: string): Promise<number> {
    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true }
    })

    if (!currentUser) return 0

    const higherRankCount = await prisma.user.count({
        where: {
            role: "STUDENT",
            xp: { gt: currentUser.xp }
        }
    })

    return higherRankCount + 1
}
