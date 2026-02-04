"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <>
            <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-2xl font-serif font-black tracking-tight text-foreground flex items-center gap-2"
                    >
                        <span className="w-9 h-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black tracking-tighter">PB</span>
                        padhobadho
                    </Link>

                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {/* Updated nav structure based on feedback */}
                            <Link href="/" className="hover:text-primary transition-colors">
                                Home
                            </Link>
                            <Link href="/about" className="hover:text-primary transition-colors">
                                About
                            </Link>
                            <Link href="/practice" className="hover:text-primary transition-colors">
                                Practice
                            </Link>
                            <Link href="/pricing" className="hover:text-primary transition-colors">
                                Pricing
                            </Link>
                            <Link href="/auth/sign-in" className="hover:text-primary transition-colors">
                                Login
                            </Link>
                        </nav>

                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>

                        <Link href="/auth/sign-up" className="hidden md:block px-6 py-2.5 bg-foreground text-background rounded-full hover:opacity-90 transition-all text-xs font-bold uppercase tracking-widest">
                            Get Started
                        </Link>

                        {/* Mobile Toggle */}
                        <div className="flex items-center gap-4 md:hidden">
                            <ThemeToggle />
                            <button
                                className="p-2 text-foreground"
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="Toggle menu"
                            >
                                {menuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "100vh", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden fixed inset-0 top-20 bg-background z-40 border-t border-border/20 p-6"
                        >
                            <nav className="flex flex-col gap-6 text-xl font-serif font-bold">
                                <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
                                <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
                                <Link href="/practice" onClick={() => setMenuOpen(false)}>Practice</Link>
                                <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
                                <Link href="/auth/sign-in" onClick={() => setMenuOpen(false)}>Login</Link>
                                <Link href="/auth/sign-up" onClick={() => setMenuOpen(false)} className="text-primary">Get Started</Link>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
            {/* Spacer to prevent content from being hidden behind fixed header */}
            <div className="h-20" />
        </>
    )
}
