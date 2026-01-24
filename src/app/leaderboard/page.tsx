import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Trophy, Medal, Star, TrendingUp, Shield } from "lucide-react"
import { getLeaderboard } from "@/actions/leaderboard"
import AppLayout from "@/components/app-layout"
import { Skeleton } from "@/components/skeletons"

function LeaderboardSkeleton() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <Skeleton className="h-10 w-64 mx-auto rounded-xl" />
                <Skeleton className="h-4 w-96 mx-auto rounded-lg" />
            </div>
            <div className="brilliant-card bg-card p-0 overflow-hidden">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="p-8 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <Skeleton className="w-12 h-12 rounded-xl" />
                            <Skeleton className="h-6 w-48" />
                        </div>
                        <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    )
}

async function LeaderboardContent() {
    const leaderboard = await getLeaderboard()

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                    <Star className="w-4 h-4 fill-current" /> Aspirant Elite
                </div>
                <h1 className="text-5xl font-serif font-black tracking-tight">Global Leaderboard</h1>
                <p className="text-muted-foreground font-medium text-lg mx-auto max-w-xl">
                    Compete with the top ambitious aspirants across India. Your rank is updated after every practice session.
                </p>
            </div>

            {/* Top 3 Podium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pb-8">
                {leaderboard.slice(0, 3).map((user, i) => {
                    const colors = [
                        "bg-amber-500 text-amber-500",
                        "bg-slate-400 text-slate-400",
                        "bg-amber-700 text-amber-700"
                    ]
                    const order = [1, 0, 2] // 2nd, 1st, 3rd for podium look
                    const podiumUser = leaderboard[order[i]]
                    if (!podiumUser) return null

                    return (
                        <div key={i} className={`brilliant-card bg-card p-8 text-center flex flex-col items-center space-y-4 ${i === 1 ? 'scale-110 border-primary ring-4 ring-primary/10 -translate-y-4' : 'opacity-80'}`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 font-serif font-black text-2xl border-4 ${colors[podiumUser.rank - 1].split(' ')[0]} bg-background`}>
                                {podiumUser.rank}
                            </div>
                            <div className="w-20 h-20 rounded-[2.5rem] bg-accent flex items-center justify-center font-black text-3xl border-2 border-border relative">
                                {podiumUser.name[0]}
                                <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-background ${colors[podiumUser.rank - 1].split(' ')[0]}`}>
                                    <Trophy size={16} strokeWidth={3} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-black truncate max-w-[150px]">{podiumUser.name}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-1">
                                    <Shield size={10} /> Level {podiumUser.level}
                                </p>
                            </div>
                            <div className="text-3xl font-serif font-black text-primary">
                                {podiumUser.score.toLocaleString()} <span className="text-xs uppercase tracking-tighter">XP</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Rest of the List */}
            <div className="brilliant-card bg-card p-0 overflow-hidden shadow-2xl">
                <div className="bg-foreground text-background p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-primary" />
                        <span className="text-sm font-black uppercase tracking-widest">Rankings updated live</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border text-left">
                                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20">Rank</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Mastery</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right font-serif">Authority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((user) => (
                                <tr key={user.userId} className="border-b border-border last:border-none group hover:bg-accent/30 transition-colors">
                                    <td className="p-8">
                                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-sm font-black group-hover:bg-primary group-hover:text-background transition-all">
                                            {user.rank}
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center font-black relative">
                                                {user.name[0]}
                                                {user.rank <= 3 && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                        <Star size={8} fill="white" className="text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-bold text-lg block">{user.name}</span>
                                                <span className="text-[10px] font-black text-muted-foreground uppercase">Level {user.level} Scholar</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <span className="text-xl font-serif font-black">{user.accuracy}%</span>
                                            <div className="h-1 w-12 bg-muted rounded-full overflow-hidden mt-1">
                                                <div className="h-full bg-primary" style={{ width: `${user.accuracy}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="inline-flex flex-col items-end">
                                            <span className="text-2xl font-serif font-black text-primary">{user.score.toLocaleString()}</span>
                                            <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Mastery XP</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default async function LeaderboardPage() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    return (
        <AppLayout session={session}>
            <Suspense fallback={<LeaderboardSkeleton />}>
                <LeaderboardContent />
            </Suspense>
        </AppLayout>
    )
}
