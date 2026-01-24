import { Suspense } from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Sparkles, BookOpen, BrainCircuit } from "lucide-react"
import { PracticeSkeleton } from "@/components/skeletons"
import AppLayout from "@/components/app-layout"

async function PracticeSelectionContent() {
    const session = await auth()
    if (!session?.user?.id) return null

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { targetExamId: true }
    })

    const subjects = await prisma.subject.findMany({
        where: {
            exams: {
                some: { id: user?.targetExamId || "" }
            }
        },
        include: {
            _count: {
                select: { questions: true }
            }
        }
    })

    return (
        <div className="space-y-16 animate-in fade-in duration-700">
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" /> New adaptive trial available
                </div>
                <h2 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-foreground leading-[1.1]">
                    What do you want to <br />
                    <span className="text-primary italic">master</span> today?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                    Choose a subject to start a 15-question adaptive practice session.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjects.length === 0 ? (
                    <div className="col-span-full py-24 border-2 border-dashed border-border rounded-[3rem] text-center bg-accent/20">
                        <BookOpen className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 opacity-40 text-muted-foreground" />
                        <p className="font-bold text-muted-foreground">No subjects added yet.</p>
                        <p className="text-sm text-muted-foreground mt-2">Contact admin to populate the question bank.</p>
                    </div>
                ) : (
                    subjects.map((subject) => (
                        <Link
                            key={subject.id}
                            href={`/practice/${subject.id}`}
                            className="brilliant-card group bg-card hover:border-black dark:hover:border-primary flex flex-col justify-between"
                        >
                            <div className="space-y-6">
                                <div className="w-14 h-14 bg-accent text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all shadow-lg shadow-primary/5">
                                    <BrainCircuit className="w-8 h-8" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-serif font-black leading-none">{subject.name}</h3>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">{subject.description}</p>
                                </div>
                            </div>
                            <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
                                <div className="flex flex-col">
                                    <span className="text-xl font-serif font-black tracking-tighter">{subject._count.questions}</span>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Questions</span>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all group-hover:bg-primary group-hover:border-primary group-hover:text-background">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}

export default async function PracticeSelectionPage() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    return (
        <AppLayout session={session}>
            <Suspense fallback={<PracticeSkeleton />}>
                <PracticeSelectionContent />
            </Suspense>
        </AppLayout>
    )
}
