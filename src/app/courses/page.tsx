import { auth } from "@/auth"
import AppLayout from "@/components/app-layout"
import Link from "next/link"
import { getCoursesCatalog } from "@/actions/lessons"
import { BookOpen, GraduationCap, CheckCircle2, ArrowRight, Sparkles, Layers } from "lucide-react"

export const metadata = {
    title: "Courses & Curricula | PadhoBadho",
    description: "Structured syllabus courses, chapter breakdowns, and markdown & KaTeX theory lessons with zero fees.",
}

export default async function CoursesPage() {
    const session = await auth()
    const catalog = await getCoursesCatalog()

    return (
        <AppLayout session={session}>
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                            <GraduationCap className="w-4 h-4" /> 100% Free Structured Syllabi
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-foreground">
                            Course Delivery & Lessons
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
                            Master every high-yield chapter step-by-step with formulas, derivations, and instant practice questions.
                        </p>
                    </div>

                    <Link
                        href="/practice"
                        className="px-5 py-3 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 self-start md:self-auto transition-all"
                    >
                        <Sparkles className="w-4 h-4" /> Quick Practice Drills
                    </Link>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {catalog.map(course => (
                        <div
                            key={course.id}
                            className="bg-card border border-border/70 hover:border-primary/50 rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 shadow-sm hover:shadow-xl transition-all group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-muted text-muted-foreground">
                                        {course.chapterCount} Chapters · {course.lessonCount} Lessons
                                    </span>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-serif font-black text-foreground group-hover:text-primary transition-colors">
                                        {course.name}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                        {course.description}
                                    </p>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-muted-foreground">Curriculum Progress</span>
                                        <span className="text-primary">{course.progressPercent}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${course.progressPercent}%` }}
                                        />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        {course.completedCount} of {course.lessonCount} lessons completed
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={`/courses/${course.id}`}
                                className="w-full py-3.5 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-primary/20 transition-all"
                            >
                                {course.progressPercent > 0 ? "Resume Course" : "Explore Syllabus"}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    )
}
