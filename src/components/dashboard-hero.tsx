"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Zap } from "lucide-react"

interface DashboardHeroProps {
    examCode: string
    targetUniversity: string | null
    totalAttempted: number
}

export default function DashboardHero({ examCode, targetUniversity, totalAttempted }: DashboardHeroProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[3rem] bg-zinc-950 p-12 md:p-16 text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] group border border-white/5"
        >
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -right-[10%] w-[60%] h-[80%] bg-primary/20 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -40, 0],
                        y: [0, 40, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[70%] bg-blue-500/10 blur-[100px] rounded-full"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Welcome & Progress */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-serif font-black tracking-tight mb-4 leading-[1.1]">
                            Welcome back, 👋 <br />
                            <motion.span
                                animate={{ color: ["#fff", "#10b981", "#fff"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="italic inline-block"
                            >
                                Aspirant.
                            </motion.span>
                        </h2>
                        <p className="text-lg opacity-70 font-medium max-w-md leading-relaxed">
                            {targetUniversity
                                ? `Destined for ${targetUniversity}. ${totalAttempted} questions down, a lifetime of glory to go.`
                                : "Your daily streak is waiting. Let's make today count."}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link href="/practice" className="h-14 px-8 bg-white text-black rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl active:scale-95 text-sm uppercase tracking-widest">
                            Continue <ChevronRight size={18} strokeWidth={3} />
                        </Link>
                        <Link href="/mock-test" className="h-14 px-8 bg-zinc-800 text-white border border-white/10 rounded-2xl font-black flex items-center gap-2 hover:bg-zinc-700 transition-all text-sm uppercase tracking-widest">
                            Mock Test
                        </Link>
                    </motion.div>
                </div>

                {/* Right: Daily Drop Card (Gamification) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-[2.5rem] blur-xl opacity-50 animate-pulse" />
                    <div className="relative bg-gradient-to-br from-[#6366f1] to-[#a855f7] p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl border border-white/20">
                        <div className="flex justify-between items-start mb-8">
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Zap size={12} fill="currentColor" className="text-yellow-300" /> Daily Drop
                            </div>
                            <div className="text-xs font-bold font-mono opacity-80">
                                08:12:45 left
                            </div>
                        </div>

                        <h3 className="text-3xl font-black mb-2">Rapid Fire: Calculus</h3>
                        <p className="text-sm font-medium text-white/80 mb-8 leading-relaxed">
                            Complete 3 questions in 2 minutes to win double XP.
                        </p>

                        <button className="w-full h-14 bg-white text-[#6366f1] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-lg">
                            Start Challenge <ChevronRight size={16} strokeWidth={3} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute right-12 top-12 hidden lg:block opacity-20 group-hover:opacity-40 transition-opacity">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin-slow">
                    <circle cx="60" cy="60" r="58" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                    <circle cx="60" cy="60" r="40" stroke="white" strokeWidth="0.5" />
                    <rect x="55" y="10" width="10" height="100" fill="white" fillOpacity="0.1" />
                    <rect x="10" y="55" width="100" height="10" fill="white" fillOpacity="0.1" />
                </svg>
            </div>
        </motion.section>
    )
}
