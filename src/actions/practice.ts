"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function createPracticeSession(subjectId?: string, topicId?: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const newSession = await prisma.practiceSession.create({
        data: {
            userId: session.user.id,
            subjectId: subjectId || null,
            topicId: topicId || null,
        },
    })

    return newSession.id
}

export async function submitQuestionAnswer(
    sessionId: string,
    questionId: string,
    answerIndex: number,
    timeSpent: number = 0
) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // Assert that the practice session belongs to the current user (IDOR prevention)
    const practiceSession = await prisma.practiceSession.findUnique({
        where: { id: sessionId },
        select: { userId: true }
    })

    if (!practiceSession || practiceSession.userId !== session.user.id) {
        throw new Error("Unauthorized practice session")
    }

    const question = await prisma.question.findUnique({
        where: { id: questionId },
        select: {
            correctOption: true,
            subjectId: true,
            explanation: true
        }
    })

    if (!question) throw new Error("Question not found")

    const isCorrect = question.correctOption === answerIndex

    await prisma.sessionQuestion.create({
        data: {
            practiceSessionId: sessionId,
            questionId,
            userAnswer: answerIndex,
            isCorrect,
            timeSpent: Math.max(0, timeSpent)
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

        if (stats.totalAttempted > 0) {
            await prisma.userPerformanceSummary.update({
                where: { id: stats.id },
                data: {
                    totalAccuracy: (stats.totalCorrect / stats.totalAttempted) * 100
                }
            })
        }
    }

    // Gamification XP & streak calculations
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

    // Trigger achievement checks asynchronously
    try {
        const { checkAndAwardAchievements } = await import("./achievements")
        await checkAndAwardAchievements(session.user.id)
    } catch (e) {
        console.error("Failed to check achievements:", e)
    }

    return {
        isCorrect,
        correctOption: question.correctOption,
        explanation: question.explanation,
        xpEarned: solveXp
    }
}
