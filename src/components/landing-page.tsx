"use client"

import Link from "next/link"
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
    Compass
} from "lucide-react"
import { FAQ } from "@/components/landing/faq"
import { StaggerTestimonials } from "@/components/landing/stagger-testimonials"
import { DonationSection } from "@/components/donation-section"
import ConsistencyMonitor from "@/components/landing/consistency-graph"

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
            <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 border-b border-border/60 bg-card">
                <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">

                    {/* Eyebrow Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 px-4 py-1.5 rounded-full mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        CUET 2026 Focused Practice Platform
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.15] text-foreground mb-6"
                    >
                        Padhega India. <br />
                        <span className="text-emerald-600 dark:text-emerald-400 italic">Badhega India.</span>
                    </motion.h1>

                    {/* Human Eye-Friendly Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
                    >
                        No noisy coaching feeds or bloated lectures. Just high-yield practice questions, instant concept explanations, and daily consistency to secure your dream college seat.
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
                            className="w-full sm:w-auto h-13 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span>Start Practicing for Free</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            href="/practice"
                            className="w-full sm:w-auto h-13 px-8 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-full font-semibold text-base flex items-center justify-center transition-all"
                        >
                            Explore Available Subjects
                        </Link>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm text-muted-foreground font-medium"
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
                </div>
            </section>

            {/* KEY METRICS BAR */}
            <section className="py-12 bg-background border-b border-border/60">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {stats.map((stat, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-card border border-border/70 shadow-sm">
                                <stat.icon className="w-6 h-6 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                                <div className="text-2xl sm:text-3xl font-serif font-black text-foreground tracking-tight mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STREAMS & SUBJECTS COVERAGE */}
            <section className="py-20 bg-card border-b border-border/60">
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
                            <div
                                key={idx}
                                className="p-5 rounded-2xl bg-background border border-border shadow-sm hover:border-emerald-500/50 transition-all flex items-start gap-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-sm">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground mb-1">{stream.label}</h3>
                                    <p className="text-xs text-muted-foreground font-medium">{stream.count}</p>
                                </div>
                            </div>
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

            {/* HOW IT WORKS */}
            <section className="py-20 md:py-24 bg-background border-b border-border/60">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 block">
                            A Proven Approach
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-black text-foreground tracking-tight mb-4">
                            How Padhobadho Works
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
                            Three simple daily steps to build your confidence and peak in performance before test day.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, idx) => (
                            <div
                                key={idx}
                                className="p-6 md:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col justify-between"
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
                            </div>
                        ))}
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
                            <div
                                key={i}
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
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONSISTENCY MONITOR SECTION */}
            <ConsistencyMonitor />

            {/* TESTIMONIALS */}
            <section className="py-20 md:py-24 bg-card border-y border-border/60 overflow-hidden">
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
            <section className="py-20 md:py-24 bg-zinc-950 text-white text-center border-t border-white/10">
                <div className="container mx-auto px-6 max-w-3xl">
                    <GraduationCap className="w-12 h-12 mx-auto mb-6 text-emerald-400" />
                    <h2 className="text-3xl md:text-5xl font-serif font-black mb-6 leading-tight tracking-tight">
                        Your Dream College is Waiting.
                    </h2>
                    <p className="text-base md:text-lg text-zinc-300 mb-8 max-w-xl mx-auto leading-relaxed">
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
