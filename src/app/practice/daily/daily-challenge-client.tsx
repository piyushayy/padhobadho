"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Flame, CheckCircle2, XCircle, ArrowLeft, Clock, Zap, Sparkles, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"
import { toast } from "sonner"
import { submitDailyAnswer } from "@/actions/daily-challenge"

interface DailyChallengeClientProps {
    challenge: {
        question: {
            id: string
            content: string
            options: string[]
            explanation?: string | null
            correctOption?: number
            difficulty: string
            subject: string
            topic: string
        }
        isCompleted: boolean
        date: string
        streak: number
        xpBonus: number
    }
}

export default function DailyChallengeClient({ challenge }: DailyChallengeClientProps) {
    const [selected, setSelected] = useState<number | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(challenge.isCompleted)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [secondsElapsed, setSecondsElapsed] = useState(0)

    useEffect(() => {
        if (isSubmitted) return
        const timer = setInterval(() => {
            setSecondsElapsed((prev) => prev + 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [isSubmitted])

    const handleSubmit = async () => {
        if (selected === null || isSubmitting) return
        setIsSubmitting(true)

        try {
            const res = await submitDailyAnswer(challenge.question.id, selected, secondsElapsed)
            if (res.error) {
                toast.error(res.error)
            } else {
                setResult(res)
                setIsSubmitted(true)
                if (res.isCorrect) {
                    confetti({
                        particleCount: 80,
                        spread: 70,
                        origin: { y: 0.6 }
                    })
                    toast.success(`Streak extended! +${challenge.xpBonus} XP`)
                }
            }
        } catch {
            toast.error("Failed to submit answer")
        } finally {
            setIsSubmitting(false)
        }
    }

    const question = challenge.question
    const isCorrect = result ? result.isCorrect : challenge.isCompleted

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 py-6">
            {/* Header Navigation & Badges */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20">
                        <Flame className="w-4 h-4 fill-current" />
                        <span>{challenge.streak} Day Streak</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                        <Sparkles className="w-4 h-4" />
                        <span>+{challenge.xpBonus} XP</span>
                    </div>
                </div>
            </div>

            {/* Main Daily Challenge Card */}
            <div className="brilliant-card bg-card border border-border/80 rounded-3xl p-8 md:p-10 shadow-xl space-y-8">
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/60">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Problem of the Day</span>
                            <span className="text-xs text-muted-foreground font-medium">· {challenge.date}</span>
                        </div>
                        <h2 className="text-2xl font-serif font-black tracking-tight text-foreground">
                            {question.subject}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-muted text-foreground">
                            {question.topic}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                            question.difficulty === "HARD"
                                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                : question.difficulty === "EASY"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}>
                            {question.difficulty}
                        </span>
                        {!isSubmitted && (
                            <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-accent text-xs font-mono font-bold text-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{secondsElapsed}s</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Question Statement */}
                <div className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
                    {question.content}
                </div>

                {/* Option Selector */}
                <div className="grid grid-cols-1 gap-3.5">
                    {question.options.map((opt, idx) => {
                        const isChosen = selected === idx
                        const isAnswer = result ? idx === result.correctOption : false
                        let optionStyle = "border-border bg-background hover:bg-muted/40 text-foreground"

                        if (isSubmitted) {
                            if (isAnswer) {
                                optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                            } else if (isChosen && !isAnswer) {
                                optionStyle = "border-rose-500 bg-rose-500/10 text-rose-500 font-medium"
                            } else {
                                optionStyle = "border-border/40 opacity-50 bg-background text-muted-foreground"
                            }
                        } else if (isChosen) {
                            optionStyle = "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        }

                        return (
                            <button
                                key={idx}
                                disabled={isSubmitted}
                                onClick={() => setSelected(idx)}
                                className={`w-full p-4.5 rounded-2xl border text-left flex items-center gap-4 transition-all ${optionStyle}`}
                            >
                                <span className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border border-current shrink-0">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="text-base flex-1">{opt}</span>
                                {isSubmitted && isAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                                {isSubmitted && isChosen && !isAnswer && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                            </button>
                        )
                    })}
                </div>

                {/* Action / Telemetry Footer */}
                {!isSubmitted ? (
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={selected === null || isSubmitting}
                            className="h-12 px-8 rounded-2xl text-base font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        >
                            {isSubmitting ? "Evaluating..." : "Submit Answer"}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 pt-4 border-t border-border/60">
                        {/* Telemetry card */}
                        <div className={`p-6 rounded-2xl border flex items-start gap-4 ${
                            isCorrect ? "bg-emerald-500/10 border-emerald-500/30" : "bg-muted/40 border-border"
                        }`}>
                            <div className="p-3 rounded-xl bg-background shadow-sm shrink-0">
                                {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />}
                            </div>

                            <div className="space-y-1">
                                <h4 className="font-bold text-base text-foreground">
                                    {isCorrect ? "Challenge Solved!" : "Incorrect Attempt"}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {result?.telemetry?.feedback || (challenge.isCompleted ? "You have already completed today's challenge." : "")}
                                </p>
                            </div>
                        </div>

                        {/* Explanation / Editorial */}
                        {(result?.explanation || question.explanation) && (
                            <div className="p-6 rounded-2xl bg-muted/20 border border-border space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Editorial Explanation</span>
                                <p className="text-sm text-foreground leading-relaxed">
                                    {result?.explanation || question.explanation}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xs text-muted-foreground font-mono">Next problem unlocks at 00:00 IST</span>
                            <Link href="/dashboard">
                                <Button variant="outline" className="rounded-xl">
                                    Return to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
