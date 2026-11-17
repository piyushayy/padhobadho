"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Trophy, Zap, Star, Library, MessageSquare, Target, Swords, GraduationCap } from "lucide-react"

const NAV_ITEMS = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/courses", icon: GraduationCap, label: "Courses" },
    { href: "/battle", icon: Swords, label: "1v1 Battle" },
    { href: "/practice", icon: BookOpen, label: "Practice" },
    { href: "/mock-test", icon: Zap, label: "Mock Tests" },
    { href: "/contest", icon: Trophy, label: "Sunday Arena" },
    { href: "/analytics", icon: Target, label: "Analytics" },
    { href: "/resources", icon: Library, label: "Library" },
    { href: "/community", icon: MessageSquare, label: "Community" },
    { href: "/leaderboard", icon: Trophy, label: "Ranking" },
    { href: "/achievements", icon: Star, label: "Badges" },
]

export function DesktopSidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-border/50 bg-card lg:block shadow-2xl shadow-black/[0.02]">
            <div className="flex h-20 items-center px-10">
                <span className="text-3xl font-serif font-black tracking-tighter text-primary">pb.</span>
            </div>
            <nav className="mt-8 space-y-2 px-6">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 rounded-[1.25rem] px-5 py-3.5 text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                                isActive
                                    ? "bg-primary/10 text-primary font-black shadow-xs shadow-primary/5 translate-x-1"
                                    : "text-muted-foreground/60 hover:bg-muted/50 hover:text-foreground"
                            }`}
                        >
                            <Icon size={18} strokeWidth={isActive ? 3 : 2.5} className={isActive ? "text-primary" : ""} />
                            <span>{item.label}</span>
                            {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}

const BOTTOM_NAV_ITEMS = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dash" },
    { href: "/practice", icon: BookOpen, label: "Study" },
    { href: "/mock-test", icon: Zap, label: "Mock" },
    { href: "/resources", icon: Library, label: "Library" },
    { href: "/leaderboard", icon: Trophy, label: "Rank" },
]

export function MobileBottomNav() {
    const pathname = usePathname()

    return (
        <nav
            aria-label="Mobile navigation"
            className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-card/95 backdrop-blur-2xl border-t border-border/50 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] px-2 lg:hidden shadow-lg shadow-black/10"
        >
            {BOTTOM_NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href)

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center gap-1 group py-1 px-3 min-w-[56px] min-h-[48px] justify-center rounded-xl transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                        <div
                            className={`p-2 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? "text-primary bg-primary/15 scale-105 shadow-xs shadow-primary/10"
                                    : "text-muted-foreground/60 group-hover:text-foreground"
                            }`}
                        >
                            <Icon size={20} strokeWidth={isActive ? 3 : 2} />
                        </div>
                        <span
                            className={`text-[10px] uppercase tracking-widest transition-colors ${
                                isActive ? "font-black text-primary" : "font-bold text-muted-foreground/70"
                            }`}
                        >
                            {item.label}
                        </span>
                    </Link>
                )
            })}
        </nav>
    )
}
