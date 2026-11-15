"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { Target, LayoutDashboard, Clock, TrendingUp, Sparkles } from "lucide-react"

interface StatsGridProps {
    examReadiness: number
    totalAttempted: number
    totalSessions: number
    solvedToday: number
    dailyGoal: number
}

function AnimatedNumber({ value }: { value: number }) {
    const spring = useSpring(0, { bounce: 0, duration: 1200 })
    const display = useTransform(spring, (current) => Math.round(current))
    const [rendered, setRendered] = useState(0)

    useEffect(() => {
        spring.set(value)
        const unsubscribe = display.on("change", (latest) => {
            setRendered(latest)
        })
        return () => unsubscribe()
    }, [spring, display, value])

    return <span>{rendered}</span>
}

export default function StatsGrid({ examReadiness, totalAttempted, totalSessions, solvedToday, dailyGoal }: StatsGridProps) {
    const stats = [
        {
            label: "Daily Goal",
            numeric: solvedToday,
            suffix: `/${dailyGoal}`,
            progress: Math.min(100, Math.round((solvedToday / (dailyGoal || 1)) * 100)),
            icon: <TrendingUp className="text-emerald-500" />,
            accent: "from-emerald-500 to-teal-500",
            tag: `${Math.min(100, Math.round((solvedToday / (dailyGoal || 1)) * 100))}% complete`
        },
        {
            label: "Exam Readiness",
            numeric: examReadiness,
            suffix: "%",
            progress: examReadiness,
            icon: <Target className="text-blue-500" />,
            accent: "from-blue-500 to-indigo-500",
            tag: examReadiness >= 75 ? "On track" : "Keep pushing"
        },
        {
            label: "Total Solved",
            numeric: totalAttempted,
            suffix: "",
            progress: Math.min(100, Math.round((totalAttempted / 500) * 100)),
            icon: <LayoutDashboard className="text-purple-500" />,
            accent: "from-purple-500 to-pink-500",
            tag: "Lifetime drills"
        },
        {
            label: "Mock Tests",
            numeric: totalSessions,
            suffix: "",
            progress: Math.min(100, totalSessions * 10),
            icon: <Clock className="text-amber-500" />,
            accent: "from-amber-500 to-orange-500",
            tag: totalSessions > 0 ? "Active participant" : "Ready to start"
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    transition={{ delay: 0.15 + (i * 0.08), duration: 0.5, ease: "easeOut" }}
                    className="stat-card p-6 flex flex-col justify-between group relative overflow-hidden border border-border/60 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
                >
                    {/* Top gradient accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.accent} opacity-80 group-hover:h-1.5 transition-all duration-300`} />

                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                            <div className="p-2.5 rounded-xl bg-accent/80 border border-border/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                {stat.icon}
                            </div>
                        </div>

                        <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-4xl md:text-5xl font-serif font-black tracking-tight text-foreground">
                                <AnimatedNumber value={stat.numeric} />
                            </span>
                            {stat.suffix && (
                                <span className="text-xl md:text-2xl font-bold text-muted-foreground/80 font-mono">
                                    {stat.suffix}
                                </span>
                            )}
                        </div>

                        {/* Visual mini progress bar */}
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.progress}%` }}
                                transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                                className={`h-full bg-gradient-to-r ${stat.accent} rounded-full`}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40 text-muted-foreground">
                        <span className="font-semibold">{stat.tag}</span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-primary">
                            <Sparkles size={12} className="animate-pulse" /> Live
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
