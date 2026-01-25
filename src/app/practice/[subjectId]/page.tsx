import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import PracticeEngine from "@/components/practice-engine"
import { createPracticeSession } from "@/actions/practice"

export default async function PracticeSessionPage({
    params
}: {
    params: Promise<{ subjectId: string }>
}) {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    const { subjectId } = await params

    // 1. Validate subject
    const subject = await prisma.subject.findUnique({
        where: { id: subjectId }
    })
    if (!subject) redirect("/practice")

    // 2. Adaptive "Smart Fetch" Logic

    // A. Get questions user has mastered recently (last 7 days) to avoid repetition
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const mastered = await prisma.userQuestionHistory.findMany({
        where: {
            userId: session.user.id,
            isCorrect: true,
            lastAttempted: { gte: sevenDaysAgo }
        },
        select: { questionId: true }
    })
    const masteredIds = mastered.map(m => m.questionId)

    // B. Prioritize Mistakes (questions answered incorrectly)
    const mistakes = await prisma.userQuestionHistory.findMany({
        where: {
            userId: session.user.id,
            isCorrect: false
        },
        select: { questionId: true },
        take: 10
    })
    const mistakeIds = mistakes.map(m => m.questionId)

    // C. Fetch Questions
    // 1. Get up to 5 retry questions (mistakes)
    const retries = mistakeIds.length > 0 ? await prisma.question.findMany({
        where: { id: { in: mistakeIds }, subjectId },
        take: 5
    }) : []

    // 2. Fill the rest with new/unmastered questions
    // We intentionally exclude 'masteredIds' but allow 'mistakeIds' (in case logic A didn't catch them or they are old)
    // However, since we explicitly fetched retries, we might want to exclude those specific IDs from the FILL query to avoid duplicates if possible,
    // though Prisma 'in' vs 'not in' performance varies. Simplest balanced approach:

    const needed = 15 - retries.length
    const freshContent = await prisma.question.findMany({
        where: {
            subjectId,
            id: { notIn: [...masteredIds, ...retries.map(r => r.id)] }
        },
        take: needed,
        orderBy: { difficulty: 'asc' } // Ramp up difficulty naturally
    })

    const initialQuestions = [...retries, ...freshContent]

    // Create a session in DB
    const sessionId = await createPracticeSession(subjectId)

    if (initialQuestions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center text-muted-foreground">
                <div>
                    <h2 className="text-2xl font-serif font-bold mb-2">No Questions Found</h2>
                    <p>Please contact the administrator or check back later.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black py-10">
            <PracticeEngine
                sessionId={sessionId}
                initialQuestions={initialQuestions.map(q => ({
                    id: q.id,
                    content: q.content,
                    options: q.options as string[],
                    explanation: q.explanation || undefined,
                    correctOption: q.correctOption
                }))}
            />
        </div>
    )
}
