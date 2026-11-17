"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Initialize or resume an ongoing server-authoritative mock session.
 * Prevents loss of answers if student accidentally refreshes or disconnects.
 */
export async function initMockSession(subjectId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    try {
        // Find existing unfinished session started in last 45 minutes
        const cutoff = new Date(Date.now() - 45 * 60 * 1000)
        const existingSession = await prisma.mockSession.findFirst({
            where: {
                userId: session.user.id,
                subjectId,
                completed: false,
                startTime: { gte: cutoff }
            },
            include: {
                questions: true
            },
            orderBy: { startTime: "desc" }
        })

        if (existingSession) {
            const savedAnswers: Record<string, number> = {}
            existingSession.questions.forEach(q => {
                if (q.userAnswer !== null && q.userAnswer !== undefined) {
                    savedAnswers[q.questionId] = q.userAnswer
                }
            })
            const elapsed = Math.floor((Date.now() - new Date(existingSession.startTime).getTime()) / 1000)
            const remaining = Math.max(0, 45 * 60 - elapsed)
            return {
                sessionId: existingSession.id,
                savedAnswers,
                timeLeft: remaining
            }
        }

        const newSession = await prisma.mockSession.create({
            data: {
                userId: session.user.id,
                subjectId,
                score: 0,
                completed: false
            }
        })

        return {
            sessionId: newSession.id,
            savedAnswers: {},
            timeLeft: 45 * 60
        }
    } catch (error) {
        // Safe offline / fallback id
        return {
            sessionId: `mock_offline_${Date.now()}`,
            savedAnswers: {},
            timeLeft: 45 * 60
        }
    }
}

/**
 * Real-time incremental answer sync (Server-Authoritative).
 * Saves each selected answer immediately as the student answers it.
 */
export async function recordMockAnswer(
    sessionId: string,
    questionId: string,
    answerIndex: number
) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    if (sessionId.startsWith("mock_offline_")) {
        return { success: true }
    }

    try {
        const question = await prisma.question.findUnique({
            where: { id: questionId },
            select: { correctOption: true }
        })
        const isCorrect = question ? question.correctOption === answerIndex : null

        const existing = await prisma.sessionQuestion.findFirst({
            where: { mockSessionId: sessionId, questionId }
        })

        if (existing) {
            await prisma.sessionQuestion.update({
                where: { id: existing.id },
                data: { userAnswer: answerIndex, isCorrect }
            })
        } else {
            await prisma.sessionQuestion.create({
                data: {
                    mockSessionId: sessionId,
                    questionId,
                    userAnswer: answerIndex,
                    isCorrect
                }
            })
        }

        return { success: true }
    } catch (error) {
        return { success: false }
    }
}

/**
 * Finalizes the mock session, calculates score, and updates stats.
 */
export async function submitMockTest(
    subjectId: string,
    answers: Record<string, number>,
    timeLeft: number,
    sessionId?: string
) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    let mockSessionId = sessionId

    // If no existing server-authoritative session provided or it was offline fallback, create one
    if (!mockSessionId || mockSessionId.startsWith("mock_offline_")) {
        try {
            const created = await prisma.mockSession.create({
                data: {
                    userId: session.user.id,
                    subjectId,
                    timeSpent: (45 * 60) - timeLeft,
                    score: 0,
                    completed: false
                }
            })
            mockSessionId = created.id
        } catch {
            mockSessionId = `mock_completed_${Date.now()}`
        }
    }

    let totalScore = 0
    let correctCount = 0
    let incorrectCount = 0

    // Fetch questions to verify answers
    let questions: any[] = []
    try {
        questions = await prisma.question.findMany({
            where: { id: { in: Object.keys(answers) } }
        })
    } catch {}

    const questionMap = new Map(questions.map(q => [q.id, q]))
    const sessionQuestionsData: any[] = []

    for (const [qId, userAns] of Object.entries(answers)) {
        const question = questionMap.get(qId)
        const isCorrect = question ? question.correctOption === userAns : true

        if (isCorrect) {
            totalScore += 5
            correctCount++
        } else {
            totalScore -= 1
            incorrectCount++
        }

        sessionQuestionsData.push({
            mockSessionId,
            questionId: qId,
            userAnswer: userAns,
            isCorrect,
            timeSpent: 0
        })

        // Update UserQuestionHistory so mock mistakes land in Mistake Bank
        try {
            await prisma.userQuestionHistory.upsert({
                where: {
                    userId_questionId: {
                        userId: session.user.id,
                        questionId: qId
                    }
                },
                update: {
                    isCorrect,
                    lastAttempted: new Date(),
                    occurrences: { increment: 1 }
                },
                create: {
                    userId: session.user.id,
                    questionId: qId,
                    isCorrect,
                    lastAttempted: new Date(),
                    occurrences: 1
                }
            })
        } catch {}
    }

    // Upsert / batch create session questions and update session
    try {
        if (!mockSessionId.startsWith("mock_")) {
            // Delete previously recorded draft answers to avoid duplicates on batch update
            await prisma.sessionQuestion.deleteMany({
                where: { mockSessionId }
            })

            await prisma.sessionQuestion.createMany({
                data: sessionQuestionsData
            })

            await prisma.mockSession.update({
                where: { id: mockSessionId },
                data: {
                    score: totalScore,
                    timeSpent: (45 * 60) - timeLeft,
                    completed: true,
                    endTime: new Date()
                }
            })

            // Update user performance summary (Per Subject)
            const stats = await prisma.userPerformanceSummary.upsert({
                where: { userId_subjectId: { userId: session.user.id, subjectId } },
                update: {
                    totalAttempted: { increment: correctCount + incorrectCount },
                    totalCorrect: { increment: correctCount },
                },
                create: {
                    userId: session.user.id,
                    subjectId,
                    totalAttempted: correctCount + incorrectCount,
                    totalCorrect: correctCount,
                    totalAccuracy: (correctCount / Math.max(1, correctCount + incorrectCount)) * 100
                }
            })

            await prisma.userPerformanceSummary.update({
                where: { id: stats.id },
                data: {
                    totalAccuracy: (stats.totalCorrect / Math.max(1, stats.totalAttempted)) * 100
                }
            })
        }
    } catch {
        // Handled silently
    }

    revalidatePath("/dashboard")

    // Trigger achievement checks
    try {
        const { checkAndAwardAchievements } = await import("./achievements")
        await checkAndAwardAchievements(session.user.id)
    } catch {}

    return { sessionId: mockSessionId, score: totalScore, correct: correctCount, incorrect: incorrectCount }
}
