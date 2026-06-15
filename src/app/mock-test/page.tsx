import { Suspense } from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Clock, ShieldAlert, Zap, ArrowRight, FileText } from "lucide-react"
import AppLayout from "@/components/app-layout"
import { Skeleton } from "@/components/skeletons"

function MockTestSkeleton() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <Skeleton className="h-8 w-32 rounded-full" />
                    <Skeleton className="h-40 w-full rounded-2xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <div className="space-y-4 pt-4">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-64 rounded-xl" />)}
                    </div>
                </div>
                <Skeleton className="h-[500px] w-full rounded-[3.5rem]" />
            </div>
        </div>
    )
}

async function MockTestContent() {
    const session = await auth()
    if (!session?.user?.id) return null

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { targetExam: true }
    })

    const subjects = await prisma.subject.findMany({
        where: {
            exams: {
                some: { id: user?.targetExamId || "" }
            }
        }
    })

    const examCode = user?.targetExam?.code || "CUET"

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                        <Zap size={14} fill="currentColor" /> Exam Mode
                    </div>
                    <h1 className="text-6xl md:text-7xl font-serif font-black tracking-tighter text-foreground leading-[0.9]">
                        Simulate the <br /> <span className="text-primary italic border-b-8 border-primary/10 pb-2">Real Exam.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
                        45 minutes. 40-50 questions. Real CUET (+5/-1) marking system. This is the ultimate test of your preparation.
                    </p>

                    <div className="space-y-4 pt-4">
                        {[
                            { icon: <Clock className="w-5 h-5 text-primary" />, text: "45 Minutes strict countdown" },
                            { icon: <ShieldAlert className="w-5 h-5 text-primary" />, text: "Strict +5/-1 marking logic" },
                            { icon: <FileText className="w-5 h-5 text-primary" />, text: "Exam-accurate difficulty" },
                        ].map((rule, i) => (
                            <div key={i} className="flex items-center gap-4 text-foreground font-bold">
                                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center">
                                    {rule.icon}
                                </div>
                                {rule.text}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-foreground text-background p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 space-y-10">
                        <h3 className="text-3xl font-serif font-black">Choose your Domain</h3>
                        <div className="space-y-4">
                            {subjects.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={`/mock-test/${sub.id}`}
                                    className="flex items-center justify-between p-6 border border-background/20 rounded-3xl hover:bg-primary hover:text-background hover:border-primary group transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-background/10 text-background rounded-2xl flex items-center justify-center group-hover:bg-background group-hover:text-primary transition-all">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <span className="text-xl font-bold tracking-tight">{sub.name}</span>
                                    </div>
                                    <ArrowRight className="w-6 h-6 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" strokeWidth={3} />
                                </Link>
                            ))}
                            {subjects.length === 0 && (
                                <p className="text-background/60 italic font-medium">No subjects available for testing.</p>
                            )}
                        </div>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
                </div>
            </div>
        </div>
    )
}

export default async function MockTestLanding() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    return (
        <AppLayout session={session}>
            <Suspense fallback={<MockTestSkeleton />}>
                <MockTestContent />
            </Suspense>
        </AppLayout>
    )
}
