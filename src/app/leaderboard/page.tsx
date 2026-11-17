import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Crown, Trophy, Medal, Star, Sparkles, Lock, ArrowRight, Users, Globe } from "lucide-react"
import { GoogleSignInButton } from "@/components/google-sign-in-button"
import { getFollowingUserIds } from "@/actions/friends"
import { LeaderboardFollowButton } from "@/components/leaderboard-follow-button"

export const metadata: Metadata = {
    title: "Leaderboard & Friends | PadhoBadho",
    description: "All-India and Friends ranking for students on PadhoBadho.",
}

export default async function LeaderboardPage({
    searchParams
}: {
    searchParams?: Promise<{ tab?: string }>
}) {
    const session = await auth()
    const currentUserId = session?.user?.id
    const params = await searchParams
    const activeTab = params?.tab === "friends" ? "friends" : "all"
    const followingIds = await getFollowingUserIds()

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

    // Filter users if on Friends tab
    const filteredUsers = activeTab === "friends" && currentUserId
        ? topUsers.filter(u => u.id === currentUserId || followingIds.includes(u.id))
        : topUsers

    const topThree = filteredUsers.slice(0, 3)
    const restUsers = filteredUsers.slice(3)
    // Guest limit: preview top 10 (top 3 podium + ranks 4 to 10)
    const displayedUsers = !currentUserId ? restUsers.slice(0, 7) : restUsers

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

            {/* Scope Switcher: All-India vs Friends */}
            <div className="flex justify-center -mt-6 mb-6 relative z-30">
                <div className="inline-flex p-1 rounded-2xl bg-card border border-border/80 shadow-lg gap-1">
                    <Link
                        href="/leaderboard"
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            activeTab === "all"
                                ? "bg-primary text-background shadow-md shadow-primary/25"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                    >
                        <Globe size={13} /> All-India (AIR)
                    </Link>
                    <Link
                        href="/leaderboard?tab=friends"
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            activeTab === "friends"
                                ? "bg-primary text-background shadow-md shadow-primary/25"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                    >
                        <Users size={13} /> Friends ({followingIds.length})
                    </Link>
                </div>
            </div>

            <main className="container mx-auto px-4 relative z-20 max-w-4xl">
                {filteredUsers.length === 0 ? (
                    <div className="bg-card rounded-3xl border border-dashed border-border/70 p-12 text-center space-y-4 shadow-sm">
                        {activeTab === "friends" ? (
                            <Users className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                        ) : (
                            <Trophy className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                        )}
                        <h2 className="text-xl font-serif font-black text-foreground">
                            {activeTab === "friends" ? "No Friends Followed Yet" : "Hall of Fame is Open!"}
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            {activeTab === "friends"
                                ? "Follow peers on the All-India leaderboard using the '+' button to track your study buddies' XP and daily momentum!"
                                : "Be the first student to claim the #1 spot on the leaderboard. Complete a 100% free practice drill to earn XP."}
                        </p>
                        <Link
                            href={activeTab === "friends" ? "/leaderboard" : "/practice"}
                            className="inline-block px-6 py-3 bg-primary text-background font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity"
                        >
                            {activeTab === "friends" ? "Browse All-India Aspirants &rarr;" : "Start Practice &rarr;"}
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Top 3 Podium */}
                        <div className="flex flex-col md:flex-row justify-center items-end gap-4 mb-12">
                            {/* 2nd Place */}
                            {topThree[1] && (
                                <div className="order-2 md:order-1 flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full border-4 border-slate-300 bg-card overflow-hidden relative shadow-lg mb-[-10px] z-10 flex items-center justify-center">
                                        {topThree[1].image ? (
                                            <Image
                                                src={topThree[1].image}
                                                alt={topThree[1].name || "User"}
                                                width={80}
                                                height={80}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <span className="text-xl font-black text-slate-500">
                                                {topThree[1].name?.[0]?.toUpperCase() || "2"}
                                            </span>
                                        )}
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
                                    <div className="w-24 h-24 rounded-full border-4 border-yellow-400 bg-card overflow-hidden relative shadow-lg shadow-yellow-500/20 mb-[-10px] z-10 flex items-center justify-center">
                                        {topThree[0].image ? (
                                            <Image
                                                src={topThree[0].image}
                                                alt={topThree[0].name || "User"}
                                                width={96}
                                                height={96}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <span className="text-2xl font-black text-yellow-600">
                                                {topThree[0].name?.[0]?.toUpperCase() || "1"}
                                            </span>
                                        )}
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
                                    <div className="w-20 h-20 rounded-full border-4 border-amber-600 bg-card overflow-hidden relative shadow-lg mb-[-10px] z-10 flex items-center justify-center">
                                        {topThree[2].image ? (
                                            <Image
                                                src={topThree[2].image}
                                                alt={topThree[2].name || "User"}
                                                width={80}
                                                height={80}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <span className="text-xl font-black text-amber-700">
                                                {topThree[2].name?.[0]?.toUpperCase() || "3"}
                                            </span>
                                        )}
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

                            {displayedUsers.map((user, index) => (
                                <div
                                    key={user.id}
                                    className={`grid grid-cols-12 gap-4 p-4 items-center border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors ${user.id === currentUserId ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="col-span-2 md:col-span-1 text-center font-black text-muted-foreground">
                                        #{index + 4}
                                    </div>
                                    <div className="col-span-6 md:col-span-7 flex items-center justify-between pr-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                                                {user.image ? (
                                                    <Image src={user.image} alt={user.name || "User"} width={32} height={32} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs">
                                                        {user.name?.[0]?.toUpperCase() || "S"}
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`font-semibold ${user.id === currentUserId ? 'text-primary' : ''}`}>
                                                {user.name} {user.id === currentUserId && "(You)"}
                                            </span>
                                        </div>

                                        {currentUserId && user.id !== currentUserId && (
                                            <LeaderboardFollowButton
                                                targetUserId={user.id}
                                                isFollowingInitial={followingIds.includes(user.id)}
                                            />
                                        )}
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

                            {/* Guest Teaser: Blurred Rows 11+ with Unlock Banner */}
                            {!currentUserId && (
                                <div className="relative border-t border-border/60">
                                    <div className="select-none blur-sm pointer-events-none opacity-40 space-y-2 p-4">
                                        {[11, 12, 13, 14, 15].map((dummyRank) => (
                                            <div key={dummyRank} className="grid grid-cols-12 gap-4 p-3 items-center bg-muted/20 rounded-xl">
                                                <div className="col-span-2 md:col-span-1 text-center font-black text-muted-foreground">#{dummyRank}</div>
                                                <div className="col-span-6 md:col-span-7 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-muted/60" />
                                                    <span className="font-semibold text-muted-foreground">Aspirant_{dummyRank}92</span>
                                                </div>
                                                <div className="col-span-2 md:col-span-2 text-right font-mono font-bold text-muted-foreground">1,840</div>
                                                <div className="col-span-2 md:col-span-2 text-center">
                                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">Lvl 4</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/95 to-card/40 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                                            <Sparkles size={11} /> Top 10 Preview Only
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-serif font-black text-foreground mb-2">
                                            Want to see where you rank?
                                        </h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-5 leading-relaxed">
                                            Sign in free to save your XP, climb the All-India leaderboard, and view complete top-100 ranks!
                                        </p>
                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                            <GoogleSignInButton callbackUrl="/leaderboard" />
                                            <Link
                                                href="/auth/sign-up?callbackUrl=/leaderboard"
                                                className="px-5 py-3 bg-primary text-background font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                                            >
                                                <span>Sign Up Free</span>
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* Sticky Bottom Bar */}
            {currentUserId && currentUserData ? (
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
            ) : !currentUserId && (
                <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/80 p-3 sm:p-4 z-50 shadow-2xl">
                    <div className="container mx-auto max-w-4xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
                                🔥
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm font-bold text-foreground">
                                    Guest Mode Active
                                </p>
                                <p className="text-[11px] text-muted-foreground hidden sm:block">
                                    Sign in free to preserve your streak, earn XP, and get on this leaderboard.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <GoogleSignInButton callbackUrl="/leaderboard" text="Google Sign In" className="hidden sm:inline-flex py-2 px-3 text-[11px]" />
                            <Link
                                href="/auth/sign-up?callbackUrl=/leaderboard"
                                className="px-4 py-2 bg-primary text-background font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
                            >
                                Claim Rank
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
