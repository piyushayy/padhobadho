import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import PracticeEngine from "@/components/practice-engine"
import { createPracticeSession } from "@/actions/practice"
import { shuffleArray } from "@/lib/utils"

export default async function PracticeSessionPage({
    params
}: {
    params: Promise<{ subjectId: string }>
}) {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    const { subjectId } = await params

    let subject = null
    let freshContent: { id: string; content: string; options: unknown }[] = []
    let sessionId = ""
    let loadFailed = false

    try {
        subject = await prisma.subject.findUnique({
            where: { id: subjectId }
        })
        if (!subject) redirect("/practice")

        // Exclude questions already solved correctly
        const mastered = await prisma.userQuestionHistory.findMany({
            where: {
                userId: session.user.id,
                isCorrect: true,
            },
            select: { questionId: true }
        })
        const excludeIds = mastered.map(m => m.questionId)

        const TAKE_COUNT = 15

        // Fetch candidate question IDs
        const candidateQuestions = await prisma.question.findMany({
            where: {
                subjectId,
                id: { notIn: excludeIds }
            },
            select: { id: true },
            take: 1000
        })

        // Shuffle candidate IDs safely using utility
        const shuffledIds = shuffleArray(candidateQuestions.map(q => q.id)).slice(0, TAKE_COUNT)

        // Fetch question text and options only (anti-cheat: do NOT fetch correctOption/explanation)
        freshContent = await prisma.question.findMany({
            where: { id: { in: shuffledIds } },
            select: {
                id: true,
                content: true,
                options: true
            }
        })

        sessionId = await createPracticeSession(subjectId)
    } catch (error) {
        console.error("Practice Page Error:", error)
        loadFailed = true
    }

    if (loadFailed) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center text-destructive bg-background">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Unable to load practice session</h2>
                    <p className="text-muted-foreground">Please try selecting another subject or retry shortly.</p>
                    <Link
                        href="/practice"
                        className="inline-block px-6 py-2.5 bg-foreground text-background rounded-xl font-bold"
                    >
                        Back to Practice
                    </Link>
                </div>
            </div>
        )
    }

    if (freshContent.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center text-muted-foreground bg-background">
                <div className="max-w-md space-y-4">
                    <h2 className="text-3xl font-serif font-bold text-foreground">Topic Mastered!</h2>
                    <p>You have mastered all available questions for this subject. Excellent dedication!</p>
                    <Link
                        href="/practice"
                        className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity"
                    >
                        Explore Other Subjects
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black py-10">
            <PracticeEngine
                sessionId={sessionId}
                initialQuestions={freshContent.map(q => ({
                    id: q.id,
                    content: q.content,
                    options: Array.isArray(q.options) ? q.options as string[] : [],
                }))}
            />
        </div>
    )
}
