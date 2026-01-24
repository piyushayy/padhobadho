import { Suspense } from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Trophy,
    ShieldCheck,
    Zap,
    Target,
    Flame,
    ArrowRight,
    Star,
    Lock,
    Medal,
    Crown,
    Award,
    Sparkles
} from "lucide-react"
import AppLayout from "@/components/app-layout"
import { Skeleton } from "@/components/skeletons"

const ICON_MAP = {
    "Badge": Award,
    "MedalBronze": Medal,
    "MedalSilver": Medal,
    "MedalGold": Medal,
    "TrophyDiamond": Trophy,
    "Target": Target,
    "Star": Star,
    "Zap": Zap,
    "TrophyGold": Trophy,
    "ShieldCheck": ShieldCheck
}

function AchievementsSkeleton() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-24 w-48 rounded-[2rem]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
                ))}
            </div>
        </div>
    )
}

async function AchievementsContent() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    const [allAchievements, userAchievements] = await Promise.all([
        prisma.achievement.findMany(),
        prisma.userAchievement.findMany({
            where: { userId: session.user.id }
        })
    ])

    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId))

    const categories = [
        { name: "Trophies", items: allAchievements.filter(a => a.icon?.includes("Trophy")) },
        { name: "Medals", items: allAchievements.filter(a => a.icon?.includes("Medal")) },
        { name: "Skill Badges", items: allAchievements.filter(a => !a.icon?.includes("Trophy") && !a.icon?.includes("Medal")) }
    ]

    return (
        <div className="space-y-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                        <Trophy size={14} /> Hall of Fame
                    </div>
                    <h1 className="text-6xl font-serif font-black tracking-tight leading-[0.9]">Your Legacy.</h1>
                    <p className="text-muted-foreground font-medium text-xl max-w-xl">
                        Track your ascent to North Campus. Unlock milestones, earn elite badges, and build your profile.
                    </p>
                </div>
                <div className="bg-foreground text-background rounded-[2.5rem] px-10 py-8 flex items-center gap-8 shadow-2xl shadow-foreground/20">
                    <div className="w-16 h-16 bg-primary rounded-[1.25rem] flex items-center justify-center rotate-3">
                        <Star className="w-8 h-8 text-background" fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-4xl font-serif font-black">{userAchievements.length}</p>
                        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Milestones</p>
                    </div>
                </div>
            </div>

            {/* Categorized Content */}
            {categories.map((cat, idx) => (
                <div key={idx} className="space-y-10">
                    <div className="flex items-center gap-6">
                        <h2 className="text-3xl font-serif font-black">{cat.name}</h2>
                        <div className="h-px flex-1 bg-border/50" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cat.items.map((achievement) => {
                            const isUnlocked = unlockedIds.has(achievement.id)
                            const IconComponent = (ICON_MAP as any)[achievement.icon || ""] || ShieldCheck
                            const isTrophy = cat.name === "Trophies"

                            return (
                                <div
                                    key={achievement.id}
                                    className={`brilliant-card p-10 group relative flex flex-col items-center text-center space-y-8 transition-all duration-500 rounded-[3rem] ${!isUnlocked ? "opacity-30 grayscale hover:opacity-50" : "hover:border-primary border-transparent shadow-2xl shadow-primary/5 scale-100 hover:scale-[1.02]"
                                        }`}
                                >
                                    <div className={`w-32 h-32 rounded-[3.5rem] flex items-center justify-center relative transition-shadow duration-500 ${isUnlocked ? "bg-primary/10 text-primary border-2 border-primary/20 shadow-xl shadow-primary/5" : "bg-muted text-muted-foreground/40 border-2 border-transparent"
                                        }`}>
                                        <IconComponent className={`w-16 h-16 ${isUnlocked ? "animate-in zoom-in-50 duration-700" : ""}`} strokeWidth={isTrophy ? 2.5 : 1.5} />
                                        {!isUnlocked && (
                                            <div className="absolute -top-3 -right-3 bg-foreground text-background w-10 h-10 rounded-full flex items-center justify-center border-4 border-background">
                                                <Lock size={16} strokeWidth={3} />
                                            </div>
                                        )}
                                        {isUnlocked && isTrophy && (
                                            <div className="absolute -top-3 -right-3 bg-primary text-background w-10 h-10 rounded-full flex items-center justify-center border-4 border-background animate-bounce">
                                                <Sparkles size={16} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black tracking-tight">{achievement.name}</h3>
                                        <p className="text-base text-muted-foreground font-medium leading-relaxed">{achievement.description}</p>
                                    </div>

                                    {isUnlocked && (
                                        <div className="pt-4 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                            <Flame size={16} fill="currentColor" strokeWidth={0} /> Milestone Achieved
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}

            {/* Path Progression Summary */}
            <section className="bg-foreground text-background rounded-[4rem] p-16 overflow-hidden relative shadow-2xl shadow-foreground/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48" />
                <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-serif font-black leading-tight">Your Path to <br />North Campus Elite</h2>
                            <p className="text-lg opacity-70 font-medium">
                                We've mapped every step of your preparation. From your first drill to mock test mastery, every action builds your legacy.
                            </p>
                        </div>
                        <Link href="/practice" className="h-16 px-12 bg-primary text-background rounded-full inline-flex items-center gap-4 text-lg font-black hover:scale-105 active:scale-95 transition-all">
                            Continue Your Climb <ArrowRight strokeWidth={3} />
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {[
                            { step: 1, name: "Apprentice", icon: Award, complete: userAchievements.length >= 1 },
                            { step: 2, name: "Bronze Rank", icon: Medal, complete: userAchievements.length >= 2 },
                            { step: 3, name: "Master Rank", icon: Trophy, complete: userAchievements.length >= 5 },
                            { step: 4, name: "North Campus Legend", icon: Crown, complete: userAchievements.length >= 10 },
                        ].map((s, i) => (
                            <div key={i} className={`flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all ${s.complete ? "bg-primary/20 border-primary/30" : "bg-background/10 border-background/20 opacity-40"}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.complete ? "bg-primary text-background" : "bg-background/10"}`}>
                                    <s.icon size={24} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Step 0{s.step}</p>
                                    <p className="text-xl font-bold">{s.name}</p>
                                </div>
                                {s.complete && <Sparkles className="text-primary animate-pulse" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default async function AchievementsPage() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    return (
        <AppLayout session={session}>
            <Suspense fallback={<AchievementsSkeleton />}>
                <AchievementsContent />
            </Suspense>
        </AppLayout>
    )
}
