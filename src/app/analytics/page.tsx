import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { TrendingUp, Clock, Target, Calendar, CheckCircle2 } from "lucide-react"
import dayjs from "dayjs"

export default async function AnalyticsPage() {
    const session = await auth()
    if (!session?.user?.id) return redirect("/auth/sign-in")

    const userId = session.user.id

    // 1. Fetch User Summary (Parallelize)
    const [user, performance, recentSessions] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { xp: true, currentStreak: true, longestStreak: true, dailyGoal: true }
        }),
        prisma.userPerformanceSummary.findMany({
            where: { userId },
            include: { subject: true }
        }),
        prisma.practiceSession.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { user: false } // Just session details
        })
    ])

    // Calculate totals
    const totalQuestions = performance.reduce((acc, curr) => acc + curr.totalAttempted, 0)
    const totalCorrect = performance.reduce((acc, curr) => acc + curr.totalCorrect, 0)
    const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-primary/5 border-b border-border py-10">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h1 className="text-3xl md:text-4xl font-serif font-black tracking-tight mb-2">Performance Analytics</h1>
                    <p className="text-muted-foreground font-medium">Deep dive into your learning progress and statistics.</p>
                </div>
            </div>

            <main className="container mx-auto px-4 mt-8 max-w-5xl space-y-8">

                {/* 1. Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Overall Accuracy"
                        value={`${overallAccuracy.toFixed(1)}%`}
                        icon={Target}
                        color="text-emerald-500"
                        bg="bg-emerald-500/10"
                    />
                    <StatCard
                        title="Questions Solved"
                        value={totalQuestions.toLocaleString()}
                        icon={CheckCircle2}
                        color="text-blue-500"
                        bg="bg-blue-500/10"
                    />
                    <StatCard
                        title="Current Streak"
                        value={`${user?.currentStreak || 0} Days`}
                        icon={TrendingUp}
                        color="text-orange-500"
                        bg="bg-orange-500/10"
                    />
                    <StatCard
                        title="Total XP"
                        value={(user?.xp || 0).toLocaleString()}
                        icon={Calendar}
                        color="text-purple-500"
                        bg="bg-purple-500/10"
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* 2. Subject Mastery */}
                    <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" /> Subject Mastery
                        </h2>

                        {performance.length === 0 ? (
                            <p className="text-muted-foreground text-center py-10">No data available yet. Start practicing!</p>
                        ) : (
                            <div className="space-y-6">
                                {performance.map((p) => (
                                    <div key={p.id}>
                                        <div className="flex justify-between mb-2 text-sm">
                                            <span className="font-bold">{p.subject.name}</span>
                                            <span className="text-muted-foreground font-medium">{p.totalAccuracy.toFixed(0)}% ({p.totalCorrect}/{p.totalAttempted})</span>
                                        </div>
                                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${p.totalAccuracy >= 80 ? 'bg-emerald-500' :
                                                        p.totalAccuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${p.totalAccuracy}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 3. Recent Activity */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" /> Recent Sessions
                        </h2>

                        {recentSessions.length === 0 ? (
                            <p className="text-muted-foreground text-center py-10">No recent sessions.</p>
                        ) : (
                            <div className="space-y-4">
                                {recentSessions.map((session) => (
                                    <div key={session.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/50">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${session.score > 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {session.score}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Practice Session</p>
                                            <p className="text-xs text-muted-foreground">{dayjs(session.createdAt).format("MMM D, h:mm A")}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    )
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{title}</p>
                <p className="text-2xl font-black">{value}</p>
            </div>
        </div>
    )
}
