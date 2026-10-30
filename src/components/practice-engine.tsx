"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { submitQuestionAnswer } from "@/actions/practice"
import { toast } from "sonner"
import { ArrowRight, CheckCircle2, Sparkles, X, Flag, Loader2 } from "lucide-react"
import confetti from "canvas-confetti"
import { submitTicket } from "@/actions/support"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useRouter } from "next/navigation"

interface Question {
    id: string
    content: string
    options: string[]
}

interface AnswerResult {
    isCorrect: boolean
    correctOption: number
    explanation?: string | null
    xpEarned?: number
}

function playAudioFeedback(success: boolean) {
    if (typeof window === "undefined") return
    try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!AudioContextClass) return
        const ctx = new AudioContextClass()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)

        if (success) {
            osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15) // A5
            gain.gain.setValueAtTime(0.15, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
            osc.start()
            osc.stop(ctx.currentTime + 0.3)
        } else {
            osc.frequency.setValueAtTime(260, ctx.currentTime)
            osc.frequency.exponentialRampToValueAtTime(196, ctx.currentTime + 0.2)
            gain.gain.setValueAtTime(0.15, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
            osc.start()
            osc.stop(ctx.currentTime + 0.25)
        }
    } catch {
        // Fallback silently if audio context is blocked by browser autoplay policy
    }
}

export default function PracticeEngine({
    sessionId,
    initialQuestions
}: {
    sessionId: string
    initialQuestions: Question[]
}) {
    const [index, setIndex] = useState(0)
    const [selected, setSelected] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [correctOption, setCorrectOption] = useState<number | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [explanation, setExplanation] = useState<string | null>(null)
    const [showExplanation, setShowExplanation] = useState(false)
    const [showQuitModal, setShowQuitModal] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [mistakes, setMistakes] = useState<Array<{ question: Question; explanation?: string | null }>>([])
    const [isCompleted, setIsCompleted] = useState(false)
    const router = useRouter()

    const question = initialQuestions[index]

    async function submit() {
        if (selected === null || isSubmitting || submitted) return

        setIsSubmitting(true)
        try {
            const result: AnswerResult = await submitQuestionAnswer(sessionId, question.id, selected, 0)
            setIsCorrect(result.isCorrect)
            setCorrectOption(result.correctOption)
            setExplanation(result.explanation || null)
            setSubmitted(true)

            playAudioFeedback(result.isCorrect)

            if (result.isCorrect) {
                setShowExplanation(true)
                confetti({
                    particleCount: 120,
                    spread: 60,
                    origin: { y: 0.65 },
                    colors: ["#10b981", "#34d399", "#6ee7b7"]
                })
            } else {
                setShowExplanation(false)
                setMistakes(prev => [...prev, { question, explanation: result.explanation }])
            }
        } catch (err) {
            console.error("Submission failed", err)
            toast.error("Failed to verify answer. Please retry.")
        } finally {
            setIsSubmitting(false)
        }
    }

    function next() {
        if (index < initialQuestions.length - 1) {
            setIndex(prev => prev + 1)
            setSelected(null)
            setSubmitted(false)
            setCorrectOption(null)
            setIsCorrect(null)
            setExplanation(null)
            setShowExplanation(false)
        } else {
            setIsCompleted(true)
            confetti({
                particleCount: 250,
                spread: 90,
                origin: { y: 0.35 }
            })
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

    const handleReport = () => {
        setShowReportModal(true)
    }

    const submitReport = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const typeSelect = form.querySelector("select")
        const message = form.querySelector("textarea")

        if (!message?.value) return

        try {
            await submitTicket({
                type: (typeSelect?.value.toUpperCase().replace(" ", "_") as "BUG" | "FEATURE" | "GENERAL" | "CONTENT_ERROR" | "OTHER") || "GENERAL",
                message: message.value
            })
            setShowReportModal(false)
            toast.success("Feedback submitted. Thank you!")
            form.reset()
        } catch {
            toast.error("Failed to submit ticket.")
        }
    }

    const handleSkip = async () => {
        if (submitted || isSubmitting) return
        setIsSubmitting(true)
        try {
            const result: AnswerResult = await submitQuestionAnswer(sessionId, question.id, -1, 0)
            setSubmitted(true)
            setIsCorrect(false)
            setCorrectOption(result.correctOption)
            setExplanation(result.explanation || null)
            setMistakes(prev => [...prev, { question, explanation: result.explanation }])
            setShowExplanation(true)
        } catch {
            toast.error("Failed to skip question.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleQuit = () => {
        router.push("/practice")
    }

    // Summary View
    if (isCompleted) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-black mb-4 text-foreground">Session Complete!</h1>
                    <p className="text-xl text-muted-foreground">
                        You scored <span className="text-primary font-bold">{initialQuestions.length - mistakes.length}</span> out of <span className="font-bold text-foreground">{initialQuestions.length}</span>.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Mistakes List */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b pb-4 text-foreground">Needs Improvement</h2>
                        {mistakes.length === 0 ? (
                            <div className="p-8 bg-card border rounded-2xl text-center text-muted-foreground">
                                <Sparkles className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                                <p>Flawless victory! No mistakes to review.</p>
                            </div>
                        ) : (
                            mistakes.map(({ question: q, explanation: exp }, idx) => (
                                <div key={`${q.id}-${idx}`} className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                                    <h3 className="font-bold mb-3 text-lg leading-tight text-foreground">{q.content}</h3>
                                    <div className="text-sm font-medium text-muted-foreground mb-4">
                                        <span className="text-rose-500 font-bold uppercase text-xs tracking-wider">Mistake</span>
                                    </div>
                                    <p className="text-sm leading-relaxed border-l-2 border-primary/30 pl-4 text-muted-foreground">
                                        {exp || "Review your syllabus for detailed concepts on this topic."}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Improvements / Summary */}
                    <div className="bg-card border rounded-[2rem] p-8 h-fit shadow-xl sticky top-8">
                        <h2 className="text-2xl font-serif font-black mb-6 text-foreground">Mastery Insights</h2>
                        <ul className="space-y-4 text-muted-foreground">
                            <li className="flex gap-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                                <span>Consistency is key. You&apos;ve completed <strong>{initialQuestions.length} practice questions</strong>.</span>
                            </li>
                            <li className="flex gap-3">
                                <ArrowRight className="w-6 h-6 text-primary shrink-0" />
                                <span>Review explanations to close any conceptual gaps.</span>
                            </li>
                            <li className="flex gap-3">
                                <Sparkles className="w-6 h-6 text-yellow-500 shrink-0" />
                                <span>Try a full-length Mock Test next to practice under timed conditions.</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="w-full mt-8 py-4 bg-primary text-primary-foreground font-black rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 pb-32">
            {/* Header / Quit Button */}
            <div className="absolute top-6 left-6 z-40">
                <button
                    onClick={() => setShowQuitModal(true)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Quit session"
                >
                    <X size={24} className="text-muted-foreground" />
                </button>
            </div>

            {/* Quit Confirmation Modal */}
            {showQuitModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-sm p-8 rounded-[2rem] shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-border/50 text-center space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-serif font-black text-foreground">End this drill?</h2>
                            <p className="text-sm font-medium text-muted-foreground">
                                Quitting now will record your answered questions, but unsaved answers will be reset.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => setShowQuitModal(false)}
                                className="w-full py-3.5 bg-foreground text-background font-black rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wide text-sm"
                            >
                                Keep Learning
                            </button>
                            <button
                                onClick={handleQuit}
                                className="w-full py-3.5 text-rose-500 font-black rounded-xl hover:bg-rose-500/10 transition-colors uppercase tracking-wide text-sm"
                            >
                                End Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Ticket Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-end md:justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full md:w-[400px] h-full md:h-auto md:max-h-[600px] md:right-4 md:fixed md:top-4 md:bottom-4 md:rounded-[2rem] rounded-t-[2rem] shadow-2xl p-6 flex flex-col animate-in slide-in-from-right-10 duration-300 border border-border/50">
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="text-2xl font-serif font-black">Report Question</h2>
                            <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-muted rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submitReport} className="space-y-6 flex-1 flex flex-col">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Report type</label>
                                <select className="w-full p-4 rounded-xl bg-muted/30 border border-border/50 font-medium outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="CONTENT_ERROR">Content or Typo Error</option>
                                    <option value="BUG">Technical Issue</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2 flex-1">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                                <textarea required className="w-full h-full min-h-[150px] p-4 rounded-xl bg-muted/30 border border-border/50 font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Explain what looks incorrect..."></textarea>
                            </div>

                            <button className="w-full py-4 bg-primary text-primary-foreground font-black rounded-xl hover:opacity-90 transition-opacity mt-auto">
                                Send Report
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="space-y-2 mb-4 text-center md:text-left mt-12 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-1">
                    <div className="space-y-0.5 text-left">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Practice Session</span>
                        <h3 className="text-xl md:text-3xl font-serif font-black text-foreground">
                            Question <span className="text-primary">{index + 1}</span> <span className="opacity-40">/</span> <span>{initialQuestions.length}</span>
                        </h3>
                    </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-700 ease-out"
                        style={{ width: `${((index + 1) / initialQuestions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="brilliant-card flex flex-col py-6 px-8 bg-card relative overflow-hidden mb-2 border border-border/40 shadow-xl shadow-primary/5 rounded-[2rem]"
                >
                    <div className="relative z-10 flex-1 flex flex-col">
                        <h2 className="text-xl md:text-2xl font-serif font-black mb-6 leading-tight text-foreground tracking-tight">{question.content}</h2>

                        <div className="space-y-3 flex-1">
                            {question.options.map((option, i) => {
                                const isSelected = selected === i
                                const isRight = submitted && i === correctOption
                                const isWrong = submitted && isSelected && i !== correctOption

                                return (
                                    <motion.button
                                        key={i}
                                        whileHover={!submitted ? { scale: 1.01 } : {}}
                                        whileTap={!submitted ? { scale: 0.99 } : {}}
                                        disabled={submitted || isSubmitting}
                                        onClick={() => setSelected(i)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${isSelected
                                            ? "border-primary bg-primary/5 ring-4 ring-primary/10 shadow-md shadow-primary/5"
                                            : "border-border/40 hover:border-primary/30 hover:bg-muted/30"
                                            } ${isRight ? "border-emerald-500 bg-emerald-500/10" : ""
                                            } ${isWrong ? "border-rose-500 bg-rose-500/10" : ""
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-black transition-all ${isSelected ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border group-hover:border-primary/40"
                                                }`}>
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            <span className={`text-base font-bold ${isRight ? "text-emerald-700 dark:text-emerald-400" :
                                                isWrong ? "text-rose-700 dark:text-rose-400" : "text-foreground"
                                                }`}>{option}</span>
                                        </div>
                                        <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded border border-border/50 text-muted-foreground/60 bg-muted/40">
                                            [{i + 1}]
                                        </span>
                                    </motion.button>
                                )
                            })}
                        </div>

                        {!submitted && (
                            <div className="mt-6 flex justify-between items-center pt-2">
                                <button
                                    onClick={handleSkip}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 text-muted-foreground font-bold hover:bg-muted rounded-full transition-colors uppercase tracking-widest text-sm"
                                >
                                    Skip
                                </button>
                                <button
                                    onClick={submit}
                                    disabled={selected === null || isSubmitting}
                                    className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-black text-base hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 uppercase tracking-tight flex items-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <>Check Answer <span className="hidden sm:inline opacity-60 font-mono text-xs">↵</span></>}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Explanation Modal (Popup) */}
            {submitted && explanation && showExplanation && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-[2rem] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-border/50 relative flex flex-col gap-4">
                        <button
                            onClick={() => setShowExplanation(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 border-b pb-4">
                            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xl font-serif font-black">Explanation</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Solution Breakdown</p>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert prose-sm leading-relaxed text-muted-foreground overflow-y-auto pr-2 custom-scrollbar">
                            <p className="whitespace-pre-line">{explanation}</p>
                        </div>

                        <div className="pt-2 mt-auto">
                            <button
                                onClick={() => setShowExplanation(false)}
                                className="w-full py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Feedback Bar */}
            {submitted && (
                <div className={`fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-full duration-500 border-t-2 shadow-2xl ${isCorrect
                    ? "bg-[#d7ffb8] dark:bg-emerald-950/80 border-emerald-500/30"
                    : "bg-white dark:bg-zinc-900 border-rose-500/30"
                    }`}>
                    <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 mr-auto">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300" : "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300"
                                }`}>
                                {isCorrect ? <CheckCircle2 className="w-6 h-6" strokeWidth={3} /> : <X className="w-6 h-6" strokeWidth={3} />}
                            </div>

                            <div>
                                <h4 className={`text-2xl font-black tracking-tight ${isCorrect ? "text-emerald-800 dark:text-emerald-300" : "text-rose-600 dark:text-rose-400"
                                    }`}>
                                    {isCorrect ? "Correct!" : "Incorrect"}
                                </h4>
                                {!isCorrect && correctOption !== null && (
                                    <p className="text-sm font-bold text-rose-700/80 dark:text-rose-300/80">
                                        Correct answer: Option {String.fromCharCode(65 + correctOption)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleReport}
                                className="p-3.5 rounded-2xl font-bold text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                title="Report Issue"
                            >
                                <Flag className="w-5 h-5" />
                            </button>

                            {explanation && (
                                <button
                                    onClick={() => setShowExplanation(true)}
                                    className="px-6 py-3.5 rounded-2xl font-black text-sm bg-zinc-800 text-white hover:bg-zinc-700 transition-all uppercase tracking-widest shadow-lg"
                                >
                                    Explanation
                                </button>
                            )}

                            <button
                                onClick={next}
                                className={`flex-1 md:flex-none px-8 py-3.5 rounded-2xl font-black text-lg text-white shadow-xl transition-transform hover:scale-105 active:scale-95 uppercase tracking-wide min-w-[140px] ${isCorrect ? "bg-emerald-500 shadow-emerald-500/30" : "bg-rose-500 shadow-rose-500/30"
                                    }`}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
