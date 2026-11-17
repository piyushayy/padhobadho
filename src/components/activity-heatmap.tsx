"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Flame, Calendar, Sparkles } from "lucide-react"

interface ActivityHeatmapProps {
    data: Record<string, number>
    currentStreak?: number
    longestStreak?: number
    className?: string
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"]

export function ActivityHeatmap({
    data = {},
    currentStreak = 0,
    longestStreak = 0,
    className = ""
}: ActivityHeatmapProps) {
    const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null)

    // Construct 16 weeks (112 days) grid
    const { weeks, monthLabels, totalSolved, activeDays } = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Find ending Sunday or today
        const totalDays = 112 // 16 weeks * 7 days
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - (totalDays - 1))

        // Adjust so startDate is a Monday
        const startDay = startDate.getDay()
        const offset = (startDay + 6) % 7
        startDate.setDate(startDate.getDate() - offset)

        const days: { dateStr: string; displayDate: string; count: number; month: number }[] = []
        let solvedSum = 0
        let activeCount = 0

        const cur = new Date(startDate)
        while (cur <= today || days.length % 7 !== 0) {
            const dateStr = cur.toISOString().split("T")[0]
            const count = data[dateStr] || 0
            if (count > 0) {
                solvedSum += count
                activeCount += 1
            }

            days.push({
                dateStr,
                displayDate: cur.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                count,
                month: cur.getMonth()
            })

            cur.setDate(cur.getDate() + 1)
        }

        // Group into weeks of 7
        const weekCols: (typeof days)[] = []
        for (let i = 0; i < days.length; i += 7) {
            weekCols.push(days.slice(i, i + 7))
        }

        // Derive month labels
        const months: { label: string; colIndex: number }[] = []
        let lastMonth = -1
        weekCols.forEach((week, colIdx) => {
            const firstDayMonth = week[0]?.month
            if (firstDayMonth !== undefined && firstDayMonth !== lastMonth) {
                months.push({ label: MONTH_NAMES[firstDayMonth], colIndex: colIdx })
                lastMonth = firstDayMonth
            }
        })

        return {
            weeks: weekCols,
            monthLabels: months,
            totalSolved: solvedSum,
            activeDays: activeCount
        }
    }, [data])

    function getCellColor(count: number) {
        if (count === 0) return "bg-muted/40 border-border/40 hover:border-primary/40"
        if (count <= 3) return "bg-emerald-500/30 border-emerald-500/40 hover:bg-emerald-500/45"
        if (count <= 8) return "bg-emerald-500/65 border-emerald-500/70 hover:bg-emerald-500/80"
        return "bg-emerald-500 border-emerald-400 hover:bg-emerald-400"
    }

    return (
        <div className={`bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 ${className}`}>
            {/* Header & Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
                        <Calendar size={11} /> Consistency Engine
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-foreground">
                        Practice Intensity Heatmap
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                        {totalSolved} questions solved across {activeDays} active days over the last 16 weeks.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-3.5 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-wider text-orange-500 leading-tight">Streak</p>
                            <p className="text-sm font-black text-foreground">{currentStreak} Days</p>
                        </div>
                    </div>
                    {longestStreak > 0 && (
                        <div className="px-3.5 py-2 rounded-2xl bg-muted/60 border border-border/60 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground leading-tight">Record</p>
                                <p className="text-sm font-black text-foreground">{longestStreak} Days</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto pb-2 scrollbar-hide">
                <div className="inline-block min-w-full">
                    {/* Month Labels */}
                    <div className="flex text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2 pl-7">
                        {weeks.map((_, colIdx) => {
                            const month = monthLabels.find(m => m.colIndex === colIdx)
                            return (
                                <div key={colIdx} className="w-3.5 mr-1 text-left shrink-0">
                                    {month ? month.label : ""}
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex gap-1.5 items-start">
                        {/* Day of Week Labels */}
                        <div className="flex flex-col gap-1 text-[9px] font-bold text-muted-foreground/80 pr-2 select-none shrink-0">
                            {DAY_LABELS.map((label, idx) => (
                                <span key={idx} className="h-3.5 leading-[14px]">
                                    {label}
                                </span>
                            ))}
                        </div>

                        {/* Week Columns */}
                        <div className="flex gap-1">
                            {weeks.map((week, wIdx) => (
                                <div key={wIdx} className="flex flex-col gap-1">
                                    {week.map((day) => (
                                        <div
                                            key={day.dateStr}
                                            onMouseEnter={() => setHoveredDay({ date: day.displayDate, count: day.count })}
                                            onMouseLeave={() => setHoveredDay(null)}
                                            className={`w-3.5 h-3.5 rounded-[3px] border transition-all cursor-pointer ${getCellColor(day.count)}`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Tooltip or Live Legend */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground pt-2 gap-3">
                <div className="font-semibold text-foreground/90 h-5">
                    {hoveredDay ? (
                        <span className="inline-flex items-center gap-1.5">
                            <span className="font-black text-primary">{hoveredDay.count} questions</span> solved on {hoveredDay.date}
                        </span>
                    ) : (
                        <span className="text-muted-foreground">Hover over any day to view daily solve count</span>
                    )}
                </div>

                {/* Heatmap Legend */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Less</span>
                    <span className="w-3 h-3 rounded-[2px] bg-muted/40 border border-border/40" />
                    <span className="w-3 h-3 rounded-[2px] bg-emerald-500/30 border border-emerald-500/40" />
                    <span className="w-3 h-3 rounded-[2px] bg-emerald-500/65 border border-emerald-500/70" />
                    <span className="w-3 h-3 rounded-[2px] bg-emerald-500 border border-emerald-400" />
                    <span>More</span>
                </div>
            </div>
        </div>
    )
}
