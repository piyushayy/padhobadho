"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, BookOpen, Trophy, Zap, Library, Star, MessageSquare, Target } from "lucide-react"
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
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Automatically close mobile menu when navigating routes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    // Prevent body scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isMobileMenuOpen])

    return (
        <header className="sticky top-0 z-40 flex h-20 md:h-24 items-center justify-between border-b border-border/40 bg-background/80 px-6 md:px-10 backdrop-blur-3xl">
            <div className="flex items-center gap-4 md:gap-8">
                {/* Mobile Burger */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
                    aria-label="Open mobile menu"
                >
                    <Menu />
                </button>

                <h1 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/50 hidden md:block border-r border-border/50 pr-8">Student Portal</h1>
                <ExamSwitcher currentExam={user?.targetExam || null} allExams={allExams} />
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="hidden md:block">
                    <ThemeToggle />
                </div>
                {user ? (
                    <Link href="/profile/settings" className="flex items-center gap-3 md:gap-5 hover:bg-muted/50 p-1.5 md:p-2.5 rounded-[1.5rem] transition-all group">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-black tracking-tight">{userName}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Student</p>
                        </div>
                        <div className="h-8 w-8 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-foreground text-background flex items-center justify-center font-black text-sm md:text-xl relative group-hover:scale-105 transition-transform">
                            {userInitials}
                        </div>
                    </Link>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            href="/auth/sign-in"
                            className="px-3 py-1.5 md:px-4 md:py-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/auth/sign-up"
                            className="px-3.5 py-1.5 md:px-4 md:py-2 text-xs font-black uppercase tracking-wider bg-primary text-background rounded-xl hover:opacity-90 transition-all shadow-md shadow-primary/20"
                        >
                            Join Free
                        </Link>
                    </div>
                )}
            </div>

            {/* Mobile Menu Rendered in Body Portal to eliminate containing block clipping */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                key="mobile-drawer-backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
                            />
                            <motion.div
                                key="mobile-drawer-panel"
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 280 }}
                                className="fixed inset-y-0 left-0 z-[101] w-4/5 max-w-xs h-full bg-white dark:bg-[#141414] border-r border-border shadow-2xl p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-serif font-black tracking-tighter text-primary">pb.</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-md">Menu</span>
                                        </div>
                                        <button
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                            aria-label="Close mobile menu"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <nav className="space-y-1.5">
                                        <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                                        <NavLink href="/practice" icon={BookOpen} label="Practice" onClick={() => setIsMobileMenuOpen(false)} />
                                        <NavLink href="/mock-test" icon={Zap} label="Mock Tests" onClick={() => setIsMobileMenuOpen(false)} />
                                        <NavLink href="/resources" icon={Library} label="Library" onClick={() => setIsMobileMenuOpen(false)} />
                                        <NavLink href="/community" icon={MessageSquare} label="Community" onClick={() => setIsMobileMenuOpen(false)} />
                                        <NavLink href="/leaderboard" icon={Trophy} label="Ranking" onClick={() => setIsMobileMenuOpen(false)} />
                                        <NavLink href="/analytics" icon={Target} label="Analytics" onClick={() => setIsMobileMenuOpen(false)} />
                                        <NavLink href="/achievements" icon={Star} label="Badges" onClick={() => setIsMobileMenuOpen(false)} />
                                    </nav>
                                </div>

                                <div className="mt-8 pt-6 border-t border-border/60 space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Theme</span>
                                        <ThemeToggle />
                                    </div>
                                    {user ? (
                                        <Link
                                            href="/profile/settings"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center font-black text-xs">
                                                    {userInitials}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-black leading-none">{userName}</p>
                                                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Account & Preferences</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Link
                                                href="/auth/sign-in"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex-1 text-center py-2.5 rounded-xl border border-border text-xs font-black uppercase tracking-wider hover:bg-muted transition-colors"
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                href="/auth/sign-up"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex-1 text-center py-2.5 rounded-xl bg-primary text-background text-xs font-black uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
                                            >
                                                Join Free
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
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
