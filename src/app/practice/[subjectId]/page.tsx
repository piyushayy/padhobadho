import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import PracticeEngine from "@/components/practice-engine"
import { createPracticeSession } from "@/actions/practice"

const DEFAULT_PRACTICE_QUESTIONS = [
    {
        id: "q-demo-1",
        content: "What is the dimensional formula of Planck's Constant (h)?",
        options: ["[ML²T⁻¹]", "[MLT⁻¹]", "[ML²T⁻²]", "[ML⁻¹T⁻²]"],
        correctOption: 0,
        explanation: "Energy of a photon E = hν. Therefore, h = E/ν = [ML²T⁻²] / [T⁻¹] = [ML²T⁻¹]."
    },
    {
        id: "q-demo-2",
        content: "Which of the following compounds exhibits optical isomerism?",
        options: ["Lactic acid", "Acetic acid", "Formic acid", "Propionic acid"],
        correctOption: 0,
        explanation: "Lactic acid (2-hydroxypropanoic acid) contains a chiral carbon atom bonded to four different groups: -H, -OH, -CH3, and -COOH."
    },
    {
        id: "q-demo-3",
        content: "What is the derivative of f(x) = ln(sin x) with respect to x?",
        options: ["cot x", "tan x", "-cot x", "sec x"],
        correctOption: 0,
        explanation: "Using the chain rule: d/dx[ln(sin x)] = (1/sin x) * d/dx(sin x) = (cos x) / (sin x) = cot x."
    },
    {
        id: "q-demo-4",
        content: "During which phase of meiosis does crossing over take place?",
        options: ["Pachytene", "Leptotene", "Zygotene", "Diplotene"],
        correctOption: 0,
        explanation: "Crossing over (exchange of genetic material between non-sister chromatids) occurs during the Pachytene stage of Prophase I in Meiosis."
    },
    {
        id: "q-demo-5",
        content: "If the ratio of speed of two trains is 7:8 and the second train covers 400 km in 4 hours, what is the speed of the first train?",
        options: ["87.5 km/h", "75 km/h", "70 km/h", "80 km/h"],
        correctOption: 0,
        explanation: "Speed of second train = 400 km / 4 h = 100 km/h. Since ratio is 7:8, speed of first train = (7/8) * 100 = 87.5 km/h."
    }
]

export default async function PracticeSessionPage({
    params
}: {
    params: Promise<{ subjectId: string }>
}) {
    const session = await auth()
    const isGuest = !session?.user?.id
    const { subjectId } = await params

    let subject: any = null
    let initialQuestions: any[] = []
    let sessionId = "guest-session"

    try {
        subject = await prisma.subject.findUnique({
            where: { id: subjectId }
        })

        let excludeIds: string[] = []
        if (!isGuest && session?.user?.id) {
            const mastered = await prisma.userQuestionHistory.findMany({
                where: {
                    userId: session.user.id,
                    isCorrect: true,
                },
                select: { questionId: true }
            })
            excludeIds = mastered.map(m => m.questionId)
        }

        const TAKE_COUNT = isGuest ? 5 : 15

        const candidateQuestions = await prisma.question.findMany({
            where: {
                subjectId,
                id: excludeIds.length > 0 ? { notIn: excludeIds } : undefined
            },
            select: { id: true },
            take: 500
        })

        if (candidateQuestions.length > 0) {
            const shuffledIds = candidateQuestions
                .map(q => q.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, TAKE_COUNT)

            initialQuestions = await prisma.question.findMany({
                where: { id: { in: shuffledIds } }
            })
        }

        if (!isGuest && session?.user?.id) {
            sessionId = await createPracticeSession(subjectId)
        }
    } catch (error) {
        console.warn("Database notice: serving fallback practice drill", error)
    }

    const questionsToServe = initialQuestions.length > 0
        ? initialQuestions.map(q => ({
            id: q.id,
            content: q.content,
            options: Array.isArray(q.options) ? q.options as string[] : [],
            explanation: q.explanation || undefined,
            correctOption: q.correctOption
        }))
        : DEFAULT_PRACTICE_QUESTIONS

    const subjectName = subject?.name || (subjectId ? subjectId.replace(/^sub-/, "").toUpperCase() : "Practice Drill")

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black py-10">
            <PracticeEngine
                sessionId={sessionId}
                subjectId={subjectId}
                subjectName={subjectName}
                isGuest={isGuest}
                freeLimit={5}
                initialQuestions={questionsToServe}
            />
        </div>
    )
}
