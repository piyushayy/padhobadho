"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import {
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Target,
    Brain,
    Trophy,
    GraduationCap,
    BookOpen,
    ShieldCheck,
    Clock,
    Layers,
    BarChart3,
    Compass,
    MoveRight
} from "lucide-react"
import { FAQ } from "@/components/landing/faq"
import { StaggerTestimonials } from "@/components/landing/stagger-testimonials"
import { DonationSection } from "@/components/donation-section"
import ConsistencyMonitor from "@/components/landing/consistency-graph"

function FloatingBadge({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
            className={`absolute ${className}`}
        >
            {children}
        </motion.div>
    )
}

function MockDrillPreview() {
    const [selectedOption, setSelectedOption] = useState<number | null>(1)

    const options = [
        { label: "A", text: "UGC (University Grants Commission)", isCorrect: false },
        { label: "B", text: "NTA (National Testing Agency)", isCorrect: true },
        { label: "C", text: "CBSE (Central Board of Secondary Education)", isCorrect: false },
    ]

    return (
        <div className="relative mt-12 md:mt-16 w-full max-w-4xl mx-auto min-h-[380px] sm:min-h-[440px] bg-gradient-to-b from-card via-card/95 to-background rounded-[2.5rem] border border-border/80 shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center overflow-hidden">
            {/* Dot grid texture to prevent empty feeling */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.07] dark:opacity-[0.14] pointer-events-none" />

            {/* Ambient glowing orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[110px] rounded-full pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-500/10 blur-[90px] rounded-full pointer-events-none" />

            {/* Floating Badges */}
            <FloatingBadge className="hidden lg:flex top-8 left-6 bg-card/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-border/80 rotate-2 z-20 items-center gap-3" delay={0}>
                <div className="font-serif font-bold text-sm text-foreground">General Test</div>
                <div className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider">HIGH YIELD</div>
            </FloatingBadge>

            <FloatingBadge className="hidden lg:flex bottom-10 left-8 bg-card/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-border/80 -rotate-2 z-20 items-center gap-3" delay={1.4}>
                <div className="font-serif font-bold text-sm text-foreground">🔥 14-Day Streak</div>
                <div className="text-[10px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider">+250 XP</div>
            </FloatingBadge>

            <FloatingBadge className="hidden lg:flex top-10 right-6 bg-card/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-border/80 -rotate-3 z-20 items-center gap-3" delay={0.7}>
                <div className="font-serif font-bold text-sm text-foreground">English & Hindi</div>
                <div className="text-[10px] font-black bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-wider">VOCAB</div>
            </FloatingBadge>

            <FloatingBadge className="hidden lg:flex bottom-8 right-8 bg-card/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-border/80 rotate-3 z-20 items-center gap-3" delay={2.1}>
                <div className="font-serif font-bold text-sm text-foreground">🎯 98.4% Accuracy</div>
                <div className="text-[10px] font-black bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full uppercase tracking-wider">NTA PATTERN</div>
            </FloatingBadge>

            {/* Central Interactive Question Showcase Card */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full max-w-lg bg-background rounded-3xl p-6 sm:p-7 shadow-xl border border-border relative z-10"
            >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Live Practice Preview</span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">General Test • Question 1</span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-foreground mb-5 leading-snug">
                    Which institution is officially mandated by the Ministry of Education to conduct the Central Universities Entrance Test (CUET) across India?
                </h4>

                <div className="space-y-2.5 mb-5">
                    {options.map((option, idx) => {
                        const isSelected = selectedOption === idx
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedOption(idx)}
                                className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                                    isSelected
                                        ? option.isCorrect
                                            ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/30"
                                            : "border-red-500 bg-red-50/80 dark:bg-red-950/40 text-red-950 dark:text-red-200 ring-2 ring-red-500/30"
                                        : "border-border hover:border-border/90 hover:bg-muted/40 text-foreground"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                                        isSelected
                                            ? option.isCorrect
                                                ? "bg-emerald-500 text-white"
                                                : "bg-red-500 text-white"
                                            : "bg-muted text-muted-foreground"
                                    }`}>
                                        {option.label}
                                    </span>
                                    <span>{option.text}</span>
                                </div>
                                {isSelected && option.isCorrect && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                )}
                            </button>
                        )
                    })}
                </div>

                {selectedOption !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground leading-relaxed flex items-start gap-2.5"
                    >
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                                {options[selectedOption].isCorrect ? "✓ Correct! +5 Marks Earned" : "Learn the Concept:"}
                            </span>
                            <span className="text-muted-foreground text-[11px] sm:text-xs">
                                NTA (National Testing Agency) was established to conduct standardized entrance tests (CUET, JEE Main, NEET-UG) ensuring uniform percentile scoring and national evaluation standards.
                            </span>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

export default function LandingPage() {
    const faqCategories = {
        general: "General",
        practice: "Practice & Mocks",
        account: "Account & Access"
    }

    const faqData = {
        general: [
            {
                question: "Is Padhobadho completely free for students?",
                answer: "Yes. Our core mission is democratizing entrance prep across India. All essential chapter drills, standard mock tests, and answer explanations are accessible at zero cost."
            },
            {
                question: "Which entrance examinations do you currently support?",
                answer: "Our primary focus is CUET (UG and PG) covering Languages, all Domain Subjects, and General Test. We also offer foundational practice sets for JEE Mains, NEET, and CLAT."
            },
            {
                question: "How are the questions aligned with the real NTA pattern?",
                answer: "Every question is matched against official previous year papers (PYQs) and latest NTA syllabi, categorized into Easy, Medium, and Hard difficulty tiers."
            }
        ],
        practice: [
            {
                question: "What makes Padhobadho different from watching video lectures?",
                answer: "Watching lectures is passive. Cracking CUET requires active problem-solving speed and accuracy. Padhobadho is built purely for daily practice, instant mistake diagnosis, and retention."
            },
            {
                question: "Can I practice specific chapters or subjects independently?",
                answer: "Yes. You can select individual domains like Accountancy, Physics, Political Science, or General Test and practice chapter-wise or take mixed mock tests."
            },
            {
                question: "Do questions come with detailed explanations?",
                answer: "Yes. Every question includes a step-by-step conceptual explanation explaining why the correct option is right and highlighting common calculation or reasoning traps."
            }
        ],
        account: [
            {
                question: "Do I need to install any heavy software?",
                answer: "No. Padhobadho runs seamlessly in any web browser on your phone, tablet, or desktop with instant progress saving and zero lag."
            },
            {
                question: "How does the streak and XP system work?",
                answer: "Every practice session earns experience points (XP) and keeps your daily learning streak alive, motivating you to build an unbreakable 30-day exam prep habit."
            }
        ]
    }

    const streamPills = [
        { label: "General Test", count: "Numerical, Reasoning & GK", color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40" },
        { label: "English & Hindi", count: "Comprehension & Vocab", color: "bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/40" },
        { label: "Commerce Stream", count: "Accounts, BST, Economics", color: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40" },
        { label: "Science Stream", count: "Physics, Chem, Maths, Bio", color: "bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/40" },
        { label: "Humanities Stream", count: "History, Pol Sci, Legal", color: "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/40" }
    ]

    const stats = [
        { label: "Curated Practice Questions", value: "10,000+", icon: BookOpen },
        { label: "Supported Subjects & Streams", value: "30+", icon: Layers },
        { label: "NTA Pattern Alignment", value: "98.4%", icon: ShieldCheck },
        { label: "Average Student Rating", value: "4.9 / 5", icon: Trophy }
    ]

    const pillars = [
        {
            icon: Target,
            title: "Adaptive Practice Drills",
            description: "Practice questions that meet your current level and gradually scale in complexity. No duplicate questions, no irrelevant coaching theory."
        },
        {
            icon: Brain,
            title: "Instant Step-by-Step Rationales",
            description: "Understand the logic behind every option immediately. Learn from mistakes on the spot so you never repeat them in the exam hall."
        },
        {
            icon: Clock,
            title: "Full-Length Timed Mocks",
            description: "Simulate actual test-day pressure with NTA-style timers, question navigation palettes, and immediate section-wise score reports."
        },
        {
            icon: BarChart3,
            title: "Precision Accuracy Analytics",
            description: "Track your accuracy curve, topic mastery, and time-per-question to know exactly where you stand before submitting your application."
        }
    ]

    const steps = [
        {
            number: "01",
            title: "Choose Your Exam & Stream",
            description: "Select your target university and stream — whether you are gunning for SRCC, St. Stephen's, Hindu College, or top central universities."
        },
        {
            number: "02",
            title: "Solve Daily Bite-Sized Sets",
            description: "Spend 20 focused minutes every day solving targeted drills designed to fit around your 12th board schedules."
        },
        {
            number: "03",
            title: "Fix Mistakes & Climb the Ranks",
            description: "Review incorrect attempts in your personal review history and climb the national leaderboard alongside serious aspirants."
        }
    ]

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-emerald-500/20 selection:text-emerald-500 overflow-x-hidden">

            {/* HERO SECTION */}
            <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border/60 bg-card overflow-hidden">
                {/* Background dot grid pattern to prevent empty voids */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] dark:opacity-[0.10] pointer-events-none" />

                <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">

                    {/* Eyebrow Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 px-4 py-1.5 rounded-full mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Master Your CUET Journey
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-7xl font-serif font-black tracking-tight leading-[1.1] text-foreground mb-6"
                    >
                        Padhega India. <br />
                        <span className="text-emerald-600 dark:text-emerald-400 italic">Badhega India.</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
                    >
                        Stop guessing. Start improving. CUET-focused questions, adaptive difficulty, and mistake-driven learning to secure your dream college seat.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10"
                    >
                        <Link
                            href="/auth/sign-up"
                        >
                            <motion.div
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="w-full sm:w-auto h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                            >
                                <span>Start Practice Free</span>
                                <MoveRight className="w-5 h-5" />
                            </motion.div>
                        </Link>

                        <Link
                            href="/practice"
                        >
                            <motion.div
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="w-full sm:w-auto h-14 px-8 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-full font-semibold text-base flex items-center justify-center transition-all cursor-pointer"
                            >
                                Explore Subjects
                            </motion.div>
                        </Link>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm text-muted-foreground font-medium mb-4"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>100% Free Core Drills</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Aligned with Latest NTA Syllabus</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>No Credit Card Required</span>
                        </div>
                    </motion.div>

                    {/* HERO VISUAL PREVIEW: Interactive micro-drill showcase with floating badges */}
                    <MockDrillPreview />

                </div>
            </section>

            {/* KEY METRICS BAR */}
            <section className="py-12 bg-background border-b border-border/60">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -4 }}
                                className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm transition-all"
                            >
                                <stat.icon className="w-6 h-6 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                                <div className="text-2xl sm:text-3xl font-serif font-black text-foreground tracking-tight mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-20 md:py-24 bg-card border-b border-border/60">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 block">
                            A Proven Approach
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-black text-foreground tracking-tight mb-4">
                            How Padhobadho Works
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
                            Three simple daily steps to build your confidence and peak in performance before test day.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -6 }}
                                className="p-6 md:p-8 rounded-3xl bg-background border border-border/80 shadow-sm flex flex-col justify-between transition-all"
                            >
                                <div>
                                    <span className="text-3xl font-serif font-black text-emerald-600/30 mb-4 block">
                                        {step.number}
                                    </span>
                                    <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-normal">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONSISTENCY MONITOR SECTION (Consistency Wins Graph) */}
            <ConsistencyMonitor />

            {/* STREAMS & SUBJECTS COVERAGE */}
            <section className="py-20 bg-background border-b border-border/60">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-12">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 block">
                            Comprehensive Coverage
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-black text-foreground tracking-tight mb-4">
                            Every Section of the CUET Exam
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
                            Structured precisely like the official entrance examination so you never face unfamiliar question formats.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {streamPills.map((stream, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-emerald-500/50 transition-all flex items-start gap-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-sm">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground mb-1">{stream.label}</h3>
                                    <p className="text-xs text-muted-foreground font-medium">{stream.count}</p>
                                </div>
                            </motion.div>
                        ))}

                        <div className="p-5 rounded-2xl bg-emerald-600 text-white shadow-sm flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-white mb-1">More Coming Soon</h3>
                                <p className="text-xs text-emerald-100 font-medium">JEE Mains, NEET, CLAT</p>
                            </div>
                            <Compass className="w-6 h-6 text-emerald-200" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CORE VALUE PILLARS */}
            <section className="py-20 md:py-24 bg-card border-b border-border/60">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 block">
                            Platform Features
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-black text-foreground tracking-tight mb-4">
                            Built for Serious Aspirants
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
                            Every feature is engineered to eliminate distraction and maximize your problem-solving speed.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {pillars.map((pillar, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -4 }}
                                className="p-6 sm:p-8 rounded-3xl bg-background border border-border/90 shadow-sm hover:shadow-md transition-all flex gap-5 items-start"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <pillar.icon className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg md:text-xl font-bold text-foreground">{pillar.title}</h3>
                                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-normal">
                                        {pillar.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-20 md:py-24 bg-background border-y border-border/60 overflow-hidden">
                <div className="container mx-auto px-6 mb-12 text-center max-w-3xl">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 block">
                        Student Success
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-black text-foreground tracking-tight mb-4">
                        What Our Students Say
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground font-normal leading-relaxed">
                        Read how daily practice on Padhobadho helped aspirants get into top DU colleges and central universities.
                    </p>
                </div>

                <StaggerTestimonials />
            </section>

            {/* FAQ SECTION */}
            <FAQ
                categories={faqCategories}
                faqData={faqData}
            />

            {/* DONATION SECTION */}
            <div id="donate">
                <DonationSection />
            </div>

            {/* FINAL CALL TO ACTION */}
            <section className="py-20 md:py-24 bg-zinc-950 text-white text-center border-t border-white/10 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-6 max-w-3xl relative z-10">
                    <GraduationCap className="w-12 h-12 mx-auto mb-6 text-emerald-400" />
                    <h2 className="text-3xl md:text-5xl font-serif font-black mb-6 leading-tight tracking-tight">
                        Your Dream College is Waiting.
                    </h2>
                    <p className="text-base md:text-lg text-zinc-300 mb-8 max-w-xl mx-auto leading-relaxed font-medium">
                        Join thousands of students preparing smart. Start your daily 20-minute practice session today.
                    </p>
                    <Link
                        href="/auth/sign-up"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base rounded-full shadow-xl hover:scale-105 transition-all"
                    >
                        <span>Create Free Account</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
