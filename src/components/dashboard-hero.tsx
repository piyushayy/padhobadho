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

            {/* Content */}
            <div className="relative z-10 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-6 leading-[1.1]">
                        Your journey to <br />
                        <motion.span
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="text-primary italic inline-block relative"
                        >
                            {examCode || "CUET"} Excellence.
                            <motion.div
                                className="absolute -bottom-2 left-0 h-1.5 bg-primary/30 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 1, duration: 1 }}
                            />
                        </motion.span>
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xl opacity-70 font-medium mb-10 max-w-md leading-relaxed"
                >
                    {targetUniversity
                        ? `Destined for ${targetUniversity}. You've tackled ${totalAttempted} practice questions so far.`
                        : totalAttempted > 0
                            ? `Great progress! You've tackled ${totalAttempted} practice questions. Keep the momentum going.`
                            : "Welcome! Start your first practice session to begin your journey to success."}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-wrap gap-6"
                >
                    <Link href="/practice" className="h-16 px-10 bg-white text-black rounded-full font-black flex items-center gap-3 hover:scale-105 transition-all shadow-2xl active:scale-95">
                        Continue Learning <ChevronRight size={20} strokeWidth={3} />
                    </Link>
                    <Link href="/mock-test" className="h-16 px-10 bg-primary text-white rounded-full font-black flex items-center gap-3 hover:scale-105 transition-all shadow-2xl active:scale-95">
                        Take Mock Test <Zap size={20} fill="currentColor" />
                    </Link>
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
