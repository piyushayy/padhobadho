"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Zap, Target, Flame, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"

export default function DailyTracker({
    solvedToday,
    goal
}: {
    solvedToday: number,
    goal: number
}) {
    const percentage = Math.min((solvedToday / goal) * 100, 100)
    const isCompleted = percentage >= 100
    const hasFired = useRef(false)

    useEffect(() => {
        if (isCompleted && !hasFired.current) {
            hasFired.current = true
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#10b981", "#34d399", "#f59e0b"]
            })
        }
    }, [isCompleted])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`brilliant-card bg-card p-8 flex flex-col justify-between h-full relative overflow-hidden group transition-all duration-500 ${
                isCompleted
                    ? "border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20"
                    : "border-border/60"
            }`}
        >
            {/* Ambient Background Glow for Completed State */}
            {isCompleted && (
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none" />
            )}

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        {isCompleted && <Sparkles size={12} className="text-emerald-500 animate-spin" />}
                        Daily Goal Progress
                    </span>
                    <motion.div
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        className={`p-2.5 rounded-xl transition-all ${
                            isCompleted
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                : "bg-primary/10 text-primary"
                        }`}
                    >
                        {isCompleted ? <Flame size={20} className="fill-current animate-bounce" /> : <Zap size={20} fill="currentColor" />}
                    </motion.div>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-serif font-black tracking-tight text-foreground">
                        {solvedToday}
                    </span>
                    <span className="text-2xl opacity-40 font-sans font-bold">/{goal}</span>
                    <span className="text-2xl animate-pulse">🔥</span>
                </div>

                <div className="mt-6 space-y-3">
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden p-0.5 border border-border/40">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className={`h-full rounded-full transition-all ${
                                isCompleted
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.7)]"
                                    : "bg-primary shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                            }`}
                        />
                    </div>
                    <p className={`text-[11px] font-bold ${isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                        {isCompleted
                            ? "🎯 Goal smashed! You are in the top 5% of consistent learners today."
                            : `${goal - solvedToday} more questions to secure your streak.`}
                    </p>
                </div>
            </div>

            {/* Background Icon */}
            <Target className="absolute -right-4 -bottom-4 w-28 h-28 text-primary/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700 pointer-events-none" />
        </motion.div>
    )
}
