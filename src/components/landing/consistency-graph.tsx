"use client"

import { motion } from "framer-motion"
import { BarChart, Zap } from "lucide-react"

export default function ConsistencyMonitor() {
    // Colors from the reference image
    const colors = {
        yellow: "#FCD34D", // Mon
        orange: "#FDBA74", // Tue
        green: "#6EE7B7", // Wed (winning)
    }

    const bars = [
        { day: "Mon", height: "60%", color: "bg-yellow-300", iconColor: "text-yellow-600" },
        { day: "Tue", height: "75%", color: "bg-orange-300", iconColor: "text-orange-600" },
        { day: "Wed", height: "100%", color: "bg-emerald-400", iconColor: "text-emerald-700", active: true },
    ]

    return (
        <section className="py-24 bg-background overflow-hidden relative">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

                {/* Visual Side (Graph) */}
                <div className="relative flex items-center justify-center min-h-[400px]">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/20 via-orange-300/20 to-emerald-300/20 blur-[100px] rounded-full opacity-50" />

                    <div className="relative z-10 flex items-end gap-6 md:gap-12 pl-4 pb-12">
                        {bars.map((bar, index) => (
                            <div key={bar.day} className="flex flex-col items-center gap-4 relative">
                                {/* Floating Badge */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + index * 0.2 }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${bar.active ? "bg-emerald-500 text-white scale-125 -translate-y-2" : "bg-yellow-400 text-yellow-900"
                                        }`}
                                >
                                    <Zap size={20} fill="currentColor" />
                                </motion.div>

                                {/* Bar */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: 200 }} // Base height unit, custom per bar via variants could be better but simplicity works
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: index * 0.2, type: "spring" }}
                                    className={`w-16 md:w-24 rounded-t-[2.5rem] relative ${bar.color}`}
                                    style={{ height: "40px" }} // Initial Placeholder
                                    animate={{ height: bar.active ? 280 : (index === 1 ? 220 : 160) }} // Simple programmatic height
                                >
                                </motion.div>

                                {/* Label */}
                                <p className={`font-black uppercase tracking-widest text-sm ${bar.active ? "text-emerald-500" : "text-muted-foreground/50"}`}>
                                    {bar.day}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Side */}
                <div className="space-y-8 relative z-20">
                    <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tight leading-[1.1]">
                        Consistency <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-emerald-400">Wins.</span>
                    </h2>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-lg">
                        Finish every day smarter with engaging lessons, competitive leaderboards, and daily streak protection. We make consistency addictive.
                    </p>

                    <div className="flex gap-8 border-t border-border/50 pt-8">
                        <div>
                            <div className="text-3xl font-black text-foreground">21 Days</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Habit Formation</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-foreground">100+</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Daily Challenges</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
