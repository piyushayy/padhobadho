"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { ArrowRight, ChevronLeft, Timer, ShieldAlert, Flag, Loader2 } from "lucide-react"
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
    const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes in seconds
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
        setAnswers(prev => ({
            ...prev,
            [questions[currentIndex].id]: optionIndex
        }))
    }

    const currentQuestion = questions[currentIndex]

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
            {/* Left Area: Question Content */}
            <div className="flex-1 space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl md:text-4xl font-serif font-black tracking-tight text-foreground">{subjectName} Mock Test</h1>
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 font-black text-lg transition-all ${timeLeft < 300 ? "border-rose-500 text-rose-500 animate-pulse ring-4 ring-rose-500/10" : "border-foreground bg-foreground text-background shadow-lg shadow-foreground/10"
                        }`}>
                        <Timer className="w-5 h-5" /> {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="brilliant-card flex flex-col justify-between p-8 bg-card border border-border/40 shadow-xl shadow-primary/5 rounded-[2.5rem]">
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">
                                Question <span className="text-primary">{currentIndex + 1}</span> <span className="opacity-30">/</span> {questions.length}
                            </span>
                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors">
                                <Flag className="w-3 h-3" /> Report
                            </button>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-black leading-tight mb-10 tracking-tight text-foreground">{currentQuestion.content}</h2>

                        <div className="grid gap-5">
                            {currentQuestion.options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(i)}
                                    className={`w-full p-6 text-left rounded-2xl border-2 transition-all flex items-center gap-4 font-bold text-lg group ${answers[currentQuestion.id] === i
                                        ? "border-primary bg-primary/5 ring-4 ring-primary/5 scale-[1.01]"
                                        : "hover:bg-muted/30 border-border bg-muted/10"
                                        }`}
                                >
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all ${answers[currentQuestion.id] === i ? "bg-primary text-background" : "bg-card border-2 border-border text-foreground/60 group-hover:border-primary/40"
                                        }`}>
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className={answers[currentQuestion.id] === i ? "text-primary" : "text-foreground"}>{opt}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-16">
                        <button
                            disabled={currentIndex === 0 || isSubmitting}
                            onClick={() => setCurrentIndex(prev => prev - 1)}
                            className="px-10 py-5 bg-muted rounded-full font-black uppercase text-xs tracking-widest disabled:opacity-30 hover:bg-muted/80 transition-all flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                        <button
                            disabled={isSubmitting}
                            onClick={() => {
                                if (currentIndex < questions.length - 1) {
                                    setCurrentIndex(prev => prev + 1)
                                } else {
                                    handleSubmit()
                                }
                            }}
                            className="px-10 py-5 bg-foreground text-background rounded-full font-black text-base flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-foreground/20"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                                {currentIndex === questions.length - 1 ? "Review & Submit" : "Save & Next"}
                                <ArrowRight className="w-5 h-5" strokeWidth={3} />
                            </>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Area: Navigation Grid */}
            <aside className="w-full lg:w-80 space-y-8">
                <div className="brilliant-card bg-white dark:bg-white/5">
                    <h3 className="text-xl font-serif font-black mb-6">Question Palette</h3>
                    <div className="grid grid-cols-5 gap-3">
                        {questions.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => !isSubmitting && setCurrentIndex(i)}
                                className={`w-full aspect-square rounded-xl font-black text-xs transition-all flex items-center justify-center border-2 ${currentIndex === i ? "border-primary bg-primary/10 text-primary" :
                                    answers[questions[i].id] !== undefined ? "bg-emerald-500 text-white border-emerald-500" :
                                        "bg-slate-100 border-transparent dark:bg-white/10 dark:text-white"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 space-y-3">
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <div className="w-4 h-4 bg-emerald-500 rounded-lg" /> Answered
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <div className="w-4 h-4 border-2 border-primary bg-primary/10 rounded-lg" /> Current
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <div className="w-4 h-4 bg-slate-100 dark:bg-white/5 rounded-lg" /> Not Visited
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-rose-500 text-white rounded-[2.5rem] shadow-xl shadow-rose-500/20">
                    <h4 className="font-bold flex items-center gap-2 mb-2">
                        <ShieldAlert className="w-5 h-5" /> Warning
                    </h4>
                    <p className="text-xs font-medium opacity-90 leading-relaxed">
                        Exiting or refreshing this page will result in automatic submission of your current progress.
                    </p>
                </div>
            </aside>
        </div>
    )
}
