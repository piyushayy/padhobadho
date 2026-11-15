import { Suspense } from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText, Download, ExternalLink, Library, BookOpen, Sparkles } from "lucide-react"
import AppLayout from "@/components/app-layout"
import { Skeleton } from "@/components/skeletons"

export const dynamic = "force-dynamic"

async function ResourcesContent() {
    const session = await auth()
    if (!session?.user?.id) return null

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { targetExamId: true, targetExam: true }
    })

    // If no targetExamId, fallback to first exam
    let examId = user?.targetExamId
    if (!examId) {
        const firstExam = await prisma.exam.findFirst({ select: { id: true } })
        examId = firstExam?.id || ""
    }

    const [subjects, allExams] = await Promise.all([
        prisma.subject.findMany({
            where: {
                exams: {
                    some: { id: examId }
                }
            },
            include: {
                resources: true,
                _count: { select: { questions: true } }
            },
            orderBy: { name: "asc" }
        }),
        prisma.exam.findMany({ orderBy: { name: "asc" } })
    ])

    const activeExam = allExams.find(e => e.id === examId) || user?.targetExam

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                        <Sparkles size={12} /> Free Study Vault
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight mb-2 text-foreground">
                        {activeExam?.name || "Target Exam"} Vault
                    </h1>
                    <p className="text-muted-foreground font-medium text-base md:text-lg">
                        Curated PYQs, handwritten formula sheets, and chapter summaries. 100% free forever.
                    </p>
                </div>
            </div>

            {/* Exam Track Pills */}
            <div className="flex flex-wrap gap-2.5">
                {allExams.map((exam) => {
                    const isSelected = exam.id === examId
                    return (
                        <Link
                            key={exam.id}
                            href={`/resources?exam=${exam.code}`}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                isSelected
                                    ? "bg-primary text-background shadow-md shadow-primary/20 scale-[1.02]"
                                    : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                        >
                            {exam.name}
                        </Link>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {subjects.map((subject) => (
                    <div key={subject.id} className="stat-card p-6 md:p-8 border border-border/50 space-y-6">
                        <div className="flex items-center justify-between border-b border-border/30 pb-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                    <Library size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground">{subject.name}</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {subject.resources.length} free resources • {subject._count.questions} practice questions
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/practice/${subject.id}`}
                                className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                            >
                                Practice Questions &rarr;
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {subject.resources.length === 0 ? (
                                <div className="col-span-full py-6 text-center text-muted-foreground bg-accent/20 rounded-2xl border border-dashed border-border/50">
                                    <p className="font-bold text-sm">Study materials currently being compiled for {subject.name}.</p>
                                    <p className="text-[10px] uppercase tracking-wider mt-1 text-muted-foreground/70">
                                        Admins are uploading verified PYQs & formula notes.
                                    </p>
                                </div>
                            ) : (
                                subject.resources.map((res) => (
                                    <a
                                        key={res.id}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-card hover:bg-accent/50 rounded-2xl border border-border/60 hover:border-primary/40 transition-all group shadow-xs"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                                                {res.type === "PDF" ? <FileText size={16} /> : <ExternalLink size={16} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{res.title}</p>
                                                <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                                    {res.type}
                                                </span>
                                            </div>
                                        </div>
                                        <Download size={14} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                                    </a>
                                ))
                            )}
                        </div>
                    </div>
                ))}

                {subjects.length === 0 && (
                    <div className="py-20 text-center space-y-4 bg-card rounded-[2.5rem] border border-dashed border-border/60 p-8">
                        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40" />
                        <h3 className="text-xl font-bold">No subjects mapped to this track yet</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            Switch your target exam above to explore available resources for Class 12, JEE, NEET, CUET, SSC, or DSSSB.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default async function ResourcesPage() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    return (
        <AppLayout session={session}>
            <Suspense fallback={<div>Loading Library...</div>}>
                <ResourcesContent />
            </Suspense>
        </AppLayout>
    )
}
