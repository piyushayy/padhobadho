"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function createPracticeSession(subjectId?: string, topicId?: string) {
    const session = await auth()
    if (!session?.user?.id) return "guest-session"

    const newSession = await prisma.practiceSession.create({
        data: {
            userId: session.user.id,
            subjectId,
            topicId,
        },
    })

    return newSession.id
}

export async function submitQuestionAnswer(
    sessionId: string,
    questionId: string,
    answerIndex: number,
    timeSpent: number
) {
    const session = await auth()

    let question: { correctOption: number; subjectId: string | null; explanation: string | null } | null = null
    try {
        question = await prisma.question.findUnique({
            where: { id: questionId },
            select: {
                correctOption: true,
                subjectId: true,
                explanation: true
            }
        })
    } catch {
        // Fallback for offline demo questions
        if (questionId.startsWith("q-demo-")) {
            question = {
                correctOption: 0,
                subjectId: null,
                explanation: "Demo question explanation."
            }
        }
    }

    if (!question) {
        if (questionId.startsWith("q-demo-")) {
            question = {
                correctOption: 0,
                subjectId: null,
                explanation: "Demo question explanation."
            }
        } else {
            throw new Error("Question not found")
        }
    }

    const isCorrect = question.correctOption === answerIndex

    // Guest response: validate and enforce server-side limit via cookie
    if (!session?.user?.id) {
        const cookieStore = await cookies()
        const guestAttempts = parseInt(cookieStore.get("pb_guest_attempts")?.value || "0", 10)

        if (guestAttempts >= 5) {
            return {
                isCorrect,
                correctOption: question.correctOption,
                explanation: question.explanation,
                limitReached: true,
                message: "Guest practice limit reached. Sign in free to continue."
            }
        }

        const newAttempts = guestAttempts + 1
        cookieStore.set("pb_guest_attempts", newAttempts.toString(), {
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: true,
            sameSite: "lax"
        })

        return {
            isCorrect,
            correctOption: question.correctOption,
            explanation: question.explanation,
            guestAttempts: newAttempts,
            limitReached: newAttempts >= 5
        }
    }

    await prisma.sessionQuestion.create({
        data: {
            practiceSessionId: sessionId,
            questionId,
            userAnswer: answerIndex,
            isCorrect,
            timeSpent
        }
    })

    await prisma.userQuestionHistory.upsert({
        where: {
            userId_questionId: {
                userId: session.user.id,
                questionId
            }
        },
        update: {
            lastAttempted: new Date(),
            isCorrect,
            occurrences: { increment: 1 }
        },
        create: {
            userId: session.user.id,
            questionId,
            isCorrect
        }
    })

    // Update performance summary (Per Subject)
    if (question.subjectId) {
        const stats = await prisma.userPerformanceSummary.upsert({
            where: { userId_subjectId: { userId: session.user.id, subjectId: question.subjectId } },
            update: {
                totalAttempted: { increment: 1 },
                totalCorrect: { increment: isCorrect ? 1 : 0 },
            },
            create: {
                userId: session.user.id,
                subjectId: question.subjectId,
                totalAttempted: 1,
                totalCorrect: isCorrect ? 1 : 0,
                totalAccuracy: isCorrect ? 100 : 0
            }
        })

        // Recalculate accuracy for the summary
        await prisma.userPerformanceSummary.update({
            where: { id: stats.id },
            data: {
                totalAccuracy: (stats.totalCorrect / stats.totalAttempted) * 100
            }
        })
    }

    // --- GAMIFICATION LOGIC ---
    const solveXp = 10 + (isCorrect ? 15 : 0)
    const now = new Date()
    const todayStr = now.toDateString()

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { xp: true, currentStreak: true, lastActiveDate: true, longestStreak: true }
    })

    if (user) {
        let newStreak = user.currentStreak
        const lastActiveStr = user.lastActiveDate?.toDateString()

        if (lastActiveStr !== todayStr) {
            const yesterday = new Date(now)
            yesterday.setDate(now.getDate() - 1)
            const yesterdayStr = yesterday.toDateString()

            if (lastActiveStr === yesterdayStr) {
                newStreak += 1
            } else {
                newStreak = 1
            }
        }

        const newXp = user.xp + solveXp
        const newLevel = Math.floor(newXp / 1000) + 1

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                xp: newXp,
                level: newLevel,
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, user.longestStreak),
                lastActiveDate: now
            }
        })
    }

    // Trigger achievement checks
    const { checkAndAwardAchievements } = await import("./achievements")
    await checkAndAwardAchievements(session.user.id)

    return {
        isCorrect,
        correctOption: question.correctOption,
        xpEarned: solveXp
    }
}
