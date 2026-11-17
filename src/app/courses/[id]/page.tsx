import { auth } from "@/auth"
import AppLayout from "@/components/app-layout"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCourseCurriculum } from "@/actions/lessons"
import {
    BookOpen,
    CheckCircle2,
    Circle,
    Clock,
    PlayCircle,
    ArrowRight,
    Sparkles,
    ChevronLeft,
    Flame
} from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const curriculum = await getCourseCurriculum(id)
    return {
        title: curriculum ? `${curriculum.name} | PadhoBadho Courses` : "Course Syllabus | PadhoBadho",
        description: curriculum?.description || "Master chapters with comprehensive theory and instant practice questions."
    }
}

export default async function SingleCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
    const curriculum = await getCourseCurriculum(id)

    if (!curriculum) notFound()

    return (
        <AppLayout session={session}>
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-500">
                {/* Breadcrumbs */}
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" /> All Courses
                </Link>

                {/* Hero Banner */}
                <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="w-3.5 h-3.5" /> Free Certified Curriculum
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-foreground">
                            {curriculum.name}
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-3xl">
                            {curriculum.description}
                        </p>
                    </div>

                    {/* Progress & Next Lesson CTA Card */}
                    <div className="bg-muted/40 border border-border/60 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-2 flex-1 w-full md:w-auto">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-muted-foreground font-mono uppercase tracking-wider">
                                    Overall Syllabus Completion
                                </span>
                                <span className="text-primary font-black text-sm">
                                    {curriculum.progressPercent}%
                                </span>
                            </div>
                            <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-border/60">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-700"
                                    style={{ width: `${curriculum.progressPercent}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {curriculum.completedCount} of {curriculum.totalLessons} lessons completed · {curriculum.totalLessons - curriculum.completedCount} remaining
                            </p>
                        </div>

                        {curriculum.nextLessonId && (
                            <Link
                                href={`/courses/${curriculum.id}/lessons/${curriculum.nextLessonId}`}
                                className="px-6 py-3.5 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-xl inline-flex items-center gap-2 hover:scale-105 shadow-xl shadow-primary/25 transition-all shrink-0 w-full md:w-auto justify-center"
                            >
                                <PlayCircle className="w-4 h-4" />
                                {curriculum.progressPercent === 0 ? "Start First Lesson" : "Resume: Next Lesson"}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Chapters & Lessons Syllabus Accordion */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-border/40 pb-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">
                            Course Syllabus & Chapters
                        </h2>
                        <span className="text-xs font-bold text-muted-foreground">
                            {curriculum.chapters.length} Chapters
                        </span>
                    </div>

                    <div className="space-y-6">
                        {curriculum.chapters.map((chapter, chIdx) => (
                            <div
                                key={chapter.id}
                                className="bg-card border border-border/70 rounded-2xl overflow-hidden shadow-sm"
                            >
                                <div className="p-5 md:p-6 bg-muted/20 border-b border-border/50">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                                Chapter {chIdx + 1}
                                            </span>
                                            <h3 className="text-lg md:text-xl font-bold text-foreground">
                                                {chapter.title}
                                            </h3>
                                            {chapter.description && (
                                                <p className="text-xs md:text-sm text-muted-foreground">
                                                    {chapter.description}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-muted-foreground shrink-0">
                                            {chapter.lessons.length} lessons
                                        </span>
                                    </div>
                                </div>

                                <div className="divide-y divide-border/40">
                                    {chapter.lessons.map(lesson => (
                                        <Link
                                            key={lesson.id}
                                            href={`/courses/${curriculum.id}/lessons/${lesson.id}`}
                                            className="p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                {lesson.completed ? (
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 group-hover:text-primary transition-colors">
                                                        <Circle className="w-4 h-4" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                                        {lesson.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                        <span className="inline-flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {lesson.durationMin} mins
                                                        </span>
                                                        <span>·</span>
                                                        <span className="text-primary/80 font-medium">Theory + KaTeX Formulas</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                                                <span>{lesson.completed ? "Review" : "Learn"}</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Practice CTA */}
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-emerald-500/5 to-transparent border border-primary/25 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold font-serif text-foreground">
                            Ready to test your concept retention?
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xl">
                            Jump straight into timed MCQ drill sessions with instant step-by-step explanations for this subject.
                        </p>
                    </div>
                    <Link
                        href="/practice"
                        className="px-6 py-3.5 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all shrink-0 shadow-lg shadow-primary/20"
                    >
                        Start Practice Drills
                    </Link>
                </div>
            </div>
        </AppLayout>
    )
}
