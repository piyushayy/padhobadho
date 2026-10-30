import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Trophy, CheckCircle2, XCircle } from "lucide-react"

export default async function MockTestResults({
    params
}: {
    params: Promise<{ sessionId: string }>
}) {
    const session = await auth()
    if (!session?.user?.id) redirect("/auth/sign-in")

    const { sessionId } = await params

    const mockSession = await prisma.mockSession.findUnique({
        where: { id: sessionId },
        include: {
            subject: true,
            questions: {
                include: { question: true }
            }
        }
    })

    // IDOR Protection: only allow owner or admin
    if (!mockSession || (mockSession.userId !== session.user.id && session.user.role !== "ADMIN")) {
        redirect("/dashboard")
    }

    const correct = mockSession.questions.filter(q => q.isCorrect).length
    const total = mockSession.questions.length
    const accuracy = total > 0 ? (correct / total) * 100 : 0

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-primary/10 text-primary rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                        <Trophy className="w-12 h-12" />
                    </div>
                    <h1 className="text-5xl font-serif font-black tracking-tight">Test Results</h1>
                    <p className="text-xl text-muted-foreground font-medium uppercase tracking-widest">{mockSession.subject.name} Simulation</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-8">
                    <div className="brilliant-card bg-card flex flex-col items-center justify-center text-center py-12">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Total Score</p>
                        <p className="text-6xl font-serif font-black text-primary">{mockSession.score}</p>
                        <p className="text-xs font-bold text-muted-foreground mt-4">CUET SCALE (+5/-1)</p>
                    </div>
                    <div className="brilliant-card bg-card flex flex-col items-center justify-center text-center py-12">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Accuracy</p>
                        <p className="text-6xl font-serif font-black">{accuracy.toFixed(0)}%</p>
                        <p className="text-xs font-bold text-muted-foreground mt-4">{correct} / {total} Correct</p>
                    </div>
                    <div className="brilliant-card bg-card flex flex-col items-center justify-center text-center py-12">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Time Spent</p>
                        <p className="text-6xl font-serif font-black italic">{Math.floor(mockSession.timeSpent / 60)}m</p>
                        <p className="text-xs font-bold text-muted-foreground mt-4">OF 45 MINUTES</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/dashboard" className="px-12 py-5 bg-foreground text-background rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl">
                        Go to Dashboard
                    </Link>
                    <Link href="/practice" className="px-12 py-5 bg-muted text-foreground rounded-full font-black text-xl hover:bg-muted/80 transition-all shadow-xl">
                        Review Sub-topics
                    </Link>
                </div>

                {/* Questions Summary */}
                <div className="space-y-8 pt-12">
                    <h3 className="text-3xl font-serif font-black tracking-tight">Answer Review</h3>
                    <div className="grid gap-4">
                        {mockSession.questions.map((sq, i) => (
                            <div key={sq.id} className="brilliant-card bg-card flex items-start justify-between group">
                                <div className="space-y-3 max-w-2xl text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Question {i + 1}</span>
                                        {sq.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                                    </div>
                                    <p className="text-xl font-bold tracking-tight leading-snug">{sq.question.content}</p>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {sq.question.options && Array.isArray(sq.question.options) && (sq.question.options as string[]).map((opt, optIdx) => (
                                            <span key={optIdx} className={`px-4 py-2 rounded-xl text-xs font-bold border ${optIdx === sq.question.correctOption ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" :
                                                optIdx === sq.userAnswer && !sq.isCorrect ? "bg-rose-500/10 border-rose-500/20 text-rose-600" :
                                                    "bg-muted/40 border-transparent text-muted-foreground"
                                                }`}>
                                                {opt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
