import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import Image from "next/image"
import { Crown, Trophy, Medal, Star } from "lucide-react"

export const metadata: Metadata = {
    title: "Leaderboard | PadhoBadho",
    description: "See the top performers on PadhoBadho."
}

export default async function LeaderboardPage() {
    const session = await auth()
    const currentUserId = session?.user?.id

    const topUsers = await prisma.user.findMany({
        orderBy: { xp: 'desc' },
        take: 50,
        select: {
            id: true,
            name: true,
            image: true,
            xp: true,
            level: true,
        }
    })

    // Find current user's rank if not in top 50, or just to know
    let currentUserRank = -1
    let currentUserData = null

    if (currentUserId) {
        const index = topUsers.findIndex(u => u.id === currentUserId)
        if (index !== -1) {
            currentUserRank = index + 1
            currentUserData = topUsers[index]
        } else {
            // Fetch user rank if outside top 50
            const user = await prisma.user.findUnique({
                where: { id: currentUserId },
                select: { xp: true, level: true, name: true, image: true }
            })
            if (user) {
                const count = await prisma.user.count({
                    where: { xp: { gt: user.xp } }
                })
                currentUserRank = count + 1
                currentUserData = { ...user, id: currentUserId }
            }
        }
    }

    const topThree = topUsers.slice(0, 3)
    const restUsers = topUsers.slice(3)

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-primary/5 border-b border-border py-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60 pointer-events-none" />
                <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight mb-4 relative z-10">Hall of Fame</h1>
                <p className="text-muted-foreground font-medium max-w-lg mx-auto relative z-10">
                    The most dedicated students on PadhoBadho. Keep learning to climb the ranks!
                </p>
            </div>

            <main className="container mx-auto px-4 -mt-8 relative z-20 max-w-4xl">
                {/* Top 3 Podium */}
                <div className="flex flex-col md:flex-row justify-center items-end gap-4 mb-12">
                    {/* 2nd Place */}
                    {topThree[1] && (
                        <div className="order-2 md:order-1 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full border-4 border-slate-300 bg-card overflow-hidden relative shadow-lg mb-[-10px] z-10">
                                <Image
                                    src={topThree[1].image || "/placeholder-avatar.png"}
                                    alt={topThree[1].name || "User"}
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="bg-card w-32 h-32 rounded-t-2xl border border-border shadow-xl flex flex-col items-center justify-start pt-4 relative">
                                <div className="absolute top-[-15px] bg-slate-300 text-slate-800 text-xs font-black px-2 py-0.5 rounded-full border border-slate-400">#2</div>
                                <p className="font-bold text-sm text-center px-2 line-clamp-1">{topThree[1].name}</p>
                                <p className="text-xs text-muted-foreground font-bold">{topThree[1].xp} XP</p>
                                <Medal className="w-8 h-8 text-slate-300 mt-2 opacity-50" />
                            </div>
                        </div>
                    )}

                    {/* 1st Place */}
                    {topThree[0] && (
                        <div className="order-1 md:order-2 flex flex-col items-center">
                            <div className="absolute -mt-10 animate-bounce">
                                <Crown className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                            </div>
                            <div className="w-24 h-24 rounded-full border-4 border-yellow-400 bg-card overflow-hidden relative shadow-lg shadow-yellow-500/20 mb-[-10px] z-10">
                                <Image
                                    src={topThree[0].image || "/placeholder-avatar.png"}
                                    alt={topThree[0].name || "User"}
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="bg-gradient-to-b from-yellow-50 via-card to-card w-40 h-40 rounded-t-2xl border border-yellow-200 shadow-2xl flex flex-col items-center justify-start pt-5 relative">
                                <div className="absolute top-[-15px] bg-yellow-400 text-yellow-900 text-sm font-black px-3 py-0.5 rounded-full border border-yellow-500 shadow-sm">#1</div>
                                <p className="font-bold text-base text-center px-2 line-clamp-1">{topThree[0].name}</p>
                                <p className="text-sm text-yellow-600 font-black">{topThree[0].xp} XP</p>
                                <Trophy className="w-10 h-10 text-yellow-400 mt-2" />
                            </div>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {topThree[2] && (
                        <div className="order-3 md:order-3 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full border-4 border-amber-600 bg-card overflow-hidden relative shadow-lg mb-[-10px] z-10">
                                <Image
                                    src={topThree[2].image || "/placeholder-avatar.png"}
                                    alt={topThree[2].name || "User"}
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="bg-card w-32 h-28 rounded-t-2xl border border-border shadow-xl flex flex-col items-center justify-start pt-4 relative">
                                <div className="absolute top-[-15px] bg-amber-600 text-white text-xs font-black px-2 py-0.5 rounded-full border border-amber-700">#3</div>
                                <p className="font-bold text-sm text-center px-2 line-clamp-1">{topThree[2].name}</p>
                                <p className="text-xs text-muted-foreground font-bold">{topThree[2].xp} XP</p>
                                <Medal className="w-8 h-8 text-amber-600 mt-2 opacity-50" />
                            </div>
                        </div>
                    )}
                </div>

                {/* List View */}
                <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/40 text-xs font-black uppercase text-muted-foreground tracking-widest">
                        <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                        <div className="col-span-6 md:col-span-7">Student</div>
                        <div className="col-span-2 md:col-span-2 text-right">XP</div>
                        <div className="col-span-2 md:col-span-2 text-center">Level</div>
                    </div>

                    {restUsers.map((user, index) => (
                        <div
                            key={user.id}
                            className={`grid grid-cols-12 gap-4 p-4 items-center border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors ${user.id === currentUserId ? 'bg-primary/5' : ''}`}
                        >
                            <div className="col-span-2 md:col-span-1 text-center font-black text-muted-foreground">
                                #{index + 4}
                            </div>
                            <div className="col-span-6 md:col-span-7 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                                    {user.image ? (
                                        <Image src={user.image} alt={user.name || "User"} width={32} height={32} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs">
                                            {user.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <span className={`font-semibold ${user.id === currentUserId ? 'text-primary' : ''}`}>
                                    {user.name} {user.id === currentUserId && "(You)"}
                                </span>
                            </div>
                            <div className="col-span-2 md:col-span-2 text-right font-bold font-mono text-foreground/80">
                                {user.xp.toLocaleString()}
                            </div>
                            <div className="col-span-2 md:col-span-2 text-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                                    Lvl {user.level}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Sticky Current User Rank (if not in view/top) */}
            {currentUserId && currentUserData && (
                <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border p-4 z-50">
                    <div className="container mx-auto max-w-4xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Your Rank</span>
                                <span className="text-xl font-black text-primary">#{currentUserRank}</span>
                            </div>
                            <div className="hidden md:block w-px h-8 bg-border mx-2"></div>
                            <div className="hidden md:flex flex-col">
                                <span className="font-bold">{currentUserData.name}</span>
                                <span className="text-xs text-muted-foreground">{currentUserData.xp.toLocaleString()} XP • Level {currentUserData.level}</span>
                            </div>
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">
                            Top {(currentUserRank / (topUsers.length || 1) * 100).toFixed(0)}%
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
