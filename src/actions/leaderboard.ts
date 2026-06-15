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
    // Rank by XP primarily
    const users = await prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { xp: "desc" },
        take: 20,
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
        } as any
    })

    return users.map((user: any, index: number) => {
        const totalCorrect = user.performance.reduce((acc: number, curr: any) => acc + curr.totalCorrect, 0)
        const totalAttempted = user.performance.reduce((acc: number, curr: any) => acc + curr.totalAttempted, 0)
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

export async function getUserRank(userId: string) {
    const users = await prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { xp: "desc" },
        select: { id: true }
    })

    const rank = users.findIndex(u => u.id === userId) + 1
    return rank || 0
}
