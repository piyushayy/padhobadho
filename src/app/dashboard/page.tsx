import { Suspense } from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Target,
    Clock,
    ChevronRight,
    TrendingUp,
    BrainCircuit,
    Zap,
    LayoutDashboard,
    Flame,
    Star,
    Trophy,
    Award
} from "lucide-react"
import { getTopicMastery, getExamReadiness } from "@/actions/analytics"
import { getUserRank } from "@/actions/leaderboard"
import { DashboardSkeleton } from "@/components/skeletons"
import AppLayout from "@/components/app-layout"
import DashboardHero from "@/components/dashboard-hero"
import StatsGrid from "@/components/stats-grid"

async function DashboardContent() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    // Start of today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Fetch dynamic analytics and stats
    const [user, topicMastery, examReadiness, totalSessions, totalAttempted, solvedToday, globalRank, achievements] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                onboardingCompleted: true,
                targetUniversity: true,
                stream: true,
                dailyGoal: true,
                level: true,
                xp: true,
                currentStreak: true,
                targetExam: {
                    select: {
                        name: true,
                        code: true
                    }
                }
            }
        }),
        getTopicMastery(),
        getExamReadiness(),
        prisma.mockSession.count({ where: { userId: session.user.id } }),
        prisma.userQuestionHistory.count({ where: { userId: session.user.id } }),
        prisma.sessionQuestion.count({
            where: {
                OR: [
                    { practiceSession: { userId: session.user.id } },
                    { mockSession: { userId: session.user.id } }
                ],
                createdAt: { gte: today }
            }
        }),
        getUserRank(session.user.id),
        prisma.userAchievement.findMany({
            where: { userId: session.user.id },
            include: { achievement: true },
            take: 5,
            orderBy: { unlockedAt: "desc" }
        })
    ])

    if (!user?.onboardingCompleted) redirect("/onboarding")

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <DashboardHero
                examCode={user?.targetExam?.code || "CUET"}
                targetUniversity={user?.targetUniversity}
                totalAttempted={totalAttempted}
            />

            <StatsGrid
                examReadiness={examReadiness}
                totalAttempted={totalAttempted}
                totalSessions={totalSessions}
                solvedToday={solvedToday}
                dailyGoal={user.dailyGoal || 20}
            />

            {/* Subject & Progress Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <section className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-serif font-black tracking-tight">Subject Mastery</h3>
                        <Link href="/practice" className="text-sm font-bold text-primary hover:underline underline-offset-4 tracking-tight">View All Subjects</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {topicMastery.length === 0 ? (
                            <div className="md:col-span-2 py-24 border-2 border-dashed border-border rounded-[3rem] text-center bg-accent/20">
                                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Zap className="text-muted-foreground" size={24} />
                                </div>
                                <p className="text-muted-foreground font-bold mb-2">No practice data yet.</p>
                                <p className="text-sm text-muted-foreground mb-8">Start a 15-question drill to see your mastery score.</p>
                                <Link href="/practice" className="px-8 py-3 bg-primary text-background rounded-full text-sm font-black inline-block hover:opacity-90">Start Now</Link>
                            </div>
                        ) : (
                            topicMastery.map((stat: any, i: number) => (
                                <div key={i} className="brilliant-card bg-card flex items-center justify-between p-8 group hover:border-primary/50 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-accent rounded-[1.5rem] flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all shadow-sm">
                                            <BrainCircuit size={32} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold tracking-tight">{stat.subject}</h4>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{stat.totalAttempts} Solved</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-serif font-black">{stat.percentage}%</p>
                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">Mastery</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <aside className="space-y-8">
                    <h3 className="text-2xl font-serif font-black tracking-tight">Your Stats</h3>

                    {/* Level Card */}
                    <Link href="/leaderboard" className="block transform transition-all hover:scale-[1.02] active:scale-95">
                        <div className="brilliant-card bg-primary text-background p-8 space-y-6 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Global Rank: #{globalRank}</span>
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                                <h4 className="text-4xl font-serif font-black">Level {user?.level || 1}</h4>
                                <div className="space-y-2 mt-6">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span>XP: {user?.xp || 0} ✨</span>
                                        <span>{1000 - ((user?.xp || 0) % 1000)} to Level Up</span>
                                    </div>
                                    <div className="h-1.5 bg-background/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-background transition-all duration-1000"
                                            style={{ width: `${((user?.xp || 0) % 1000) / 10}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Trophy className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
                        </div>
                    </Link>

                    {/* Streak Card */}
                    <div className="brilliant-card bg-card p-8 border border-border/40 flex items-center justify-between group">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Current Streak</p>
                            <h4 className="text-3xl font-black mt-1">{(user?.currentStreak || 0)} Days</h4>
                            <p className="text-[10px] font-bold text-emerald-500 mt-1">Keep it burning!</p>
                        </div>
                        <div className={`p-4 rounded-2xl transition-all duration-500 ${(user?.currentStreak || 0) > 0 ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20 scale-110" : "bg-muted text-muted-foreground"}`}>
                            <Flame size={28} fill={(user?.currentStreak || 0) > 0 ? "currentColor" : "none"} />
                        </div>
                    </div>
                </aside>
            </div>

            <section className="space-y-6 pt-8 border-t border-border/40">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-serif font-black tracking-tight">Recent Achievements</h3>
                    <Link href="/achievements" className="text-sm font-bold text-primary hover:underline underline-offset-4 tracking-tight">View Collection</Link>
                </div>

                <div className="flex flex-wrap gap-4">
                    {achievements.length === 0 ? (
                        <p className="text-sm font-medium text-muted-foreground italic">No achievements unlocked yet. Start practicing to earn your first badge!</p>
                    ) : (
                        achievements.map((ua: any) => (
                            <div key={ua.id} className="brilliant-card bg-card p-4 border flex items-center gap-4 group hover:border-primary transition-all">
                                <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{ua.achievement.icon || "🏆"}</div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest">{ua.achievement.name}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground">{new Date(ua.unlockedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    )
}

export default async function DashboardPage() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    return (
        <AppLayout session={session}>
            <Suspense fallback={<DashboardSkeleton />}>
                <DashboardContent />
            </Suspense>
        </AppLayout>
    )
}
