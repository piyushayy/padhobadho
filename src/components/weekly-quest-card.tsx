"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Sparkles, CheckCircle2, Flame, Snowflake, ArrowRight, Loader2 } from "lucide-react"
import { claimWeeklyQuestBonus, spendStreakFreeze, StreakFreezeStatus, WeeklyQuestStatus } from "@/actions/gamification"
import { toast } from "sonner"
import confetti from "canvas-confetti"

interface WeeklyQuestCardProps {
    quest: WeeklyQuestStatus
    freeze: StreakFreezeStatus
    currentStreak?: number
}

export function WeeklyQuestCard({ quest: initialQuest, freeze: initialFreeze, currentStreak = 0 }: WeeklyQuestCardProps) {
    const [quest, setQuest] = useState(initialQuest)
    const [freeze, setFreeze] = useState(initialFreeze)
    const [isClaiming, setIsClaiming] = useState(false)
    const [isEquipping, setIsEquipping] = useState(false)

    async function handleClaim() {
        setIsClaiming(true)
        try {
            const res = await claimWeeklyQuestBonus()
            if (res.success) {
                toast.success(res.message)
                setQuest(prev => ({ ...prev, isClaimed: true }))
                confetti({
                    particleCount: 200,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#10b981', '#f59e0b', '#3b82f6']
                })
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Failed to claim weekly bonus")
        } finally {
            setIsClaiming(false)
        }
    }

    async function handleEquipFreeze() {
        setIsEquipping(true)
        try {
            const res = await spendStreakFreeze()
            if (res.success) {
                toast.success(res.message)
                setFreeze(prev => ({ ...prev, equipped: true }))
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Failed to equip streak freeze")
        } finally {
            setIsEquipping(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weekly Quest Bento Card (2 Cols) */}
            <div className="md:col-span-2 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 border border-border/80 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-between space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Trophy size={12} /> Weekly Quest
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                            <Sparkles size={12} /> +{quest.bonusXp} XP Reward
                        </span>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                        Resets every Monday
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-serif font-black tracking-tight text-foreground">
                            Solve {quest.target} Questions this Week
                        </h3>
                        <span className="text-sm font-black font-mono text-foreground">
                            {quest.solvedThisWeek} / {quest.target} Qs
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 w-full bg-muted/60 rounded-full overflow-hidden border border-border/40 p-0.5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${quest.progressPercent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        />
                    </div>

                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        {quest.isCompleted
                            ? "Quest goal achieved! 🔥 Claim your +250 XP bonus below to surge ahead on the Hall of Fame."
                            : `${quest.target - quest.solvedThisWeek} more questions to unlock this week's +250 XP boost.`}
                    </p>
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                    {quest.isCompleted ? (
                        quest.isClaimed ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider border border-emerald-500/20">
                                <CheckCircle2 size={14} /> Bonus Claimed (+{quest.bonusXp} XP)
                            </div>
                        ) : (
                            <button
                                onClick={handleClaim}
                                disabled={isClaiming}
                                className="px-6 py-3 bg-primary text-background font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isClaiming ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                <span>Claim +{quest.bonusXp} XP Bonus</span>
                            </button>
                        )
                    ) : (
                        <div className="text-xs font-bold text-muted-foreground">
                            {quest.progressPercent}% Completed
                        </div>
                    )}
                </div>
            </div>

            {/* Streak Freeze Card (1 Col) */}
            <div className="bg-card p-6 sm:p-8 border border-border/80 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center text-xl">
                        <Snowflake size={24} className="animate-pulse" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        freeze.usedThisWeek
                            ? "bg-muted text-muted-foreground"
                            : freeze.equipped
                                ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20"
                                : "bg-primary/10 text-primary"
                    }`}>
                        {freeze.usedThisWeek ? "Used this week" : freeze.equipped ? "Active • 1/1" : "Available"}
                    </span>
                </div>

                <div className="space-y-1.5">
                    <h4 className="text-xl font-serif font-black tracking-tight text-foreground flex items-center gap-1.5">
                        Streak Freeze ❄️
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {freeze.usedThisWeek
                            ? "Protected your streak this week! Resets next Monday with a fresh freeze."
                            : "Equipped automatically. If life gets busy and you miss a day, your streak will not reset to 1."}
                    </p>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <span>Flame: {currentStreak} Days 🔥</span>
                    {!freeze.equipped && !freeze.usedThisWeek && (
                        <button
                            onClick={handleEquipFreeze}
                            disabled={isEquipping}
                            className="text-primary hover:underline font-black text-xs uppercase tracking-wider"
                        >
                            Equip Freeze
                        </button>
                    )}
                    {freeze.equipped && (
                        <span className="text-cyan-500 font-bold">Protected</span>
                    )}
                </div>
            </div>
        </div>
    )
}
