"use client"

import Link from "next/link"
import { useState, useMemo, useEffect } from "react"
import { ArrowRight, Sparkles, Quote, MoveRight, Menu, X, CheckCircle2, Moon, Sun, Zap, Brain, Target, BarChart3, Calculator, Code2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

const testimonials = [
    {
        quote: "I was drowning in study materials. Padhobadho gave me the structure I was missing. It felt like someone finally turned on the lights.",
        author: "Aditya S.",
        role: "IIT Bombay '26",
        exam: "JEE Advanced"
    },
    {
        quote: "The interface is so calm, it actually made me want to study. I went from anxious to confident in three months.",
        author: "Priya M.",
        role: "IIM Ahmedabad '25",
        exam: "CAT 2024"
    },
    {
        quote: "No noise. No ads. Just pure, high-quality practice. This isn't just a website; it's a sanctuary for serious aspirants.",
        author: "Rahul K.",
        role: "AIIMS Delhi '27",
        exam: "NEET UG"
    },
    {
        quote: "The analytics breakdown helps me pinpoint exactly where I'm losing marks. It's surgical precision for my prep.",
        author: "Vikram R.",
        role: "NLSIU '28",
        exam: "CLAT"
    },
    {
        quote: "Adaptive difficulty is a game changer. I never feel bored or overwhelmed, just constantly challenged.",
        author: "Sneha G.",
        role: "SRCC '26",
        exam: "CUET"
    }
]

function TestimonialCard({ quote, author, role, exam }: any) {
    return (
        <div className="w-[400px] shrink-0 bg-background p-8 rounded-[2rem] border border-border/50 relative shadow-sm hover:shadow-xl transition-all duration-500 group mx-4">
            <Quote className="absolute top-8 left-8 text-primary/10 w-12 h-12 -z-10 group-hover:text-primary/20 transition-colors" fill="currentColor" />
            <p className="text-lg leading-relaxed font-medium mb-6 text-foreground/80">"{quote}"</p>
            <div>
                <div className="font-serif font-bold text-lg">{author}</div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black uppercase tracking-widest text-primary">{role}</span>
                    <span className="text-xs text-muted-foreground">• {exam}</span>
                </div>
            </div>
        </div>
    )
}

function FloatingBadge({ children, className, delay = 0 }: any) {
    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
            className={`absolute ${className}`}
        >
            {children}
        </motion.div>
    )
}

export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["Focus", "Clarity", "Speed", "Mastery", "Success"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <div className="hero-gradient fixed inset-0 pointer-events-none" />

            {/* HEADER */}
            <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-2xl font-serif font-black tracking-tight text-foreground flex items-center gap-2"
                    >
                        <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-lg">P</span>
                        padhobadho
                    </Link>

                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <Link href="/practice" className="hover:text-primary transition-colors">
                                Practice
                            </Link>
                            <Link href="/about" className="hover:text-primary transition-colors">
                                About Us
                            </Link>
                            <Link href="/auth/sign-in" className="hover:text-primary transition-colors">
                                Sign in
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
                                <Link href="/practice" onClick={() => setMenuOpen(false)}>Practice</Link>
                                <Link href="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
                                <Link href="/auth/sign-in" onClick={() => setMenuOpen(false)}>Sign In</Link>
                                <Link href="/auth/sign-up" onClick={() => setMenuOpen(false)} className="text-primary">Create Account</Link>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* HERO */}
            <section className="relative pt-48 pb-32 md:pt-60 md:pb-48">
                <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                            <Sparkles className="w-3 h-3" /> Designed for deep work
                        </div>

                        <h1 className="text-4xl md:text-7xl font-serif font-bold leading-[1.1] mb-10 tracking-tight text-foreground">
                            <span>Padhega India.</span>
                            <br />
                            <span className="text-primary italic">Badhega India.</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
                            The comprehensive ecosystem to master competitive exams. <br className="hidden md:block" />
                            Adaptive practice, zero distractions, and pure performance.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link
                                href="/auth/sign-up"
                                className="group relative h-16 pl-8 pr-16 bg-foreground text-background rounded-full font-black text-lg flex items-center shadow-2xl shadow-black/20 hover:scale-105 transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10">Start Your Journey</span>
                                <div className="absolute right-2 top-2 bottom-2 w-12 bg-background/20 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all duration-300">
                                    <MoveRight className="w-5 h-5" />
                                </div>
                            </Link>

                            <Link
                                href="/practice"
                                className="h-16 px-10 border-2 border-border rounded-full font-bold text-lg flex items-center hover:bg-accent hover:border-foreground transition-all duration-300"
                            >
                                Explore Platform
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* TESTIMONIALS MARQUEE */}
            <section className="py-24 bg-accent/20 border-y border-border/30 overflow-hidden relative">
                <div className="container mx-auto px-6 mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif font-black mb-4">The Padhobadho Effect</h2>
                    <p className="text-muted-foreground text-lg">Join thousands of students who stopped scrolling and started solving.</p>
                </div>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    <div className="group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)] flex-row [--duration:120s] w-full">
                        <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
                            {[...Array(4)].map((_, setIndex) => (
                                testimonials.map((t, i) => (
                                    <TestimonialCard key={`${setIndex}-${i}`} {...t} />
                                ))
                            ))}
                        </div>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-background to-transparent z-10" />
                </div>
            </section>

            {/* VISUAL FEATURE: Concepts that click */}
            <section className="py-32 overflow-hidden">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 relative">
                        {/* Abstract Code/Math Visual */}
                        <div className="relative h-[400px] w-full bg-accent/30 rounded-[3rem] border border-border/50 p-8 flex items-center justify-center overflow-hidden group">
                            <div className="absolute inset-0 bg-grid-slate-200/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

                            {/* Floating Cards */}
                            <FloatingBadge className="top-12 left-12 bg-background p-4 rounded-xl shadow-xl border border-border/50 rotate-3 z-10" delay={0}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Calculator size={20} /></div>
                                    <div className="text-sm font-bold">Calculus II</div>
                                </div>
                            </FloatingBadge>

                            <FloatingBadge className="bottom-20 right-12 bg-background p-4 rounded-xl shadow-xl border border-border/50 -rotate-2 z-20" delay={1.5}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Code2 size={20} /></div>
                                    <div className="text-sm font-bold">Python Logic</div>
                                </div>
                            </FloatingBadge>

                            {/* Central Element */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="bg-background rounded-2xl p-6 shadow-2xl border border-border max-w-xs relative z-30"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-sm">Question 4/15</h4>
                                    <span className="text-[10px] font-black bg-green-500/10 text-green-600 px-2 py-1 rounded">EASY</span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="h-2 w-3/4 bg-muted rounded-full" />
                                    <div className="h-2 w-1/2 bg-muted rounded-full" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`h-10 rounded-lg border flex items-center justify-center text-xs font-bold ${i === 2 ? "bg-primary text-background border-primary" : "bg-muted/30 border-transparent"}`}>
                                            Option {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-5xl font-serif font-bold mb-6">Concepts that <span className="text-primary italic">click.</span></h2>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                            Our visual, interactive engine makes even complex ideas feel intuitive. Custom, intelligent feedback catches mistakes as you learn, not just when you fail.
                        </p>
                    </div>
                </div>
            </section>

            {/* VISUAL FEATURE: Personalized Learning */}
            <section className="py-32 bg-accent/10 border-y border-border/30">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-5xl font-serif font-bold mb-6">Personalized <br />Learning.</h2>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                            Padhobadho tracks the concepts you've mastered, designs practice sets based on your progress, and adapts to your pace. No two students see the same path.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { name: "Algebra", status: "mastered", color: "blue" },
                                { name: "Calculus", status: "learning", color: "purple" },
                                { name: "Logic", status: "mastered", color: "green" },
                                { name: "Physics", status: "learning", color: "orange" },
                                { name: "Chemistry", status: "pending", color: "red" },
                                { name: "Botany", status: "pending", color: "emerald" },
                            ].map((topic, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-4 rounded-xl border border-border/50 bg-background flex flex-col gap-3 hover:shadow-lg transition-all ${i % 2 === 0 ? "md:translate-y-8" : ""}`}
                                >
                                    <div className={`w-2 h-2 rounded-full bg-${topic.color}-500`} />
                                    <span className="font-bold">{topic.name}</span>
                                    {topic.status === "mastered" && <CheckCircle2 size={16} className="text-primary ml-auto" />}
                                    {topic.status === "learning" && <div className="h-1 w-full bg-muted rounded-full overflow-hidden"><div className="h-full w-1/2 bg-primary" /></div>}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* VISUAL FEATURE: Stay Motivated */}
            <section className="py-32">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    {/* Visual */}
                    <div className="relative h-[400px] flex items-center justify-center">
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent rounded-full blur-3xl" />
                        <div className="flex items-end gap-6 relative z-10">
                            <motion.div
                                whileInView={{ height: "150px" }}
                                initial={{ height: 0 }}
                                className="w-20 bg-gradient-to-t from-yellow-400/20 to-yellow-400/60 rounded-t-3xl border-t border-x border-yellow-400/30 backdrop-blur-sm relative group"
                            >
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 font-black p-2 rounded-full shadow-lg">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 text-center font-bold text-yellow-600">Mon</div>
                            </motion.div>

                            <motion.div
                                whileInView={{ height: "220px" }}
                                initial={{ height: 0 }}
                                transition={{ delay: 0.2 }}
                                className="w-20 bg-gradient-to-t from-orange-400/20 to-orange-400/60 rounded-t-3xl border-t border-x border-orange-400/30 backdrop-blur-sm relative"
                            >
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-orange-400 text-orange-950 font-black p-2 rounded-full shadow-lg scale-110">
                                    <Zap size={24} fill="currentColor" />
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 text-center font-bold text-orange-600">Tue</div>
                            </motion.div>

                            <motion.div
                                whileInView={{ height: "180px" }}
                                initial={{ height: 0 }}
                                transition={{ delay: 0.4 }}
                                className="w-20 bg-gradient-to-t from-primary/20 to-primary/60 rounded-t-3xl border-t border-x border-primary/30 backdrop-blur-sm relative"
                            >
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-black p-2 rounded-full shadow-lg">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 text-center font-bold text-primary">Wed</div>
                            </motion.div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-5xl font-serif font-bold mb-6">Stay <span className="text-yellow-500">Motivated.</span></h2>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                            Finish every day smarter with engaging lessons, competitive leaderboards, and daily streak protection. We make consistency addictive.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 border-t border-border/30 relative overflow-hidden bg-foreground text-background">
                <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-serif font-black mb-8 leading-tight">
                        Ready to achieve your <span className="text-primary">dream rank?</span>
                    </h2>
                    <p className="text-xl text-primary-foreground/70 mb-12 max-w-2xl mx-auto">
                        The best time to start was yesterday. The second best time is right now.
                    </p>
                    <Link
                        href="/auth/sign-up"
                        className="inline-flex items-center gap-3 px-12 py-6 bg-background text-foreground rounded-full font-black text-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
                    >
                        Start Learning Free <ArrowRight />
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-border/30 py-16 bg-accent/5">
                <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm">
                    <div className="col-span-2">
                        <Link href="/" className="text-2xl font-serif font-black tracking-tight text-foreground flex items-center gap-2 mb-6">
                            padhobadho
                        </Link>
                        <p className="text-muted-foreground max-w-sm leading-relaxed">
                            A calm, focused learning platform for students preparing for competitive exams and better colleges. Built with intentionality.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-foreground">Platform</h4>
                        <ul className="space-y-4 text-muted-foreground font-medium">
                            <li><Link href="/practice" className="hover:text-primary transition-colors">Practice</Link></li>
                            <li><Link href="/mock-test" className="hover:text-primary transition-colors">Mock Tests</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-foreground">Company</h4>
                        <ul className="space-y-4 text-muted-foreground font-medium">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="container mx-auto px-6 mt-16 pt-8 border-t border-border/30 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    © {new Date().getFullYear()} padhobadho. Engineered with Heart.
                </div>
            </footer>
        </div>
    )
}
