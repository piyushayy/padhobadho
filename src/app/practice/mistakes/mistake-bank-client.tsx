"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, CheckCircle2, RotateCcw, AlertTriangle, Layers, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { resolveMistake } from "@/actions/mistakes"

interface MistakeQuestion {
    id: string
    content: string
    options: string[]
    explanation?: string | null
    correctOption?: number
    difficulty: string
    subject: string
    topic: string
    attempts: number
    lastAttempted: Date
}

interface MistakeBankClientProps {
    initialMistakes: MistakeQuestion[]
}

export default function MistakeBankClient({ initialMistakes }: MistakeBankClientProps) {
    const [mistakes, setMistakes] = useState(initialMistakes)
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [reviewedResults, setReviewedResults] = useState<Record<string, { isCorrect: boolean }>>({})

    const handleAnswerTest = async (question: MistakeQuestion, optionIdx: number) => {
        setSelectedOption(optionIdx)
        const isRight = optionIdx === question.correctOption
        setReviewedResults((prev) => ({ ...prev, [question.id]: { isCorrect: isRight } }))

        if (isRight) {
            toast.success("Correct! Mistake mastered and cleared.")
            await resolveMistake(question.id)
            setTimeout(() => {
                setMistakes((prev) => prev.filter((m) => m.id !== question.id))
                setActiveQuestionId(null)
                setSelectedOption(null)
            }, 1200)
        } else {
            toast.error("Incorrect. Review the explanation.")
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors mb-2">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-serif font-black tracking-tight text-foreground flex items-center gap-3">
                        Mistake Bank <span className="text-sm font-sans px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 font-bold border border-rose-500/20">{mistakes.length} Concepts Pending</span>
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">
                        Spaced repetition review. Re-solve questions you previously got wrong to master the concepts.
                    </p>
                </div>
            </div>

            {mistakes.length === 0 ? (
                <div className="bg-card border border-border rounded-3xl p-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold font-serif text-foreground">Mistake Bank is Empty!</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Incredible work. You have mastered every question you previously struggled with. Keep practicing new topics!
                    </p>
                    <Link href="/practice" className="inline-block pt-2">
                        <Button className="rounded-xl px-8 h-11">Go to Practice Arena</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {mistakes.map((item) => {
                        const isTesting = activeQuestionId === item.id
                        const reviewState = reviewedResults[item.id]

                        return (
                            <div key={item.id} className="brilliant-card bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5 transition-all">
                                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40 text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-primary px-2.5 py-1 rounded-md bg-primary/10">
                                            {item.subject}
                                        </span>
                                        <span className="font-medium text-muted-foreground px-2.5 py-1 rounded-md bg-muted">
                                            {item.topic}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-muted-foreground font-mono">
                                        <span>Attempted {item.attempts} times</span>
                                    </div>
                                </div>

                                <div className="text-base md:text-lg font-medium text-foreground">
                                    {item.content}
                                </div>

                                {!isTesting ? (
                                    <div className="flex items-center justify-between pt-2">
                                        <Button
                                            onClick={() => {
                                                setActiveQuestionId(item.id)
                                                setSelectedOption(null)
                                            }}
                                            className="rounded-xl gap-2 h-10 px-5 text-xs font-bold"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" /> Re-attempt This Concept
                                        </Button>

                                        {item.explanation && (
                                            <details className="text-xs text-muted-foreground cursor-pointer">
                                                <summary className="font-semibold hover:text-foreground">Peek at Explanation</summary>
                                                <p className="mt-2 p-3 rounded-xl bg-muted/30 text-foreground">{item.explanation}</p>
                                            </details>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4 pt-2 animate-in fade-in duration-300">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select the correct option:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {item.options.map((opt, optIdx) => {
                                                const isSelected = selectedOption === optIdx
                                                const isRight = optIdx === item.correctOption
                                                let btnClass = "border-border bg-background hover:bg-muted/40 text-foreground"

                                                if (reviewState) {
                                                    if (isRight) btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold"
                                                    else if (isSelected && !isRight) btnClass = "border-rose-500 bg-rose-500/10 text-rose-500 font-bold"
                                                }

                                                return (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => handleAnswerTest(item, optIdx)}
                                                        disabled={!!reviewState}
                                                        className={`p-3.5 rounded-xl border text-left text-sm flex items-center gap-3 transition-colors ${btnClass}`}
                                                    >
                                                        <span className="w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0">
                                                            {String.fromCharCode(65 + optIdx)}
                                                        </span>
                                                        <span className="flex-1">{opt}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setActiveQuestionId(null)
                                                    setSelectedOption(null)
                                                }}
                                                className="text-xs text-muted-foreground"
                                            >
                                                Close Re-attempt
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
