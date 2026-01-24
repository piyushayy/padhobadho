"use client"

import { Zap, Target } from "lucide-react"

export default function DailyTracker({
    solvedToday,
    goal
}: {
    solvedToday: number,
    goal: number
}) {
    const percentage = Math.min((solvedToday / goal) * 100, 100)

    return (
        <div className="brilliant-card bg-card p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Daily Goal Progress</span>
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <Zap size={20} fill="currentColor" />
                    </div>
                </div>

                <p className="text-5xl font-serif font-black tracking-tight mb-2">
                    {solvedToday}<span className="text-2xl opacity-30 font-sans">/{goal}</span>
                </p>

                <div className="mt-6 space-y-3">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <p className="text-[11px] font-bold text-muted-foreground">
                        {percentage === 100
                            ? "Goal achieved! You're ahead of the curve."
                            : `${goal - solvedToday} more to reach your daily target.`}
                    </p>
                </div>
            </div>

            {/* Background Icon */}
            <Target className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
        </div>
    )
}
