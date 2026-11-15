import { Suspense } from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowRight, Sparkles, BookOpen, BrainCircuit, RotateCcw, Flame, CheckCircle2 } from "lucide-react"
import { PracticeSkeleton } from "@/components/skeletons"
import AppLayout from "@/components/app-layout"
import CourseSelector from "@/components/practice/course-selector"
import { updateUserCourse } from "@/actions/user-course"

async function PracticeSelectionContent({ session }: { session: any }) {
    const isGuest = !session?.user?.id

    let user: any = null

    if (!isGuest) {
        user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { courseId: true, selectedCourse: true }
        })

        // If user hasn't selected a course, show the selector
        if (!user?.courseId) {
            const courses = await prisma.course.findMany({ orderBy: { name: "asc" } })
            return <CourseSelector courses={courses} />
        }
    }

    // Fetch subjects linked to the selected course, or all subjects if guest
    const subjects = await prisma.subject.findMany({
        where: !isGuest && user?.courseId ? {
            courses: {
                some: { id: user.courseId }
            }
        } : undefined,
        include: {
            _count: {
                select: { questions: true }
            }
        },
        orderBy: { name: "asc" }
    })

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Guest Welcome Banner */}
            {isGuest ? (
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-emerald-500/5 to-transparent border border-primary/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                    <div className="space-y-2 max-w-xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="w-3.5 h-3.5" /> Free Trial Mode · Like Testbook
                        </div>
                        <h2 className="text-2xl md:text-3xl font-serif font-black text-foreground tracking-tight">
                            Attempt Free Practice Questions Instantly
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Pick any subject below to practice <span className="font-bold text-foreground">5 free questions</span> with real-time feedback, sound effects, and step-by-step explanations — no sign-up required.
                        </p>
                    </div>
                    <Link
                        href="/auth/sign-up?callbackUrl=/practice"
                        className="px-6 py-3.5 bg-primary text-background rounded-xl font-black text-xs uppercase tracking-widest shrink-0 hover:scale-105 transition-all shadow-xl shadow-primary/25"
                    >
                        Sign Up for Unlimited
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" /> Targeted Practice
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-foreground leading-[1.1] mb-2">
                                {user?.selectedCourse?.name || "Your Course"}
                            </h2>
                            <p className="text-lg text-muted-foreground font-medium">
                                Master the subjects required for your goal.
                            </p>
                        </div>
                    </div>

                    <form action={async () => {
                        "use server"
                        await updateUserCourse("") // Reset course
                    }}>
                        <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                            <RotateCcw size={14} /> Change Course
                        </button>
                    </form>
                </div>
            )}

            {/* Habit & Revision Banners - for authenticated users */}
            {!isGuest && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/practice/daily"
                        className="p-5 rounded-2xl bg-card border border-border/80 hover:border-orange-500/50 transition-all flex items-center justify-between group shadow-sm"
                    >
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                                <Flame className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground text-sm group-hover:text-orange-500 transition-colors">Daily Challenge</h4>
                                <p className="text-xs text-muted-foreground">Keep your streak alive · +50 XP</p>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </Link>

                    <Link
                        href="/practice/mistakes"
                        className="p-5 rounded-2xl bg-card border border-border/80 hover:border-rose-500/50 transition-all flex items-center justify-between group shadow-sm"
                    >
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                                <RotateCcw className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground text-sm group-hover:text-rose-500 transition-colors">Mistake Bank</h4>
                                <p className="text-xs text-muted-foreground">Spaced repetition review drill</p>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>
            )}

            {/* Subject Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjects.length === 0 ? (
                    <div className="col-span-full py-24 border-2 border-dashed border-border rounded-[3rem] text-center bg-accent/20">
                        <BookOpen className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 opacity-40 text-muted-foreground" />
                        <p className="font-bold text-muted-foreground">No subjects found.</p>
                        <p className="text-sm text-muted-foreground mt-2">Subjects are being mapped by the admin.</p>
                    </div>
                ) : (
                    subjects.map((subject) => (
                        <Link
                            key={subject.id}
                            href={`/practice/${subject.id}`}
                            className="brilliant-card group bg-card hover:border-black dark:hover:border-primary flex flex-col justify-between"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-14 h-14 bg-accent text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all shadow-lg shadow-primary/5">
                                        <BrainCircuit className="w-8 h-8" strokeWidth={1.5} />
                                    </div>
                                    {isGuest && (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                                            5 Free Questions
                                        </span>
                                    )}
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

    return (
        <AppLayout session={session}>
            <Suspense fallback={<PracticeSkeleton />}>
                <PracticeSelectionContent session={session} />
            </Suspense>
        </AppLayout>
    )
}
