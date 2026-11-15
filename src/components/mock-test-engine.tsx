"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ArrowRight, ChevronLeft, Timer, ShieldAlert, Flag, Loader2, BookmarkCheck } from "lucide-react"
import { submitMockTest } from "@/actions/mock-test"
import { useRouter } from "next/navigation"

interface Question {
    id: string
    content: string
    options: string[]
}

export default function MockTestEngine({
    subjectId,
    subjectName,
    questions
}: {
    subjectId: string
    subjectName: string
    questions: Question[]
}) {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [markedReview, setMarkedReview] = useState<Record<string, boolean>>({})
    const [visited, setVisited] = useState<Record<string, boolean>>({ [questions[0]?.id || ""]: true })
    const [timeLeft, setTimeLeft] = useState(45 * 60)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (timeLeft <= 0) {
            handleAutoSubmit()
            return
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const handleAutoSubmit = async () => {
        await handleSubmit()
    }

    const handleSubmit = async () => {
        if (isSubmitting) return
        setIsSubmitting(true)
        try {
            const result = await submitMockTest(subjectId, answers, timeLeft)
            router.push(`/mock-test/results/${result.sessionId}`)
            toast.success("Exam submitted successfully!")
        } catch (err) {
            toast.error("Submission failed. Please try again.")
            setIsSubmitting(false)
        }
    }

    const handleAnswer = (optionIndex: number) => {
        if (isSubmitting) return
        const qId = questions[currentIndex].id
        setAnswers(prev => ({
            ...prev,
            [qId]: optionIndex
        }))
    }

    const toggleMarkForReview = () => {
        const qId = questions[currentIndex].id
        setMarkedReview(prev => {
            const next = { ...prev, [qId]: !prev[qId] }
            if (next[qId]) {
                toast.info("Question marked for review", { duration: 1500 })
            }
            return next
        })
    }

    const navigateTo = (index: number) => {
        if (isSubmitting) return
        setCurrentIndex(index)
        const targetQ = questions[index]?.id
        if (targetQ) {
            setVisited(prev => ({ ...prev, [targetQ]: true }))
        }
    }

    const currentQuestion = questions[currentIndex]

    // Calculate Palette Stats
    const answeredCount = Object.keys(answers).length
    const markedCount = Object.values(markedReview).filter(Boolean).length

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Left Area: Question Content */}
            <div className="flex-1 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-black uppercase tracking-widest text-primary">CBT Exam Mode</span>
                        <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-foreground">{subjectName} Mock Test</h1>
                    </div>
                    <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border-2 font-mono font-black text-base transition-all self-start sm:self-auto ${timeLeft < 300 ? "border-rose-500 text-rose-500 animate-pulse bg-rose-500/10" : "border-border bg-card text-foreground shadow-xs"
                        }`}>
                        <Timer className="w-4 h-4 text-primary" /> {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="brilliant-card flex flex-col justify-between p-6 md:p-8 bg-card border border-border/50 shadow-xl rounded-[2rem]">
                    <div>
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Question <span className="text-primary text-sm">{currentIndex + 1}</span> / {questions.length}
                            </span>
                            <button
                                type="button"
                                onClick={toggleMarkForReview}
                                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                                    markedReview[currentQuestion.id]
                                        ? "bg-purple-500/10 text-purple-600 border-purple-500/30 dark:text-purple-400"
                                        : "bg-muted text-muted-foreground border-border hover:text-foreground"
                                }`}
                            >
                                <BookmarkCheck size={14} />
                                {markedReview[currentQuestion.id] ? "Marked for Review" : "Mark for Review"}
                            </button>
                        </div>

                        <h2 className="text-xl md:text-2xl font-serif font-bold leading-relaxed mb-8 text-foreground">{currentQuestion.content}</h2>

                        <div className="grid gap-3.5">
                            {currentQuestion.options.map((opt, i) => {
                                const isSelected = answers[currentQuestion.id] === i
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleAnswer(i)}
                                        className={`w-full p-4 md:p-5 text-left rounded-2xl border-2 transition-all flex items-center gap-3.5 font-medium text-base group cursor-pointer ${isSelected
                                            ? "border-primary bg-primary/10 ring-2 ring-primary/20 scale-[1.005]"
                                            : "hover:bg-muted/40 border-border/60 bg-muted/10 hover:border-border"
                                            }`}
                                    >
                                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${isSelected ? "bg-primary text-background shadow-sm" : "bg-card border border-border text-muted-foreground group-hover:border-primary/40"
                                            }`}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        <span className={`flex-1 font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>{opt}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-10 mt-8 border-t border-border/40">
                        <button
                            disabled={currentIndex === 0 || isSubmitting}
                            onClick={() => navigateTo(currentIndex - 1)}
                            className="px-6 py-3.5 bg-muted rounded-full font-black uppercase text-xs tracking-wider disabled:opacity-30 hover:bg-muted/80 transition-all flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                disabled={isSubmitting}
                                onClick={() => {
                                    if (currentIndex < questions.length - 1) {
                                        navigateTo(currentIndex + 1)
                                    } else {
                                        handleSubmit()
                                    }
                                }}
                                className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-black text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 cursor-pointer uppercase tracking-wider"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                                    {currentIndex === questions.length - 1 ? "Submit Exam" : "Save & Next"}
                                    <ArrowRight className="w-4 h-4" strokeWidth={3} />
                                </>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Area: Question Palette (Testbook / NTA Style) */}
            <aside className="w-full lg:w-80 space-y-6">
                <div className="stat-card p-6 border border-border/60">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40">
                        <h3 className="text-base font-serif font-black text-foreground">Question Palette</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                            {answeredCount}/{questions.length} Answered
                        </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto p-1 custom-scrollbar">
                        {questions.map((q, i) => {
                            const isAnswered = answers[q.id] !== undefined
                            const isMarked = markedReview[q.id]
                            const isCurrent = currentIndex === i
                            const isVisited = visited[q.id]

                            let styleClass = "bg-muted text-muted-foreground border-transparent"
                            if (isCurrent) {
                                styleClass = "border-primary bg-primary/20 text-primary ring-2 ring-primary/30"
                            } else if (isMarked) {
                                styleClass = "bg-purple-600 text-white border-purple-600 font-bold"
                            } else if (isAnswered) {
                                styleClass = "bg-emerald-500 text-white border-emerald-500 font-bold"
                            } else if (isVisited) {
                                styleClass = "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400"
                            }

                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => navigateTo(i)}
                                    className={`w-full aspect-square rounded-xl text-xs font-black transition-all flex items-center justify-center border-2 cursor-pointer ${styleClass}`}
                                >
                                    {i + 1}
                                </button>
                            )
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 pt-4 border-t border-border/40 grid grid-cols-2 gap-2.5 text-[11px] font-bold">
                        <div className="flex items-center gap-2 text-foreground">
                            <span className="w-3 h-3 bg-emerald-500 rounded-sm" /> Answered ({answeredCount})
                        </div>
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                            <span className="w-3 h-3 bg-purple-600 rounded-sm" /> Review ({markedCount})
                        </div>
                        <div className="flex items-center gap-2 text-rose-500">
                            <span className="w-3 h-3 bg-rose-500/30 rounded-sm" /> Visited
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="w-3 h-3 bg-muted rounded-sm" /> Not Visited
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-3xl shadow-xl shadow-rose-500/10 space-y-2">
                    <h4 className="font-bold text-sm flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> Exam In-Progress
                    </h4>
                    <p className="text-xs opacity-90 leading-relaxed font-medium">
                        Timer will automatically submit your exam at 00:00. Do not close or refresh this tab.
                    </p>
                </div>
            </aside>
        </div>
    )
}
