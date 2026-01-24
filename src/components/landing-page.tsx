"use client"

import Link from "next/link";
import { useState } from "react";
import { MoveRight, Sparkles, BookOpen, Clock, Zap, Trophy, Quote, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen selection:bg-primary/20 bg-background text-foreground font-sans">
            <div className="hero-gradient" />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 glass border-b border-border/10">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-serif font-black tracking-tighter text-primary flex items-center gap-2 relative z-50">
                        <span className="w-8 h-8 bg-primary text-background rounded-lg flex items-center justify-center text-lg">P</span>
                        padhobadho
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        <Link href="/about" className="hover:text-primary transition-all">Philosophy</Link>
                        <Link href="/careers" className="hover:text-primary transition-all">Careers</Link>
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
                            Philosophy <MoveRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/careers" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between group border-b border-border/20 pb-4">
                            Careers <MoveRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/practice" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between group border-b border-border/20 pb-4">
                            Practice <MoveRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/auth/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between group border-b border-border/20 pb-4 text-primary">
                            Sign In <MoveRight className="opacity-100" />
                        </Link>
                        <Link href="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center h-14 bg-foreground text-background rounded-full mt-4 text-base font-sans font-black uppercase tracking-widest">
                            Begin Your Journey
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
                            <Sparkles className="w-3 h-3" /> The Journey Begins Here
                        </div>
                        <h1 className="text-5xl md:text-[90px] font-serif font-black mb-10 leading-[1.1] md:leading-[1] tracking-tight text-foreground">
                            Silence the Noise. <br />
                            <span className="italic relative px-2 text-primary">
                                Master
                                <svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 100 10"
                                    preserveAspectRatio="none"
                                >
                                    <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-primary/50" />
                                </svg>
                            </span> the Craft.
                        </h1>
                        <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                            True preparation isn't about volume. It's about precision. <br className="hidden md:block" />
                            We provide the calm, focused environment you need to conquer the nation's toughest exams.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/auth/sign-up" className="group h-16 px-10 bg-foreground text-background rounded-full text-[15px] font-black hover:opacity-90 transition-all flex items-center gap-3 shadow-2xl shadow-black/10">
                                Start Your Ascent <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/about" className="h-16 px-10 border border-border text-foreground rounded-full text-[15px] font-black hover:bg-accent transition-all flex items-center">
                                Our Philosophy
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-32 border-t border-border/40">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8">Our Mission</h2>
                    <p className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-12 text-foreground">
                        "We believe that every student possesses the potential for greatness, but is often stifled by chaos. <span className="opacity-40">Our mission is to strip away the clutter, leaving only the pure essence of learning. We don't just help you pass; we help you evolve.</span>"
                    </p>
                    <div className="flex justify-center gap-12 text-center pointer-events-none select-none grayscale opacity-50">
                        {/* Abstract representations of focus */}
                        <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center"><Zap strokeWidth={1} /></div>
                        <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center"><Clock strokeWidth={1} /></div>
                        <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center"><BookOpen strokeWidth={1} /></div>
                    </div>
                </div>
            </section>

            {/* Testimonials - Narrative Style */}
            <section className="py-32 bg-accent/30 border-y border-border/40">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 luxury-text">Stories of Transformation</h2>
                        <p className="text-muted-foreground text-xl max-w-xl mx-auto font-medium">Real journeys from students who dared to aim higher.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                quote: "I was drowning in study materials. Padhobadho gave me the structure I was missing. It felt like someone finally turned on the lights.",
                                author: "Aditya S.",
                                role: "IIT Bombay '26",
                                exam: "JEE Advanced"
                            },
                            {
                                quote: "The interface is so calm, it actually made me want to study. I went from anxious to confident in three months. The analytics are a game changer.",
                                author: "Priya M.",
                                role: "IIM Ahmedabad '25",
                                exam: "CAT 2024"
                            },
                            {
                                quote: "No noise. No ads. Just pure, high-quality practice. This isn't just a website; it's a sanctuary for serious aspirants.",
                                author: "Rahul K.",
                                role: "AIIMS Delhi '27",
                                exam: "NEET UG"
                            }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-background p-10 rounded-[2rem] border border-border/50 relative shadow-sm hover:shadow-xl transition-all duration-500 group"
                            >
                                <Quote className="absolute top-10 left-8 text-primary/10 w-16 h-16 -z-10 group-hover:text-primary/20 transition-colors" fill="currentColor" />
                                <p className="text-lg leading-relaxed font-medium mb-8 text-foreground/80">"{t.quote}"</p>
                                <div>
                                    <div className="font-serif font-bold text-xl">{t.author}</div>
                                    <div className="text-xs font-black uppercase tracking-widest text-primary mt-1">{t.role}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Cleared {t.exam}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision / Stats */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                                <Trophy size={14} /> Global Impact
                            </div>
                            <h2 className="text-5xl font-serif font-black leading-tight">Empowering the <br />Next Generation.</h2>
                            <p className="text-lg text-muted-foreground font-medium">
                                We visualize a world where elite education isn't gated by geography or wealth, but is accessible to anyone with the drive to seek it.
                            </p>
                            <Link href="/careers" className="inline-flex items-center gap-3 text-primary font-bold hover:gap-4 transition-all">
                                Join our team <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: "Active Learners", value: "10k+" },
                                { label: "Questions Solved", value: "1.2M+" },
                                { label: "Success Rate", value: "94%" },
                                { label: "Cities Reached", value: "120+" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-accent/20 p-8 rounded-[2rem] text-center border border-border/50">
                                    <div className="text-4xl font-black font-serif mb-2 text-foreground">{stat.value}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="hero-gradient absolute inset-0 opacity-50" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-7xl font-serif font-bold mb-8 luxury-text italic">Your seat is waiting.</h2>
                    <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto font-medium">The only thing standing between you and your dream college is preparation.</p>
                    <Link href="/auth/sign-up" className="h-20 px-16 bg-foreground text-background rounded-full text-2xl font-black hover:opacity-90 transition-all inline-flex items-center shadow-2xl">
                        Claim Your Future
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
                                <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-[11px] uppercase tracking-[0.2em] mb-8 text-foreground">Company</h4>
                            <ul className="space-y-4 text-muted-foreground text-sm font-bold">
                                <li><Link href="/about" className="hover:text-primary transition-colors">Philosophy</Link></li>
                                <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
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
