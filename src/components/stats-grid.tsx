"use client"

import { motion } from "framer-motion"
import { Target, LayoutDashboard, Clock, TrendingUp } from "lucide-react"

interface StatsGridProps {
    examReadiness: number
    totalAttempted: number
    totalSessions: number
    solvedToday: number
    dailyGoal: number
}

export default function StatsGrid({ examReadiness, totalAttempted, totalSessions, solvedToday, dailyGoal }: StatsGridProps) {
    const stats = [
        { label: "Daily Goal", value: `${solvedToday}/${dailyGoal}`, icon: <TrendingUp className="text-primary" /> },
        { label: "Exam Readiness", value: `${examReadiness}%`, icon: <Target className="text-primary" /> },
        { label: "Total Solved", value: totalAttempted, icon: <LayoutDashboard className="text-primary" /> },
        { label: "Mock tests", value: totalSessions, icon: <Clock className="text-primary" /> },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5, borderColor: "var(--primary)" }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="brilliant-card bg-card p-8 flex flex-col justify-between group h-full border border-border hover:shadow-xl transition-all"
                >
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                        <div className="p-2 rounded-lg bg-accent group-hover:scale-110 transition-transform">
                            {stat.icon}
                        </div>
                    </div>
                    <p className="text-5xl font-serif font-black tracking-tight mb-2">{stat.value}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary">
                        <TrendingUp size={14} strokeWidth={3} /> Updated now
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
