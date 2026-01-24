"use client"

import { useState } from "react"
import { submitQuestionAnswer } from "@/actions/practice"
import { toast } from "sonner"
import { ArrowRight, CheckCircle2, XCircle, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

interface Question {
    id: string
    content: string
    options: string[]
    explanation?: string
}

export default function PracticeEngine({
    sessionId,
    initialQuestions
}: {
    sessionId: string,
    initialQuestions: Question[]
}) {
    const [index, setIndex] = useState(0)
    const [selected, setSelected] = useState<number | null>(null)
    const [submitted, setSubmitted] = useState(false)
    const [correctOption, setCorrectOption] = useState<number | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

    const question = initialQuestions[index]

    async function submit() {
        if (selected === null) return

        const result = await submitQuestionAnswer(
            sessionId,
            question.id,
            selected,
            0 // No timer
        )
        if (result) {
            setCorrectOption(result.correctOption)
            setIsCorrect(result.isCorrect)
            setSubmitted(true)

            if (result.isCorrect) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#10b981', '#34d399', '#6ee7b7']
                })
            }
        }
    }

    function next() {
        if (index < initialQuestions.length - 1) {
            setIndex(prev => prev + 1)
            setSelected(null)
            setSubmitted(false)
            setCorrectOption(null)
            setIsCorrect(null)
        } else {
            toast.success("Practice session completed! Well done.")
        }
    }

    // Keyboard Shortcuts
    useKeyboardShortcuts({
        "1": () => !submitted && setSelected(0),
        "2": () => !submitted && setSelected(1),
        "3": () => !submitted && setSelected(2),
        "4": () => !submitted && setSelected(3),
        "a": () => !submitted && setSelected(0),
        "b": () => !submitted && setSelected(1),
        "c": () => !submitted && setSelected(2),
        "d": () => !submitted && setSelected(3),
        "enter": () => {
            if (!submitted && selected !== null) submit()
            else if (submitted) next()
        },
        "arrowright": () => {
            if (submitted) next()
        }
    })

    return (
        <div className="max-w-3xl mx-auto px-4 pb-24">
            {/* Progress Bar */}
            <div className="space-y-2 mb-4 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-1">
                    <div className="space-y-0.5 text-left">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/90">Practice Session</span>
                        <h3 className="text-xl md:text-3xl font-serif font-black text-white drop-shadow-2xl">
                            Question <span className="text-primary">{index + 1}</span> <span className="text-white/40">/</span> <span className="text-white/90">{initialQuestions.length}</span>
                        </h3>
                    </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                        style={{ width: `${((index + 1) / initialQuestions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="brilliant-card flex flex-col py-6 px-8 bg-card relative overflow-hidden mb-2 border border-border/40 shadow-xl shadow-primary/5 rounded-[2rem]">
                <div className="relative z-10 flex-1 flex flex-col">
                    <h2 className="text-xl md:text-3xl font-serif font-black mb-6 leading-tight text-foreground tracking-tight">{question.content}</h2>

                    <div className="space-y-3 flex-1">
                        {question.options.map((option, i) => {
                            const isSelected = selected === i
                            const isRight = submitted && i === correctOption
                            const isWrong = submitted && isSelected && i !== correctOption

                            return (
                                <button
                                    key={i}
                                    disabled={submitted}
                                    onClick={() => setSelected(i)}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 group ${isSelected
                                        ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                                        : "border-border/40 hover:border-primary/30 hover:bg-muted/30"
                                        } ${isRight ? "border-emerald-500 bg-emerald-500/10" : ""
                                        } ${isWrong ? "border-rose-500 bg-rose-500/10" : ""
                                        }`}
                                >
                                    <span className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-black transition-all ${isSelected ? "bg-primary text-background border-primary" : "text-muted-foreground border-border group-hover:border-primary/40"
                                        }`}>
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className={`text-base font-bold ${isRight ? "text-emerald-700 dark:text-emerald-600" :
                                        isWrong ? "text-rose-700 dark:text-rose-600" : "text-foreground"
                                        }`}>{option}</span>
                                </button>
                            )
                        })}
                    </div>

                    {!submitted && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={submit}
                                disabled={selected === null}
                                className="px-8 py-3 bg-primary text-background rounded-full font-black text-base hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 uppercase tracking-tighter"
                            >
                                Check Answer
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Explanation Guide */}
            {submitted && question.explanation && (
                <div className="p-7 bg-[#062016] border-2 border-emerald-500/40 rounded-[2rem] relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl shadow-emerald-950/50">
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
                            </div>
                            <div>
                                <h4 className="text-xl font-serif font-black text-emerald-400">Solution Guide</h4>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/50">Mastery Insights</p>
                            </div>
                        </div>
                        <p className="text-lg text-white leading-relaxed font-bold whitespace-pre-line border-l-4 border-emerald-500/40 pl-5 py-0.5">
                            {question.explanation}
                        </p>
                    </div>
                </div>
            )}

            {/* Bottom Feedback Bar */}
            {submitted && (
                <div className={`fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-full duration-700 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] backdrop-blur-3xl transition-colors ${isCorrect ? "bg-emerald-50/95 dark:bg-emerald-950/95 border-t-8 border-emerald-500" : "bg-rose-50/95 dark:bg-rose-950/95 border-t-8 border-rose-500"
                    }`}>
                    <div className="max-w-4xl mx-auto px-10 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-8">
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-4 ${isCorrect ? "bg-emerald-500 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/20" : "bg-rose-500 text-white border-rose-400/50 shadow-lg shadow-rose-500/20"
                                }`}>
                                {isCorrect ? <CheckCircle2 className="w-8 h-8" strokeWidth={3} /> : <XCircle className="w-8 h-8" strokeWidth={3} />}
                            </div>
                            <div className="space-y-1 text-center md:text-left">
                                <h4 className={`text-2xl md:text-3xl font-serif font-black tracking-tight ${isCorrect ? "text-emerald-400" : "text-rose-400"
                                    }`}>
                                    {isCorrect ? "Brilliant! Points Earned." : `Correction Necessary. The answer is ${String.fromCharCode(65 + (correctOption ?? 0))}`}
                                </h4>
                                <p className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start ${isCorrect ? "text-emerald-200" : "text-rose-200"}`}>
                                    {isCorrect ? <><Sparkles className="w-4 h-4" /> Your mastery is growing</> : "Check the explanation to learn why"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={next}
                            className={`flex-1 md:flex-none px-12 py-4 rounded-[1.5rem] font-black text-xl text-white shadow-xl transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95 uppercase tracking-tighter ${isCorrect ? "bg-emerald-500 shadow-emerald-500/30" : "bg-rose-500 shadow-rose-500/30"
                                }`}
                        >
                            Continue <ArrowRight className="w-6 h-6" strokeWidth={4} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
