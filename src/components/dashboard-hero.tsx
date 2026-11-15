"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Zap, Flame, Sparkles, BookOpen, Clock } from "lucide-react"

interface DashboardHeroProps {
    examCode: string
    targetUniversity: string | null
    totalAttempted: number
}

export default function DashboardHero({ examCode, targetUniversity, totalAttempted }: DashboardHeroProps) {
    const greeting = useMemo(() => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 17) return "Good afternoon"
        return "Good evening"
    }, [])

    return (
        <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8 md:p-14 text-white shadow-2xl border border-white/10 group"
        >
            {/* Animated Ambient Light Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.25, 1],
                        opacity: [0.25, 0.45, 0.25],
                        x: [0, 40, 0],
                        y: [0, -20, 0]
                    }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/25 blur-[100px] rounded-full will-change-transform"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.35, 0.2],
                        x: [0, -30, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full will-change-transform"
                />
                {/* Dot matrix grid overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
                {/* Left: Welcome & CTAs */}
                <div className="lg:col-span-7 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="space-y-3"
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-400">
                            <Sparkles size={14} className="animate-pulse" />
                            <span>Target: {examCode || "CUET 2026"}</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-[1.15]">
                            {greeting}, <br />
                            <span className="gradient-text italic font-bold">Aspirant.</span>
                        </h2>

                        <p className="text-base md:text-lg text-zinc-300 font-medium max-w-lg leading-relaxed">
                            {targetUniversity
                                ? `Destined for ${targetUniversity}. ${totalAttempted} practice drills completed on your road to admission.`
                                : "Your daily streak is active. Every question solved today compounds toward test day."}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="flex flex-wrap gap-3.5 pt-2"
                    >
                        <Link
                            href="/practice"
                            className="h-12 md:h-14 px-7 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl font-black flex items-center gap-2 hover:scale-[1.03] transition-all duration-200 shadow-xl shadow-emerald-500/20 active:scale-95 text-xs md:text-sm uppercase tracking-wider"
                        >
                            <BookOpen size={18} strokeWidth={2.5} /> Continue Practice
                        </Link>
                        <Link
                            href="/mock-test"
                            className="h-12 md:h-14 px-7 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-2xl font-bold flex items-center gap-2 transition-all duration-200 text-xs md:text-sm uppercase tracking-wider backdrop-blur-sm"
                        >
                            <Clock size={18} /> Full Mock Test
                        </Link>
                    </motion.div>
                </div>

                {/* Right: Daily Challenge & Streak Tile */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="lg:col-span-5"
                >
                    <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-blue-500/15 border border-white/15 backdrop-blur-xl shadow-2xl overflow-hidden group/card hover:border-emerald-400/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl group-hover/card:scale-125 transition-transform duration-500" />

                        <div className="flex justify-between items-center mb-6">
                            <span className="px-3 py-1 bg-white/15 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-300 flex items-center gap-1.5 border border-white/10">
                                <Zap size={12} fill="currentColor" className="text-yellow-300" /> Question of the Day
                            </span>
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 animate-pulse">
                                <Flame size={14} fill="currentColor" /> +50 XP
                            </div>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">Daily Habit Loop</h3>
                        <p className="text-xs md:text-sm text-zinc-300 mb-6 leading-relaxed">
                            Solve today&apos;s curated challenge in under 60 seconds to safeguard your streak and climb the leaderboard.
                        </p>

                        <Link
                            href="/practice/daily"
                            className="w-full h-12 bg-white text-zinc-950 hover:bg-emerald-400 rounded-xl font-black text-xs uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
                        >
                            Solve Today&apos;s POTD <ChevronRight size={16} strokeWidth={3} />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}
