"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getDailyChallenge() {
    const session = await auth()
    if (!session?.user?.id) return null

    const todayStr = new Date().toISOString().split("T")[0] // YYYY-MM-DD

    // Fetch user with target exam / subject preferences
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            currentStreak: true,
            xp: true,
            targetExamId: true,
        }
    })

    if (!user) return null

    // Determine deterministic question of the day using date hash
    const dateNum = todayStr.split("-").reduce((acc, part) => acc + parseInt(part, 10), 0)

    const totalQuestions = await prisma.question.count()
    if (totalQuestions === 0) return null

    const skipIndex = dateNum % totalQuestions

    const dailyQuestion = await prisma.question.findFirst({
        skip: skipIndex,
        include: {
            subject: true,
            topic: true,
        }
    })

    if (!dailyQuestion) return null

    // Check if user has already solved today's question
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const solvedToday = await prisma.sessionQuestion.findFirst({
        where: {
            questionId: dailyQuestion.id,
            isCorrect: true,
            createdAt: { gte: today },
            practiceSession: {
                userId: session.user.id
            }
        }
    })

    return {
        question: {
            id: dailyQuestion.id,
            content: dailyQuestion.content,
            options: dailyQuestion.options as string[],
            explanation: dailyQuestion.explanation,
            correctOption: dailyQuestion.correctOption,
            difficulty: dailyQuestion.difficulty,
            subject: dailyQuestion.subject?.name || "General",
            topic: dailyQuestion.topic?.name || "Concept Drill",
        },
        isCompleted: !!solvedToday,
        date: todayStr,
        streak: user.currentStreak,
        xpBonus: 50,
    }
}

export async function submitDailyAnswer(questionId: string, selectedOption: number, timeSpentSeconds: number) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const question = await prisma.question.findUnique({
        where: { id: questionId }
    })

    if (!question) return { error: "Question not found" }

    const isCorrect = selectedOption === question.correctOption
    const userId = session.user.id

    // Update or create UserQuestionHistory
    await prisma.userQuestionHistory.upsert({
        where: {
            userId_questionId: {
                userId,
                questionId
            }
        },
        update: {
            isCorrect,
            occurrences: { increment: 1 },
            lastAttempted: new Date()
        },
        create: {
            userId,
            questionId,
            isCorrect,
            occurrences: 1,
            lastAttempted: new Date()
        }
    })

    // If correct, reward XP and update streak
    if (isCorrect) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { lastActiveDate: true, currentStreak: true, longestStreak: true }
        })

        const now = new Date()
        let newStreak = user?.currentStreak || 0

        let freezeUsed = false
        if (user?.lastActiveDate) {
            const lastActive = new Date(user.lastActiveDate)
            const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 3600)
            if (diffHours >= 20 && diffHours <= 48) {
                newStreak += 1
            } else if (diffHours > 48) {
                // Streak protection: check if weekly freeze is available
                const { getStreakFreezeStatus } = await import("./gamification")
                const freeze = await getStreakFreezeStatus()
                if (freeze.equipped && !freeze.usedThisWeek && (user?.currentStreak || 0) > 0) {
                    newStreak = (user?.currentStreak || 0) + 1
                    freezeUsed = true
                    const { cookies } = await import("next/headers")
                    const cookieStore = await cookies()
                    const day = now.getDay()
                    const diff = (day + 6) % 7
                    const mon = new Date(now)
                    mon.setDate(now.getDate() - diff)
                    const mondayStr = mon.toISOString().split("T")[0]
                    cookieStore.set(`pb_freeze_${userId}_${mondayStr}`, "used", {
                        path: "/",
                        maxAge: 60 * 60 * 24 * 7,
                        sameSite: "lax"
                    })
                } else {
                    newStreak = 1
                }
            }
        } else {
            newStreak = 1
        }

        const longestStreak = Math.max(newStreak, user?.longestStreak || 0)

        await prisma.user.update({
            where: { id: userId },
            data: {
                xp: { increment: 50 }, // 50 XP bonus for POTD
                currentStreak: newStreak,
                longestStreak,
                lastActiveDate: now,
            }
        })
    }

    revalidatePath("/dashboard")
    revalidatePath("/practice")

    return {
        isCorrect,
        correctOption: question.correctOption,
        explanation: question.explanation,
        timeSpent: timeSpentSeconds,
        telemetry: {
            percentileSpeed: isCorrect ? Math.min(96, Math.max(45, Math.round(100 - (timeSpentSeconds / 90) * 50))) : 0,
            feedback: isCorrect
                ? timeSpentSeconds < 35
                    ? "⚡ Blazing Fast! Faster than 88% of aspirants."
                    : "🎯 Accurate & Consistent! Keep up the daily momentum."
                : "💡 Review the core concept below to master this pattern."
        }
    }
}
