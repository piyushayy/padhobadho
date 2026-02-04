import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { LayoutDashboard, BookOpen, Trophy, Zap, Star, Library } from "lucide-react"
import { FeedbackWidget } from "@/components/feedback-widget"
import { AppHeader } from "@/components/app-header"

import { serialize } from "@/lib/utils"

export default async function AppLayout({ children, session }: { children: React.ReactNode, session: any }) {
    if (!session?.user?.id) {
        return <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-serif font-bold">Session Expired</h2>
                <Link href="/auth/sign-in" className="text-primary hover:underline font-bold">Please sign in to continue.</Link>
            </div>
        </div>
    }

    let user: any = null
    let allExams: any[] = []

    try {
        const [userData, examsData] = await Promise.all([
            prisma.user.findUnique({
                where: { id: session.user.id },
                include: { targetExam: true }
            }),
            prisma.exam.findMany({ orderBy: { code: "asc" } })
        ])
        user = userData
        allExams = examsData || []
    } catch (error) {
        console.error("Critical: Admin Layout Data Fetch Failed", error)
        // We allow the layout to render even if data fails, using defaults to prevent white screen
    }

    // Sanitize data for client components
    const sanitizedUser = user ? serialize(user) : null
    const sanitizedExams = serialize(allExams)

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
                <AppHeader user={sanitizedUser} allExams={sanitizedExams} userName={userName} userInitials={userInitials} />

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
