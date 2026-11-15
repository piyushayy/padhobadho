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
    const isGuest = !session?.user?.id
    const { subjectId } = await params

    try {
        // 1. Validate subject
        const subject = await prisma.subject.findUnique({
            where: { id: subjectId }
        })
        if (!subject) redirect("/practice")

        // 2. Questions filtering
        let excludeIds: string[] = []

        if (!isGuest) {
            const mastered = await prisma.userQuestionHistory.findMany({
                where: {
                    userId: session.user.id,
                    isCorrect: true,
                },
                select: { questionId: true }
            })
            excludeIds = mastered.map(m => m.questionId)
        }

        // Limit to 5 free trial questions for guests, 15 for registered users
        const TAKE_COUNT = isGuest ? 5 : 15

        const candidateQuestions = await prisma.question.findMany({
            where: {
                subjectId,
                id: excludeIds.length > 0 ? { notIn: excludeIds } : undefined
            },
            select: { id: true },
            take: 500
        })

        // Shuffle IDs
        const shuffledIds = candidateQuestions
            .map(q => q.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, TAKE_COUNT)

        // Fetch full data for these IDs
        const initialQuestions = await prisma.question.findMany({
            where: { id: { in: shuffledIds } }
        })

        // Create a session in DB for logged-in user, or use guest token
        let sessionId = "guest-session"
        if (!isGuest) {
            sessionId = await createPracticeSession(subjectId)
        }

        if (initialQuestions.length === 0) {
            return (
                <div className="min-h-screen flex items-center justify-center p-8 text-center text-muted-foreground">
                    <div>
                        <h2 className="text-2xl font-serif font-bold mb-2">No Questions Found</h2>
                        <p>{isGuest ? "No questions available for this subject yet." : "You have mastered all available questions for this subject!"}</p>
                        <p className="text-sm mt-2">Check back later or choose another subject.</p>
                    </div>
                </div>
            )
        }

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black py-10">
                <PracticeEngine
                    sessionId={sessionId}
                    subjectId={subjectId}
                    subjectName={subject.name}
                    isGuest={isGuest}
                    freeLimit={5}
                    initialQuestions={initialQuestions.map(q => ({
                        id: q.id,
                        content: q.content,
                        options: Array.isArray(q.options) ? q.options as string[] : [],
                        explanation: q.explanation || undefined,
                        correctOption: q.correctOption
                    }))}
                />
            </div>
        )
    } catch (error) {
        console.error("Practice Page Error:", error)
        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center text-destructive">
                <div>
                    <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                    <p>We couldn't load the practice session.</p>
                </div>
            </div>
        )
    }
}
