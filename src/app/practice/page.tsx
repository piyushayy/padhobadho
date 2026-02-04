import { Suspense } from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Sparkles, BookOpen, BrainCircuit, RotateCcw } from "lucide-react"
import { PracticeSkeleton } from "@/components/skeletons"
import AppLayout from "@/components/app-layout"
import CourseSelector from "@/components/practice/course-selector"
import { updateUserCourse } from "@/actions/user-course"

async function PracticeSelectionContent() {
    const session = await auth()
    if (!session?.user?.id) return null

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { courseId: true, selectedCourse: true }
    })

    // If user hasn't selected a course, show the selector
    if (!user?.courseId) {
        const courses = await prisma.course.findMany({ orderBy: { name: "asc" } })
        return <CourseSelector courses={courses} />
    }

    // Fetch subjects linked to the selected course
    const subjects = await prisma.subject.findMany({
        where: {
            courses: {
                some: { id: user.courseId }
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> Targeted Practice
                    </div>
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-foreground leading-[1.1] mb-2">
                            {user.selectedCourse?.name || "Your Course"}
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjects.length === 0 ? (
                    <div className="col-span-full py-24 border-2 border-dashed border-border rounded-[3rem] text-center bg-accent/20">
                        <BookOpen className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 opacity-40 text-muted-foreground" />
                        <p className="font-bold text-muted-foreground">No subjects found for this course.</p>
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
