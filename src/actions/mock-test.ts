"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitMockTest(subjectId: string, answers: Record<string, number>, timeLeft: number) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // 1. Create a MockSession record
    const mockSession = await prisma.mockSession.create({
        data: {
            userId: session.user.id,
            subjectId,
            timeSpent: (45 * 60) - timeLeft,
            score: 0, // Will update below
        }
    })

    let totalScore = 0
    let correctCount = 0
    let incorrectCount = 0
    let unattemptedCount = 0

    // 2. Fetch questions to verify answers
    const questions = await prisma.question.findMany({
        where: { id: { in: Object.keys(answers) } }
    })

    const questionMap = new Map(questions.map(q => [q.id, q]))

    const sessionQuestionsData = []

    for (const [qId, userAns] of Object.entries(answers)) {
        const question = questionMap.get(qId)
        if (!question) continue

        const isCorrect = question.correctOption === userAns
        if (isCorrect) {
            totalScore += 5
            correctCount++
        } else {
            totalScore -= 1
            incorrectCount++
        }

        sessionQuestionsData.push({
            mockSessionId: mockSession.id,
            questionId: qId,
            userAnswer: userAns,
            isCorrect,
            timeSpent: 0 // Could potentially track per-question time in future
        })
    }

    // 3. Batch create session questions
    await prisma.sessionQuestion.createMany({
        data: sessionQuestionsData
    })

    // 4. Update the session with final score
    const finalSession = await prisma.mockSession.update({
        where: { id: mockSession.id },
        data: { score: totalScore }
    })

    // 5. Update user performance summary (Per Subject)
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
            totalAccuracy: (correctCount / (correctCount + incorrectCount)) * 100
        }
    })

    // Recalculate accuracy for the summary
    await prisma.userPerformanceSummary.update({
        where: { id: stats.id },
        data: {
            totalAccuracy: (stats.totalCorrect / stats.totalAttempted) * 100
        }
    })

    revalidatePath("/dashboard")

    // Trigger achievement checks
    const { checkAndAwardAchievements } = await import("./achievements")
    await checkAndAwardAchievements(session.user.id)

    return { sessionId: finalSession.id, score: totalScore, correct: correctCount, incorrect: incorrectCount }
}
