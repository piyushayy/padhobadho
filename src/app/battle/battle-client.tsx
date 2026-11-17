"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Swords, Flame, Sparkles, Trophy, Clock, ArrowRight, RotateCcw, CheckCircle2, XCircle, Users, Loader2 } from "lucide-react"
import { submitBattleResult } from "@/actions/battle"
import { ShareCard } from "@/components/share-card"
import confetti from "canvas-confetti"
import Link from "next/link"

interface BattleQuestion {
    id: string
    content: string
    options: string[]
    correctOption: number
    explanation?: string
}

interface BattleClientProps {
    questions: BattleQuestion[]
    userName: string
}

const OPPONENT_NAMES = [
    { name: "Aarav_Kota", city: "Kota", rank: "Top 2%" },
    { name: "Priya_Delhi", city: "Delhi", rank: "Top 1%" },
    { name: "Rohan_Patna", city: "Patna", rank: "Top 5%" },
    { name: "Ananya_Blr", city: "Bangalore", rank: "Top 3%" },
    { name: "Kabir_Hyd", city: "Hyderabad", rank: "Top 4%" },
]

export function BattleClient({ questions, userName }: BattleClientProps) {
    const [gameState, setGameState] = useState<"lobby" | "matching" | "playing" | "ended">("lobby")
    const [opponent, setOpponent] = useState(OPPONENT_NAMES[0])
    const [currentIdx, setCurrentIdx] = useState(0)
    const [userScore, setUserScore] = useState(0)
    const [opponentScore, setOpponentScore] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [timeLeft, setTimeLeft] = useState(15)
    const [battleSummary, setBattleSummary] = useState<any>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const currentQ = questions[currentIdx] || questions[0]

    // Matchmaking simulation
    function startMatchmaking() {
        setGameState("matching")
        const randomOpponent = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)]
        setOpponent(randomOpponent)

        setTimeout(() => {
            setGameState("playing")
            setCurrentIdx(0)
            setUserScore(0)
            setOpponentScore(0)
            setSelectedOption(null)
            setIsAnswered(false)
            setTimeLeft(15)
        }, 2200)
    }

    // 15-second per question timer
    useEffect(() => {
        if (gameState !== "playing") return

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeExpired()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        // Opponent answers with realistic timing (3 to 9 seconds)
        const opponentAnswerDelay = Math.floor(Math.random() * 6000) + 3000
        const opponentTimeout = setTimeout(() => {
            if (gameState === "playing") {
                const opponentCorrect = Math.random() > 0.35 // 65% accuracy
                if (opponentCorrect) {
                    setOpponentScore((s) => s + 1)
                }
            }
        }, opponentAnswerDelay)

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            clearTimeout(opponentTimeout)
        }
    }, [gameState, currentIdx])

    function handleTimeExpired() {
        if (isAnswered) return
        setIsAnswered(true)
        setSelectedOption(-1) // Missed

        setTimeout(() => {
            advanceQuestion()
        }, 1200)
    }

    function handleOptionClick(optIdx: number) {
        if (isAnswered) return
        setSelectedOption(optIdx)
        setIsAnswered(true)

        const isCorrect = optIdx === currentQ.correctOption
        if (isCorrect) {
            setUserScore((s) => s + 1)
        }

        setTimeout(() => {
            advanceQuestion()
        }, 1400)
    }

    function advanceQuestion() {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx((i) => i + 1)
            setSelectedOption(null)
            setIsAnswered(false)
            setTimeLeft(15)
        } else {
            finishBattle()
        }
    }

    async function finishBattle() {
        setGameState("ended")
        setIsSubmitting(true)
        try {
            const res = await submitBattleResult({
                userScore,
                opponentScore,
                timeSpent: 75 - timeLeft
            })
            setBattleSummary(res)
            if (res.isWinner) {
                confetti({
                    particleCount: 200,
                    spread: 90,
                    origin: { y: 0.5 },
                    colors: ["#10b981", "#f59e0b", "#6366f1"]
                })
            }
        } catch {
            setBattleSummary({
                isWinner: userScore > opponentScore,
                isTie: userScore === opponentScore,
                xpReward: userScore > opponentScore ? 100 : 25,
                message: userScore > opponentScore ? "🏆 VICTORY!" : "⚡ Good fight!"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* LOBBY VIEW */}
            {gameState === "lobby" && (
                <div className="text-center space-y-8 bg-card border border-border/80 rounded-3xl p-8 sm:p-12 shadow-xl">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-4xl shadow-inner">
                        <Swords size={36} />
                    </div>

                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                            <Flame size={12} /> 1v1 Battle Arena
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-serif font-black text-foreground tracking-tight">
                            Conceptual Sprint Duel
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                            Compete head-to-head in a live 5-question sprint. Fast answers, high stakes, winner takes +100 XP.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-left text-xs bg-muted/30 p-4 rounded-2xl border border-border/50">
                        <div>
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Format</p>
                            <p className="font-black text-foreground">5 Questions</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Timer</p>
                            <p className="font-black text-foreground">15s / Question</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Prize</p>
                            <p className="font-black text-primary">+100 XP</p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={startMatchmaking}
                            className="px-8 py-4 bg-primary text-background font-black text-sm uppercase tracking-wider rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/25 cursor-pointer"
                        >
                            Find Opponent & Enter Arena &rarr;
                        </button>
                    </div>
                </div>
            )}

            {/* MATCHMAKING VIEW */}
            {gameState === "matching" && (
                <div className="text-center space-y-8 bg-card border border-border/80 rounded-3xl p-12 shadow-xl">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-black text-foreground">Finding an Aspirant in India...</h2>
                        <p className="text-xs text-muted-foreground">Matching by syllabus track & competitive rating</p>
                    </div>
                    <div className="flex items-center justify-center gap-6 pt-4">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-lg mx-auto mb-2 text-primary">
                                {userName[0]?.toUpperCase() || "Y"}
                            </div>
                            <p className="text-xs font-bold text-foreground">{userName}</p>
                            <p className="text-[10px] text-muted-foreground">You</p>
                        </div>
                        <span className="text-xl font-black text-muted-foreground">VS</span>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center font-black text-lg mx-auto mb-2 text-foreground">
                                {opponent.name[0]}
                            </div>
                            <p className="text-xs font-bold text-foreground">{opponent.name}</p>
                            <p className="text-[10px] text-primary font-bold">{opponent.city}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* PLAYING DUEL VIEW */}
            {gameState === "playing" && (
                <div className="space-y-6">
                    {/* Live Score Duel Bar */}
                    <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-black text-sm">
                                {userName[0]?.toUpperCase() || "Y"}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-foreground">{userName}</p>
                                <p className="text-lg font-serif font-black text-primary leading-none">{userScore} pts</p>
                            </div>
                        </div>

                        {/* Central Timer */}
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black uppercase text-muted-foreground">Q {currentIdx + 1}/5</span>
                            <div className={`px-3 py-1 rounded-full text-xs font-black font-mono flex items-center gap-1 ${
                                timeLeft <= 5 ? "bg-rose-500/10 text-rose-500 animate-pulse" : "bg-muted text-foreground"
                            }`}>
                                <Clock size={12} /> {timeLeft}s
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                            <div>
                                <p className="text-xs font-bold text-foreground">{opponent.name}</p>
                                <p className="text-lg font-serif font-black text-foreground leading-none">{opponentScore} pts</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center font-black text-sm">
                                {opponent.name[0]}
                            </div>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
                        <h2 className="text-xl sm:text-2xl font-serif font-black text-foreground leading-snug">
                            {currentQ.content}
                        </h2>

                        {/* Options Grid */}
                        <div className="grid gap-3">
                            {currentQ.options.map((opt, i) => {
                                const isSelected = selectedOption === i
                                const isCorrect = i === currentQ.correctOption

                                let style = "bg-muted/40 hover:bg-muted border-border/70 text-foreground"
                                if (isAnswered) {
                                    if (isCorrect) style = "bg-emerald-500/15 border-emerald-500 text-emerald-600 font-bold"
                                    else if (isSelected && !isCorrect) style = "bg-rose-500/15 border-rose-500 text-rose-600 font-bold"
                                    else style = "opacity-40 border-border/40"
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleOptionClick(i)}
                                        disabled={isAnswered}
                                        className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${style}`}
                                    >
                                        <span>{opt}</span>
                                        {isAnswered && isCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
                                        {isAnswered && isSelected && !isCorrect && <XCircle size={16} className="text-rose-500 shrink-0" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* BATTLE RESULT VIEW */}
            {gameState === "ended" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="bg-card border border-border/80 rounded-3xl p-8 text-center space-y-4 shadow-xl">
                        <div className="text-4xl mb-2">
                            {userScore > opponentScore ? "🏆" : userScore === opponentScore ? "🤝" : "⚡"}
                        </div>
                        <h2 className="text-3xl font-serif font-black text-foreground">
                            {userScore > opponentScore ? "Sprint Victory!" : userScore === opponentScore ? "Battle Tied!" : "Opponent Won"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Final Score: <span className="font-black text-foreground">{userScore}</span> (You) - <span className="font-black text-foreground">{opponentScore}</span> ({opponent.name})
                        </p>
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-wider">
                            <Sparkles size={14} /> +{battleSummary?.xpReward || (userScore > opponentScore ? 100 : 25)} XP Awarded
                        </div>
                    </div>

                    {/* Shareable Scorecard */}
                    <ShareCard
                        title={`1v1 Battle vs ${opponent.name}`}
                        subtitle="PadhoBadho Sprint Duel"
                        score={`${userScore} - ${opponentScore}`}
                        percentile={userScore > opponentScore ? 92 : 75}
                        shareUrl="https://padhobadho.com/battle"
                    />

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={startMatchmaking}
                            className="flex-1 py-4 bg-primary text-background font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                        >
                            <RotateCcw size={14} /> Battle Another Aspirant
                        </button>
                        <Link
                            href="/dashboard"
                            className="py-4 px-6 bg-muted hover:bg-muted/80 text-foreground font-black text-xs uppercase tracking-wider rounded-xl transition-colors text-center"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
