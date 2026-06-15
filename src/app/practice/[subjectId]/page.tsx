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

    try {
        // 1. Validate subject
        const subject = await prisma.subject.findUnique({
            where: { id: subjectId }
        })
        if (!subject) redirect("/practice")

        // 2. Strict Random Logic as requested
        // "User should not see questions they attempted once correctly"
        // "Give them randomly questions"

        // A. Examples of IDs to EXCLUDE (Already solved correctly)
        const mastered = await prisma.userQuestionHistory.findMany({
            where: {
                userId: session.user.id,
                isCorrect: true, // STRICT: If ever solved correctly, exclude it.
                // removed date filter
            },
            select: { questionId: true }
        })
        const excludeIds = mastered.map(m => m.questionId)

        // B. Fetch Random Questions 
        // Since Prisma doesn't support random well, we used raw SQL or map-and-shuffle.
        // For large datasets, raw SQL is better. For small/medium, fetching ID list then random sampling is okay.
        // We'll use a pragmatic approach: Fetch candidate questions (excluding mastered) and shuffle in JS. 
        // Why in JS? Because `NOT IN` with raw SQL and UUIDs can be tricky with Prisma typed raw queries.

        // Step 1: Count available questions
        const count = await prisma.question.count({
            where: {
                subjectId,
                id: { notIn: excludeIds }
            }
        })

        const TAKE_COUNT = 15;

        // Step 2: Fetch efficient implementation
        // If we have many questions, random offset is decent.
        // const skip = Math.max(0, Math.floor(Math.random() * (count - TAKE_COUNT)));

        // However, the user wants TRUE random, not just a random block.
        // Let's fetch the available IDs first, shuffle them, then slice.

        const candidateQuestions = await prisma.question.findMany({
            where: {
                subjectId,
                id: { notIn: excludeIds }
            },
            select: { id: true },
            take: 1000 // Limit to avoid memory issues, assuming <1000 active questions per practice session
        })

        // Shuffle IDs
        const shuffledIds = candidateQuestions
            .map(q => q.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, TAKE_COUNT);

        // Fetch full data for these IDs
        const freshContent = await prisma.question.findMany({
            where: { id: { in: shuffledIds } }
        })


        const initialQuestions = freshContent

        // Create a session in DB
        const sessionId = await createPracticeSession(subjectId)

        if (initialQuestions.length === 0) {
            return (
                <div className="min-h-screen flex items-center justify-center p-8 text-center text-muted-foreground">
                    <div>
                        <h2 className="text-2xl font-serif font-bold mb-2">No Questions Found</h2>
                        <p>You have mastered all available questions for this subject!</p>
                        <p className="text-sm mt-2">Check back later for new content.</p>
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
