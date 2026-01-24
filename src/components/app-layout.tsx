import { prisma } from "@/lib/prisma"
import ExamSwitcher from "@/components/exam-switcher"
import Link from "next/link"
import { LayoutDashboard, BookOpen, Trophy, Zap, Star, Check, Library } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { FeedbackWidget } from "@/components/feedback-widget"

export default async function AppLayout({ children, session }: { children: React.ReactNode, session: any }) {
    if (!session?.user?.id) {
        return <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-serif font-bold">Session Expired</h2>
                <Link href="/auth/sign-in" className="text-primary hover:underline font-bold">Please sign in to continue.</Link>
            </div>
        </div>
    }

    const [user, allExams] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.user.id },
            include: { targetExam: true }
        }).catch(() => null),
        prisma.exam.findMany({ orderBy: { code: "asc" } }).catch(() => [])
    ])

    const userName = session.user.name || "Student"
    const userInitials = userName[0]?.toUpperCase() || "S"

    return (
        <div className="min-h-screen bg-background text-foreground pb-24 lg:pb-0">
            {/* Sidebar - Desktop Only */}
            <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-border/50 bg-card lg:block shadow-2xl shadow-black/[0.02]">
                <div className="flex h-20 items-center px-10">
                    <span className="text-3xl font-serif font-black tracking-tighter text-primary">pb.</span>
                </div>
                <nav className="mt-12 space-y-3 px-6">
                    <Link href="/dashboard" className="flex items-center gap-4 rounded-[1.25rem] bg-primary/5 px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-primary transition-all">
                        <LayoutDashboard size={18} strokeWidth={3} /> Dashboard
                    </Link>
                    <Link href="/practice" className="flex items-center gap-4 rounded-[1.25rem] px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-muted-foreground/60 hover:bg-muted/50 hover:text-foreground transition-all">
                        <BookOpen size={18} strokeWidth={3} /> Practice
                    </Link>
                    <Link href="/mock-test" className="flex items-center gap-4 rounded-[1.25rem] px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-muted-foreground/60 hover:bg-muted/50 hover:text-foreground transition-all">
                        <Zap size={18} strokeWidth={3} /> Mock Tests
                    </Link>
                    <Link href="/resources" className="flex items-center gap-4 rounded-[1.25rem] px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-muted-foreground/60 hover:bg-muted/50 hover:text-foreground transition-all">
                        <Library size={18} strokeWidth={3} /> Library
                    </Link>
                    <Link href="/leaderboard" className="flex items-center gap-4 rounded-[1.25rem] px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-muted-foreground/60 hover:bg-muted/50 hover:text-foreground transition-all">
                        <Trophy size={18} strokeWidth={3} /> Ranking
                    </Link>
                    <Link href="/achievements" className="flex items-center gap-4 rounded-[1.25rem] px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-muted-foreground/60 hover:bg-muted/50 hover:text-foreground transition-all">
                        <Star size={18} strokeWidth={3} /> Badges
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-50 flex h-24 items-center justify-between border-b border-border/40 bg-background/80 px-10 backdrop-blur-3xl">
                    <div className="flex items-center gap-8">
                        <h1 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/50 hidden md:block border-r border-border/50 pr-8">Student Portal</h1>
                        <ExamSwitcher currentExam={user?.targetExam || null} allExams={allExams} />
                    </div>
                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <Link href="/profile/settings" className="flex items-center gap-5 hover:bg-muted/50 p-2.5 rounded-[1.5rem] transition-all group">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-black tracking-tight">{userName}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Student</p>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-foreground text-background flex items-center justify-center font-black text-xl relative group-hover:scale-105 transition-transform">
                                {userInitials}
                            </div>
                        </Link>
                    </div>
                </header>

                <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Nav - Hidden on Desktop */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-card/80 backdrop-blur-3xl border-t border-border/50 py-4 lg:hidden">
                <Link href="/dashboard" className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-xl text-primary bg-primary/10">
                        <LayoutDashboard size={20} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Dash</span>
                </Link>
                <Link href="/practice" className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-xl text-muted-foreground/60 group-hover:text-primary transition-colors">
                        <BookOpen size={20} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Study</span>
                </Link>
                <Link href="/mock-test" className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-xl text-muted-foreground/60 group-hover:text-primary transition-colors">
                        <Zap size={20} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Mock</span>
                </Link>
                <Link href="/resources" className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-xl text-muted-foreground/60 group-hover:text-primary transition-colors">
                        <Library size={20} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Library</span>
                </Link>
                <Link href="/leaderboard" className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-xl text-muted-foreground/60 group-hover:text-primary transition-colors">
                        <Trophy size={20} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Rank</span>
                </Link>
            </nav>
            <FeedbackWidget />
        </div>
    )
}
