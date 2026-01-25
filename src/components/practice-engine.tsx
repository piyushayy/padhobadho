"use client"

import { useState } from "react"
import { submitQuestionAnswer } from "@/actions/practice"
import { toast } from "sonner"
import { ArrowRight, CheckCircle2, XCircle, Sparkles, X, Flag } from "lucide-react"
import confetti from "canvas-confetti"
import { submitTicket } from "@/actions/support"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useRouter } from "next/navigation"

interface Question {
    id: string
    content: string
    options: string[]
    explanation?: string
    correctOption?: number
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
    const [showExplanation, setShowExplanation] = useState(false)
    const [showQuitModal, setShowQuitModal] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [mistakes, setMistakes] = useState<number[]>([]) // Indices of incorrect questions
    const [isCompleted, setIsCompleted] = useState(false)
    const router = useRouter()

    const question = initialQuestions[index]

    async function submit() {
        if (selected === null) return

        // Instant / Optimistic Validation
        let isAnswerCorrect = false
        let correctOpt = -1

        if (question.correctOption !== undefined) {
            isAnswerCorrect = selected === question.correctOption
            correctOpt = question.correctOption
        } else {
            // Fallback for secure mode (though we are moving away from this for speed)
            const result = await submitQuestionAnswer(sessionId, question.id, selected, 0)
            if (result) {
                isAnswerCorrect = result.isCorrect
                correctOpt = result.correctOption
            }
        }

        // Update UI immediately
        setIsCorrect(isAnswerCorrect)
        setCorrectOption(correctOpt)
        setSubmitted(true)

        // Play Sound
        const audio = new Audio(isAnswerCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3')
        audio.volume = 0.5
        audio.play().catch(() => { })

        if (isAnswerCorrect) {
            setShowExplanation(true)
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10b981', '#34d399', '#6ee7b7']
            })
        } else {
            setShowExplanation(false)
            setMistakes(prev => [...prev, index])
        }

        // Sync with server in background
        submitQuestionAnswer(
            sessionId,
            question.id,
            selected,
            0
        ).catch(e => console.error("Sync failed", e))
    }

    function next() {
        if (index < initialQuestions.length - 1) {
            setIndex(prev => prev + 1)
            setSelected(null)
            setSubmitted(false)
            setCorrectOption(null)
            setIsCorrect(null)
            setShowExplanation(false)
        } else {
            setIsCompleted(true)
            confetti({
                particleCount: 300,
                spread: 100,
                origin: { y: 0.3 }
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
        // setShowReportModal(true)
        // toast("Report functionality coming soon")
        setShowReportModal(true)
    }

    const submitReport = async (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const typeSelect = form.querySelector('select')
        const message = form.querySelector('textarea')

        if (!message?.value) return

        try {
            await submitTicket({
                type: (typeSelect?.value.toUpperCase().replace(" ", "_") as any) || "GENERAL",
                message: message.value
            })
            setShowReportModal(false)
            toast.success("Ticket submitted successfully. Thank you for your feedback!")
            form.reset()
        } catch (err) {
            toast.error("Failed to submit ticket.")
        }
    }

    const handleQuit = () => {
        router.push('/practice')
    }

    // Summary View
    if (isCompleted) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-black mb-4">Session Complete!</h1>
                    <p className="text-xl text-muted-foreground">
                        You scored <span className="text-primary font-bold">{initialQuestions.length - mistakes.length}</span> out of <span className="font-bold">{initialQuestions.length}</span>.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Mistakes List */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b pb-4">Needs Improvement</h2>
                        {mistakes.length === 0 ? (
                            <div className="p-8 bg-card border rounded-2xl text-center text-muted-foreground">
                                <Sparkles className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                                <p>Flawless victory! No mistakes to review.</p>
                            </div>
                        ) : (
                            mistakes.map((idx) => {
                                const q = initialQuestions[idx]
                                return (
                                    <div key={q.id} className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                                        <h3 className="font-bold mb-3 text-lg leading-tight">{q.content}</h3>
                                        <div className="text-sm font-medium text-muted-foreground mb-4">
                                            <span className="text-rose-500 font-bold uppercase text-xs tracking-wider">Mistake</span>
                                        </div>
                                        <p className="text-sm leading-relaxed border-l-2 border-primary/30 pl-4 text-muted-foreground">
                                            {q.explanation || "No explanation provided."}
                                        </p>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* Improvements / Upsell */}
                    <div className="bg-card border rounded-[2rem] p-8 h-fit shadow-xl sticky top-8">
                        <h2 className="text-2xl font-serif font-black mb-6">Mastery Insights</h2>
                        <ul className="space-y-4 text-muted-foreground">
                            <li className="flex gap-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                                <span>Consistency is key. You've practiced for <strong>{initialQuestions.length} questions</strong> today.</span>
                            </li>
                            <li className="flex gap-3">
                                <ArrowRight className="w-6 h-6 text-primary shrink-0" />
                                <span>Review the explanations on the left to close your knowledge gaps.</span>
                            </li>
                            <li className="flex gap-3">
                                <Sparkles className="w-6 h-6 text-yellow-500 shrink-0" />
                                <span>Try a Mock Test next to simulate exam pressure.</span>
                            </li>
                        </ul>
                        <button onClick={() => router.push('/dashboard')} className="w-full mt-8 py-4 bg-primary text-background font-black rounded-xl hover:opacity-90 transition-opacity">
                            Continue
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
                >
                    <X size={24} className="text-muted-foreground" />
                </button>
            </div>

            {/* Quit Confirmation Modal */}
            {showQuitModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-sm p-8 rounded-[2rem] shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-border/50 text-center space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-serif font-black text-foreground">Are you sure?</h2>
                            <p className="text-sm font-medium text-muted-foreground">
                                If you quit now, you will lose your progress and XP for this session.
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
                                Quit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Ticket Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-end md:justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    {/* Side Panel for Desktop, Bottom Sheet for Mobile - Using the Screenshot Design */}
                    <div className="bg-card w-full md:w-[400px] h-full md:h-auto md:max-h-[600px] md:right-4 md:fixed md:top-4 md:bottom-4 md:rounded-[2rem] rounded-t-[2rem] shadow-2xl p-6 flex flex-col animate-in slide-in-from-right-10 duration-300 border border-border/50">
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="text-2xl font-serif font-black">New ticket</h2>
                            <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-muted rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submitReport} className="space-y-6 flex-1 flex flex-col">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ticket type</label>
                                <select className="w-full p-4 rounded-xl bg-muted/30 border border-border/50 font-medium outline-none focus:ring-2 focus:ring-primary/20">
                                    <option>Bug report</option>
                                    <option>Content Error</option>
                                    <option>Feature Request</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="space-y-2 flex-1">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                                <textarea required className="w-full h-full min-h-[150px] p-4 rounded-xl bg-muted/30 border border-border/50 font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Describe the issue..."></textarea>
                            </div>

                            <button className="w-full py-4 bg-primary text-background font-black rounded-xl hover:opacity-90 transition-opacity mt-auto">
                                Submit
                            </button>

                            <p className="text-[10px] text-muted-foreground text-center px-4">
                                Note: Your feedback is invaluable to us. We read every ticket. 😅
                            </p>
                        </form>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="space-y-2 mb-4 text-center md:text-left mt-12 md:mt-0">
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
                            // Show wrong selection only if it was selected by user
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

            {/* Explanation Guide (Conditioned on showExplanation) */}
            {submitted && question.explanation && showExplanation && (
                <div className="p-7 bg-[#062016] border-2 border-emerald-500/40 rounded-[2rem] relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl shadow-emerald-950/50 mb-32">
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
                <div className={`fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-full duration-500 border-t-2 ${isCorrect
                    ? "bg-[#d7ffb8] dark:bg-emerald-950/30 border-transparent"
                    : "bg-white dark:bg-zinc-900 border-transparent"
                    }`}>
                    <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">

                        {/* Left Side: Status */}
                        <div className="flex items-center gap-4 mr-auto">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                                }`}>
                                {isCorrect ? <CheckCircle2 className="w-6 h-6" strokeWidth={3} /> : <XCircle className="w-6 h-6" strokeWidth={3} />}
                            </div>

                            <div>
                                <h4 className={`text-2xl font-black tracking-tight ${isCorrect ? "text-emerald-700 dark:text-emerald-400" : "text-rose-600"
                                    }`}>
                                    {isCorrect ? "Correct!" : "Incorrect"}
                                </h4>
                                {!isCorrect && (
                                    <p className="text-sm font-bold text-rose-600/70 dark:text-rose-400/70">
                                        Correct answer: {String.fromCharCode(65 + (correctOption ?? 0))}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Actions */}
                        <div className="flex items-center gap-3 w-full md:w-auto">

                            <button
                                onClick={handleReport}
                                className="p-4 rounded-2xl font-bold text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                title="Report Issue"
                            >
                                <Sparkles className="w-5 h-5" />
                            </button>

                            {!isCorrect && question.explanation && (
                                <button
                                    onClick={() => setShowExplanation(!showExplanation)}
                                    className="px-6 py-4 rounded-2xl font-black text-sm bg-zinc-800 text-white hover:bg-zinc-700 transition-all uppercase tracking-widest shadow-lg"
                                >
                                    {showExplanation ? "Hide Info" : "Why?"}
                                </button>
                            )}

                            <button
                                onClick={next}
                                className={`flex-1 md:flex-none px-8 py-4 rounded-2xl font-black text-lg text-white shadow-xl transition-transform hover:scale-105 active:scale-95 uppercase tracking-wide min-w-[140px] ${isCorrect ? "bg-emerald-500 shadow-emerald-500/30" : "bg-rose-500 shadow-rose-500/30"
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
