"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Clock, Calendar, Sparkles, CheckCircle2, ArrowRight, Swords, Flame, Users, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import confetti from "canvas-confetti"

function getNextSunday10AM(): Date {
    const now = new Date()
    const nextSunday = new Date(now)
    const day = now.getDay()
    const daysUntilSunday = (7 - day) % 7 === 0 && now.getHours() >= 10 ? 7 : (7 - day) % 7
    nextSunday.setDate(now.getDate() + daysUntilSunday)
    nextSunday.setHours(10, 0, 0, 0)
    return nextSunday
}

export function ContestClient({ isRegistered: initialRegistered = false }: { isRegistered?: boolean }) {
    const [isRegistered, setIsRegistered] = useState(initialRegistered)
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        function updateTimer() {
            const target = getNextSunday10AM().getTime()
            const now = Date.now()
            const diff = Math.max(0, target - now)

            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            setTimeLeft({ days, hours, minutes, seconds })
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => clearInterval(interval)
    }, [])

    function handleRegister() {
        setIsRegistered(true)
        toast.success("Registered for Sunday Contest! We will notify you before 10:00 AM IST.")
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#3b82f6', '#f59e0b']
        })
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
            {/* Hero Header */}
            <div className="text-center space-y-5 bg-card border border-border/80 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                    <Trophy size={12} /> All-India Sunday Arena
                </div>

                <h1 className="text-4xl sm:text-6xl font-serif font-black text-foreground tracking-tight leading-tight">
                    Sunday All-India Mock Contest
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Every student in India receives the exact same questions at 10:00 AM IST. Compete under exam pressure, earn ELO rating, and get your predicted All-India Rank.
                </p>

                {/* Live Countdown Grid */}
                <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto pt-4">
                    {[
                        { label: "Days", val: timeLeft.days },
                        { label: "Hours", val: timeLeft.hours },
                        { label: "Minutes", val: timeLeft.minutes },
                        { label: "Seconds", val: timeLeft.seconds }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-muted/40 border border-border/60 rounded-2xl p-3 sm:p-4 text-center">
                            <span className="text-2xl sm:text-4xl font-serif font-black text-primary font-mono block">
                                {String(item.val).padStart(2, "0")}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA Action */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    {isRegistered ? (
                        <div className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider border border-emerald-500/20">
                            <CheckCircle2 size={16} /> Registered for Next Contest (Sunday 10:00 AM IST)
                        </div>
                    ) : (
                        <button
                            onClick={handleRegister}
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-background font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/25 cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Sparkles size={14} /> Register Free for Contest
                        </button>
                    )}

                    <Link
                        href="/mock-test"
                        className="w-full sm:w-auto px-6 py-4 bg-muted hover:bg-muted/80 text-foreground font-black text-xs uppercase tracking-wider rounded-xl transition-colors text-center"
                    >
                        Practice Past Paper &rarr;
                    </Link>
                </div>
            </div>

            {/* Contest Rules & Perks Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border/70 rounded-3xl p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                    <h3 className="text-lg font-serif font-black text-foreground">Exact NTA Exam Rigor</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        45-minute strict countdown timer with +5 / -1 negative marking logic matching the official entrance pattern.
                    </p>
                </div>

                <div className="bg-card border border-border/70 rounded-3xl p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Trophy size={20} />
                    </div>
                    <h3 className="text-lg font-serif font-black text-foreground">Predicted AIR Band</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Instant All-India Percentile normalization so you know exactly where you stand against thousands of peers.
                    </p>
                </div>

                <div className="bg-card border border-border/70 rounded-3xl p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <ShieldCheck size={20} />
                    </div>
                    <h3 className="text-lg font-serif font-black text-foreground">+500 XP & Hall of Fame</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Top 100 contestants earn exclusive contest trophies and surge to the top of the All-India Leaderboard.
                    </p>
                </div>
            </div>
        </div>
    )
}
