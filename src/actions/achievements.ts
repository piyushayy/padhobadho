import { prisma } from "@/lib/prisma"

export async function checkAndAwardAchievements(userId: string) {
    // 1. Progression Steps (Total attempted)
    const totalAttempted = await prisma.userQuestionHistory.count({
        where: { userId }
    })

    if (totalAttempted >= 1) await awardAchievement(userId, "The Apprentice")
    if (totalAttempted >= 50) await awardAchievement(userId, "Bronze Practitioner")
    if (totalAttempted >= 250) await awardAchievement(userId, "Silver Scholar")
    if (totalAttempted >= 1000) await awardAchievement(userId, "Golden Intellectual")
    if (totalAttempted >= 2500) await awardAchievement(userId, "Diamond Rank")

    // 2. Accuracy Milestones
    const performance = await prisma.userPerformanceSummary.findMany({
        where: { userId }
    })

    for (const p of performance) {
        if (p.totalAttempted >= 10 && p.totalAccuracy >= 95) {
            await awardAchievement(userId, "Subject Master")
        }
        if (p.totalAttempted >= 5 && p.totalAccuracy >= 100) {
            await awardAchievement(userId, "Accuracy Ace")
        }
    }

    // 3. Mock Test Milestones
    const mockSessions = await prisma.mockSession.findMany({
        where: { userId, completed: true }
    })

    if (mockSessions.length >= 1) await awardAchievement(userId, "Mock Finisher")

    const perfectMock = mockSessions.find(s => s.accuracy === 100)
    if (perfectMock) await awardAchievement(userId, "Centurion")

    // 4. Premium Milestone
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isPremium: true }
    })
    if (user?.isPremium) await awardAchievement(userId, "Elite Elite")
}

async function awardAchievement(userId: string, name: string) {
    const achievement = await prisma.achievement.findUnique({
        where: { name }
    })

    if (!achievement) return

    await prisma.userAchievement.upsert({
        where: {
            userId_achievementId: {
                userId,
                achievementId: achievement.id
            }
        },
        update: {},
        create: {
            userId,
            achievementId: achievement.id
        }
    })
}
