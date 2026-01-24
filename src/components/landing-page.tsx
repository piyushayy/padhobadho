"use client"

import Link from "next/link";
import { useState } from "react";
import { MoveRight, Sparkles, BookOpen, Clock, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen selection:bg-primary/20 bg-background text-foreground">
            <div className="hero-gradient" />

            {/* Header */}
            {/* Header */}
            <header className="fixed top-0 w-full z-50 glass border-b border-border/10">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-serif font-black tracking-tighter text-primary flex items-center gap-2 relative z-50">
                        <span className="w-8 h-8 bg-primary text-background rounded-lg flex items-center justify-center text-lg">P</span>
                        padhobadho
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        <Link href="/about" className="hover:text-primary transition-all">About</Link>
                        <Link href="/practice" className="hover:text-primary transition-all">Practice</Link>
                        <Link href="/auth/sign-in" className="px-6 py-2 rounded-full border border-border text-foreground hover:bg-foreground hover:text-background transition-all duration-300">
                            Sign In
                        </Link>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden relative z-50 p-2 -mr-2 text-foreground"
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 flex flex-col items-end gap-[5px]">
                            <span className={`h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`} />
                            <span className={`h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : "w-4"}`} />
                            <span className={`h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-2"}`} />
                        </div>
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <motion.div
                    initial={false}
                    animate={isMobileMenuOpen ? { height: "100vh", opacity: 1 } : { height: 0, opacity: 0 }}
                    className="md:hidden fixed inset-0 top-0 bg-background/95 backdrop-blur-xl z-40 overflow-hidden flex flex-col pt-32 px-6"
                >
                    <nav className="flex flex-col gap-8 text-2xl font-serif font-bold text-foreground">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between group border-b border-border/20 pb-4">
                            Home <MoveRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between group border-b border-border/20 pb-4">
                            About <MoveRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/practice" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between group border-b border-border/20 pb-4">
                            Practice <MoveRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/auth/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between group border-b border-border/20 pb-4 text-primary">
                            Sign In <MoveRight className="opacity-100" />
                        </Link>
                        <Link href="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center h-14 bg-foreground text-background rounded-full mt-4 text-base font-sans font-black uppercase tracking-widest">
                            Get Started
                        </Link>
                    </nav>
                </motion.div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 md:pt-60 md:pb-40 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-[11px] font-black tracking-widest uppercase mb-8">
                            <Sparkles className="w-3 h-3" /> Trusted by 10,000+ Students
                        </div>
                        <h1 className="text-5xl md:text-[84px] font-serif font-black mb-8 leading-[1.1] md:leading-[1] tracking-tight text-foreground">
                            Competitive <br />
                            <span className="italic relative px-2 text-primary">
                                excellence
                                <svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 100 10"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M0,5 Q50,10 100,5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        fill="none"
                                        className="text-primary/50"
                                    />
                                </svg>
                            </span> <br className="md:hidden" /> <span className="luxury-text">reimagined.</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                            The definitive environment for <strong>JEE, NEET, CAT, GATE, NDA</strong>, and major competitive exams. <br className="hidden md:block" /> Calm, minimal, and engineered for high-stakes success.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/auth/sign-up" className="group h-16 px-10 bg-foreground text-background rounded-full text-[15px] font-black hover:opacity-90 transition-all flex items-center gap-3">
                                Start Learning Now <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/about" className="h-16 px-10 border border-border text-foreground rounded-full text-[15px] font-black hover:bg-accent transition-all flex items-center">
                                Learn the Philosophy
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 bg-accent/50 border-y border-border">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 luxury-text">The Minimalist Edge</h2>
                        <p className="text-muted-foreground text-xl max-w-xl mx-auto font-medium">We removed the coaching banners to focus on what actually works: adaptive practice and deep analysis.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                title: "Adaptive Drills",
                                desc: "Smart 15-question sessions that learn where you struggle and refine your focus.",
                                icon: <Zap className="w-5 h-5" />,
                            },
                            {
                                title: "Study Library",
                                desc: "Every previous year question and study resource indexed with high-fidelity accuracy.",
                                icon: <BookOpen className="w-5 h-5" />,
                            },
                            {
                                title: "Aspirant Ranking",
                                desc: "Compete with the top 1% across the country in our zero-lag global leaderboard.",
                                icon: <Trophy className="w-5 h-5" />,
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="brilliant-card bg-background border-border/50 group"
                            >
                                <div className={`w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed font-medium">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-7xl font-serif font-bold mb-8 luxury-text italic">Build your future.</h2>
                    <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto font-medium">Join the next generation of high-achievers who studied smarter.</p>
                    <Link href="/auth/sign-up" className="h-20 px-16 bg-foreground text-background rounded-full text-2xl font-black hover:opacity-90 transition-all inline-flex items-center shadow-xl">
                        Create Your Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-16 mb-20 text-center md:text-left">
                        <div className="col-span-2">
                            <Link href="/" className="text-3xl font-serif font-black text-primary mb-8 block">
                                padhobadho
                            </Link>
                            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed font-medium">
                                We believe excellence is accessible to everyone. Our mission is to provide the world's most elegant preparation ecosystem for competitive exams.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-black text-[11px] uppercase tracking-[0.2em] mb-8 text-foreground">Prepare</h4>
                            <ul className="space-y-4 text-muted-foreground text-sm font-bold">
                                <li><Link href="/practice" className="hover:text-primary transition-colors">Practice</Link></li>
                                <li><Link href="/mock-test" className="hover:text-primary transition-colors">Mock Tests</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-[11px] uppercase tracking-[0.2em] mb-8 text-foreground">Support</h4>
                            <ul className="space-y-4 text-muted-foreground text-sm font-bold">
                                <li><Link href="/about" className="hover:text-primary transition-colors">Philosophy</Link></li>
                                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        <p>© {new Date().getFullYear()} padhobadho. Engineered with Heart.</p>
                        <div className="flex gap-8">
                            <Link href="/privacy">Privacy</Link>
                            <Link href="/terms">Terms</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
