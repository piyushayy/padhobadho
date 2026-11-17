"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { markLessonComplete, LessonItem, ChapterItem } from "@/actions/lessons"
import MarkdownContent from "@/components/markdown-content"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Clock,
    BookOpen,
    ArrowRight,
    ArrowLeft,
    Check
} from "lucide-react"

interface LessonPlayerClientProps {
    course: { id: string; name: string }
    chapter: ChapterItem | null
    lesson: LessonItem
    prevLesson: LessonItem | null
    nextLesson: LessonItem | null
    allLessons: LessonItem[]
}

export function LessonPlayerClient({
    course,
    chapter,
    lesson,
    prevLesson,
    nextLesson,
    allLessons
}: LessonPlayerClientProps) {
    const router = useRouter()
    const [isCompleted, setIsCompleted] = useState(lesson.completed || false)
    const [isPending, setIsPending] = useState(false)

    async function handleComplete() {
        if (isPending) return
        setIsPending(true)

        try {
            const res = await markLessonComplete(course.id, lesson.id)
            if (res.success) {
                setIsCompleted(true)
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.8 }
                })
                toast.success(`Lesson marked complete! +${res.xpEarned || 20} XP earned.`)

                // If next lesson exists, prompt or auto-navigate
                if (nextLesson) {
                    setTimeout(() => {
                        router.push(`/courses/${course.id}/lessons/${nextLesson.id}`)
                    }, 1200)
                }
            }
        } catch (error) {
            toast.error("Could not record progress. Please try again.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Top Navigation Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/50">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">
                        {course.name}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{chapter?.title || "Chapter"}</span>
                </div>

                <div className="flex items-center gap-3">
                    {prevLesson && (
                        <Link
                            href={`/courses/${course.id}/lessons/${prevLesson.id}`}
                            className="px-3 py-1.5 rounded-lg border border-border/80 hover:border-primary/50 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Previous
                        </Link>
                    )}
                    {nextLesson && (
                        <Link
                            href={`/courses/${course.id}/lessons/${nextLesson.id}`}
                            className="px-3 py-1.5 rounded-lg border border-border/80 hover:border-primary/50 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                        >
                            Next <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Main Lesson Body Card */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
                {/* Lesson Header */}
                <div className="space-y-4 border-b border-border/50 pb-6">
                    <div className="flex items-center gap-3 text-xs">
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-black uppercase tracking-wider text-[10px]">
                            Lesson {lesson.order}
                        </span>
                        <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
                            <Clock className="w-3.5 h-3.5" /> {lesson.durationMin} mins read
                        </span>
                        {isCompleted && (
                            <span className="inline-flex items-center gap-1 text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                                <Check className="w-3 h-3" /> Completed
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl md:text-4xl font-serif font-black tracking-tight text-foreground">
                        {lesson.title}
                    </h1>
                </div>

                {/* Markdown + KaTeX Body */}
                <div className="text-foreground leading-relaxed text-base">
                    <MarkdownContent content={lesson.content} />
                </div>

                {/* Completion Action Bar */}
                <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-muted-foreground text-center sm:text-left">
                        {isCompleted
                            ? "You have finished this lesson! Move to the next one or practice drills."
                            : "Click below to mark this lesson as understood and earn +20 XP."}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleComplete}
                            disabled={isPending}
                            className={`px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest inline-flex items-center justify-center gap-2 transition-all shadow-lg w-full sm:w-auto ${
                                isCompleted
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                                    : "bg-primary hover:scale-105 text-primary-foreground shadow-primary/25"
                            }`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {isCompleted ? "Marked as Complete" : isPending ? "Saving..." : "Mark as Complete (+20 XP)"}
                        </button>

                        {nextLesson && (
                            <Link
                                href={`/courses/${course.id}/lessons/${nextLesson.id}`}
                                className="px-5 py-3.5 border border-border/80 hover:border-primary/50 text-foreground font-black text-xs uppercase tracking-widest rounded-xl inline-flex items-center justify-center gap-2 transition-colors shrink-0"
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Practice Link */}
            <div className="bg-muted/30 border border-border/60 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-foreground">Practice Related Questions</h4>
                        <p className="text-xs text-muted-foreground">Drill 5 questions with step-by-step explanations.</p>
                    </div>
                </div>

                <Link
                    href="/practice"
                    className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity shrink-0"
                >
                    Practice Drills
                </Link>
            </div>
        </div>
    )
}
