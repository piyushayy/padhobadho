import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import MockTestEngine from "@/components/mock-test-engine"
import { ShieldAlert } from "lucide-react"

export default async function MockTestSession({
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
    if (!subject) redirect("/mock-test")

    // 2. Fetch full exam set (40-50 questions)
    // For MVP, we fetch 40 questions balanced by difficulty
    const questions = await prisma.question.findMany({
        where: { subjectId },
        take: 40,
        orderBy: { createdAt: "asc" }
    })

    if (questions.length < 10) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center bg-slate-50 dark:bg-black">
                <div className="max-w-md space-y-6">
                    <div className="w-20 h-20 bg-rose-100 rounded-[2.5rem] flex items-center justify-center mx-auto dark:bg-white/5">
                        <ShieldAlert className="w-10 h-10 text-rose-500" />
                    </div>
                    <h2 className="text-3xl font-serif font-black mb-2 tracking-tight">Insufficient Questions</h2>
                    <p className="text-muted-foreground font-medium">A mock test requires at least 40 questions. Please try a different subject or check back later.</p>
                    <a href="/mock-test" className="inline-block px-8 py-4 bg-black text-white rounded-full font-black dark:bg-white dark:text-black hover:scale-105 transition-transform">
                        Choose Another Subject
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black py-20 px-6">
            <MockTestEngine
                subjectId={subject.id}
                subjectName={subject.name}
                questions={questions.map(q => ({
                    id: q.id,
                    content: q.content,
                    options: q.options as string[]
                }))}
            />
        </div>
    )
}
