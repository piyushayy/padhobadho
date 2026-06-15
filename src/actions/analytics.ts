import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

/**
 * Calculates Topic Mastery for a student.
 */
export async function getTopicMastery() {
    const session = await auth()
    if (!session?.user?.id) return []

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { targetExamId: true }
    })

    const history = await prisma.userQuestionHistory.findMany({
        where: {
            userId: session.user.id,
            question: {
                subject: {
                    exams: {
                        some: { id: user?.targetExamId || "" }
                    }
                }
            }
        },
        include: {
            question: {
                select: {
                    subject: {
                        select: { name: true }
                    }
                }
            }
        }
    })

    if (history.length === 0) return []

    const subjectStats: Record<string, { total: number; correct: number }> = {}

    history.forEach((entry) => {
        const subjectName = entry.question.subject.name
        if (!subjectStats[subjectName]) {
            subjectStats[subjectName] = { total: 0, correct: 0 }
        }
        subjectStats[subjectName].total += (entry.occurrences || 1)
        if (entry.isCorrect) subjectStats[subjectName].correct++
    })

    return Object.entries(subjectStats).map(([name, stats]) => ({
        subject: name,
        percentage: Math.round((stats.correct / stats.total) * 100),
        totalAttempts: stats.total
    }))
}

/**
 * Calculates Exam Readiness.
 */
export async function getExamReadiness() {
    const session = await auth()
    if (!session?.user?.id) return 0

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { targetExamId: true }
    })

    const [totalQuestions, attemptedEntryCount, correctEntryCount] = await Promise.all([
        prisma.question.count({
            where: {
                subject: {
                    exams: { some: { id: user?.targetExamId || "" } }
                }
            }
        }),
        prisma.userQuestionHistory.count({
            where: {
                userId: session.user.id,
                question: {
                    subject: {
                        exams: { some: { id: user?.targetExamId || "" } }
                    }
                }
            }
        }),
        prisma.userQuestionHistory.count({
            where: {
                userId: session.user.id,
                isCorrect: true,
                question: {
                    subject: {
                        exams: { some: { id: user?.targetExamId || "" } }
                    }
                }
            }
        })
    ])

    if (attemptedEntryCount === 0) return 0

    const accuracy = correctEntryCount / attemptedEntryCount
    const coverage = attemptedEntryCount / totalQuestions

    // 70% weight on accuracy, 30% on coverage
    const readiness = (accuracy * 0.7) + (coverage * 0.3)

    return Math.min(Math.round(readiness * 100), 100)
}
