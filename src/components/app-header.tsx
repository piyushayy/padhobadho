"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, LayoutDashboard, BookOpen, Trophy, Zap, Library, Star } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import ExamSwitcher from "@/components/exam-switcher"
import { motion, AnimatePresence } from "framer-motion"

interface AppHeaderProps {
    user: any
    allExams: any[]
    userName: string
    userInitials: string
}

export function AppHeader({ user, allExams, userName, userInitials }: AppHeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 flex h-20 md:h-24 items-center justify-between border-b border-border/40 bg-background/80 px-6 md:px-10 backdrop-blur-3xl">
            <div className="flex items-center gap-4 md:gap-8">
                {/* Mobile Burger */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
                >
                    <Menu />
                </button>

                <h1 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/50 hidden md:block border-r border-border/50 pr-8">Student Portal</h1>
                <ExamSwitcher currentExam={user?.targetExam || null} allExams={allExams} />
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden md:block">
                    <ThemeToggle />
                </div>
                <Link href="/profile/settings" className="flex items-center gap-3 md:gap-5 hover:bg-muted/50 p-1.5 md:p-2.5 rounded-[1.5rem] transition-all group">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-black tracking-tight">{userName}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Student</p>
                    </div>
                    <div className="h-8 w-8 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-foreground text-background flex items-center justify-center font-black text-sm md:text-xl relative group-hover:scale-105 transition-transform">
                        {userInitials}
                    </div>
                </Link>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-card border-r border-border shadow-2xl p-6 lg:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-2xl font-serif font-black tracking-tighter text-primary">pb.</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-muted-foreground">
                                    <X />
                                </button>
                            </div>

                            <nav className="space-y-2">
                                <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                                <NavLink href="/practice" icon={BookOpen} label="Practice" onClick={() => setIsMobileMenuOpen(false)} />
                                <NavLink href="/mock-test" icon={Zap} label="Mock Tests" onClick={() => setIsMobileMenuOpen(false)} />
                                <NavLink href="/resources" icon={Library} label="Library" onClick={() => setIsMobileMenuOpen(false)} />
                                <NavLink href="/leaderboard" icon={Trophy} label="Ranking" onClick={() => setIsMobileMenuOpen(false)} />
                                <NavLink href="/achievements" icon={Star} label="Badges" onClick={() => setIsMobileMenuOpen(false)} />
                            </nav>

                            <div className="mt-8 pt-8 border-t border-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Theme</span>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    )
}

function NavLink({ href, icon: Icon, label, onClick }: any) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"
        >
            <Icon size={18} strokeWidth={3} />
            {label}
        </Link>
    )
}
