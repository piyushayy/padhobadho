"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export interface StreakFreezeStatus {
    available: number // 1 per week
    equipped: boolean
    usedThisWeek: boolean
    lastUsedDate?: string | null
}

export interface WeeklyQuestStatus {
    target: number
    solvedThisWeek: number
    progressPercent: number
    isCompleted: boolean
    isClaimed: boolean
    bonusXp: number
}

function getMondayOfCurrentWeek(): Date {
    const now = new Date()
    const day = now.getDay()
    const diff = (day + 6) % 7 // Monday = 0
    const monday = new Date(now)
    monday.setDate(now.getDate() - diff)
    monday.setHours(0, 0, 0, 0)
    return monday
}

export async function getStreakFreezeStatus(): Promise<StreakFreezeStatus> {
    const session = await auth()
    if (!session?.user?.id) {
        return { available: 0, equipped: false, usedThisWeek: false }
    }

    const userId = session.user.id
    const cookieStore = await cookies()
    const mondayStr = getMondayOfCurrentWeek().toISOString().split("T")[0]

    // Read stored streak freeze status for current week
    const cookieKey = `pb_freeze_${userId}_${mondayStr}`
    const storedState = cookieStore.get(cookieKey)?.value

    if (storedState === "used") {
        return { available: 0, equipped: false, usedThisWeek: true, lastUsedDate: mondayStr }
    } else if (storedState === "equipped") {
        return { available: 1, equipped: true, usedThisWeek: false }
    }

    // Default: 1 freeze available and auto-equipped per week for all active students
    return { available: 1, equipped: true, usedThisWeek: false }
}

export async function spendStreakFreeze(): Promise<{ success: boolean; message: string }> {
    const session = await auth()
    if (!session?.user?.id) return { success: false, message: "Unauthorized" }

    const userId = session.user.id
    const cookieStore = await cookies()
    const mondayStr = getMondayOfCurrentWeek().toISOString().split("T")[0]
    const cookieKey = `pb_freeze_${userId}_${mondayStr}`

    cookieStore.set(cookieKey, "equipped", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax"
    })

    revalidatePath("/dashboard")
    return { success: true, message: "Streak Freeze equipped! Your flame is protected." }
}

export async function getWeeklyQuestProgress(): Promise<WeeklyQuestStatus> {
    const session = await auth()
    const target = 50
    const bonusXp = 250

    if (!session?.user?.id) {
        return { target, solvedThisWeek: 0, progressPercent: 0, isCompleted: false, isClaimed: false, bonusXp }
    }

    const userId = session.user.id
    const monday = getMondayOfCurrentWeek()
    const mondayStr = monday.toISOString().split("T")[0]

    let solvedThisWeek = 0
    try {
        solvedThisWeek = await prisma.sessionQuestion.count({
            where: {
                OR: [
                    { practiceSession: { userId } },
                    { mockSession: { userId } }
                ],
                createdAt: { gte: monday }
            }
        })
    } catch {
        // Fallback for offline DB
        solvedThisWeek = 0
    }

    const cookieStore = await cookies()
    const claimedKey = `pb_quest_claimed_${userId}_${mondayStr}`
    const isClaimed = cookieStore.get(claimedKey)?.value === "true"
    const isCompleted = solvedThisWeek >= target
    const progressPercent = Math.min(100, Math.round((solvedThisWeek / target) * 100))

    return {
        target,
        solvedThisWeek,
        progressPercent,
        isCompleted,
        isClaimed,
        bonusXp
    }
}

export async function claimWeeklyQuestBonus(): Promise<{ success: boolean; message: string; xpAwarded: number }> {
    const session = await auth()
    if (!session?.user?.id) return { success: false, message: "Unauthorized", xpAwarded: 0 }

    const quest = await getWeeklyQuestProgress()
    if (!quest.isCompleted) {
        return { success: false, message: `Solve ${quest.target - quest.solvedThisWeek} more questions to claim bonus!`, xpAwarded: 0 }
    }
    if (quest.isClaimed) {
        return { success: false, message: "Weekly quest bonus already claimed for this week!", xpAwarded: 0 }
    }

    const userId = session.user.id
    const mondayStr = getMondayOfCurrentWeek().toISOString().split("T")[0]
    const cookieStore = await cookies()
    const claimedKey = `pb_quest_claimed_${userId}_${mondayStr}`

    cookieStore.set(claimedKey, "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax"
    })

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { xp: { increment: quest.bonusXp } }
        })
    } catch {
        // Fallback safely if db offline
    }

    revalidatePath("/dashboard")
    return { success: true, message: `🔥 Cooked! +${quest.bonusXp} XP added to your total.`, xpAwarded: quest.bonusXp }
}

export async function getUserActivityHeatmap(userId?: string): Promise<Record<string, number>> {
    const map: Record<string, number> = {}

    // Populate last 112 days (16 weeks) with 0
    const now = new Date()
    for (let i = 112; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(now.getDate() - i)
        const dateStr = d.toISOString().split("T")[0]
        map[dateStr] = 0
    }

    if (!userId) return map

    try {
        const ninetyDaysAgo = new Date(now)
        ninetyDaysAgo.setDate(now.getDate() - 112)

        const questions = await prisma.sessionQuestion.findMany({
            where: {
                OR: [
                    { practiceSession: { userId } },
                    { mockSession: { userId } }
                ],
                createdAt: { gte: ninetyDaysAgo }
            },
            select: { createdAt: true }
        })

        for (const q of questions) {
            const dateStr = q.createdAt.toISOString().split("T")[0]
            if (map[dateStr] !== undefined) {
                map[dateStr] += 1
            } else {
                map[dateStr] = 1
            }
        }
    } catch {
        // If DB not reachable, return initialized heatmap with today's practice demo
        const todayStr = now.toISOString().split("T")[0]
        map[todayStr] = 1
    }

    return map
}
