"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import { ArrowRight, Sparkles, Quote, MoveRight, CheckCircle2, Zap, Target, BookOpen, Trophy, ChevronLeft, ChevronRight, GraduationCap, Brain } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { FAQ } from "@/components/landing/faq"
import { StaggerTestimonials } from "@/components/landing/stagger-testimonials"

function FloatingBadge({ children, className, delay = 0 }: any) {
    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
            className={`absolute ${className}`}
        >
            {children}
        </motion.div>
    )
}

export default function LandingPage() {
    const faqCategories = {
        general: "General",
        practice: "Practice",
        account: "Account"
    }

    const faqData = {
        general: [
            {
                question: "Is Padhobadho free?",
                answer: "Yes! We believe quality education should be accessible to everyone. Our core practice features are completely free."
            },
            {
                question: "Which exams do you cover?",
                answer: "We currently focus on CUET (UG & PG), JEE Mains, NEET, and CLAT. We're adding more exams like GATE and CAT soon."
            }
        ],
        practice: [
            {
                question: "How does the adaptive difficulty work?",
                answer: "Our system analyzes your performance in real-time. If you answer correctly, the questions get slightly harder. If you struggle, we provide easier questions to build your foundation first."
            },
            {
                question: "Can I create custom tests?",
                answer: "Absolutely. You can choose specific subjects, topics, and difficulty levels to create a practice session that fits your needs."
            }
        ],
        account: [
            {
                question: "Do I need to sign up?",
                answer: "You can try a few practice questions as a guest, but to save your progress, track analytics, and earn badges, you'll need to create a free account."
            }
        ]
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <div className="hero-gradient fixed inset-0 pointer-events-none" />

            {/* HERO */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.2
                                }
                            }
                        }}
                    >
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                            }}
                            className="inline-flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary mb-8 px-4 py-2 bg-primary/5 rounded-full border border-primary/10"
                        >
                            <Sparkles className="w-3 h-3" /> Master Your CUET Journey
                        </motion.div>

                        <motion.h1
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                            }}
                            className="text-4xl md:text-7xl font-serif font-bold leading-[1.1] mb-8 tracking-tight text-foreground"
                        >
                            Padhega India. <br />
                            <span className="text-primary italic">Badhega India.</span>
                        </motion.h1>

                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                            }}
                            className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
                        >
                            Stop guessing. Start improving. <br className="hidden md:block" />
                            CUET-focused questions, adaptive difficulty, and mistake-driven learning to secure your seat.
                        </motion.p>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                            }}
                            className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6"
                        >
                            <Link
                                href="/auth/sign-up"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative h-14 md:h-16 pl-8 pr-16 bg-foreground text-background rounded-full font-black text-lg flex items-center shadow-xl overflow-hidden cursor-pointer"
                                >
                                    <span className="relative z-10">Start Practice Free</span>
                                    <div className="absolute right-2 top-2 bottom-2 w-12 bg-background/20 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all duration-300">
                                        <MoveRight className="w-5 h-5" />
                                    </div>
                                </motion.div>
                            </Link>

                            <Link
                                href="/practice"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05, backgroundColor: "var(--accent)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="h-14 md:h-16 px-10 border-2 border-border rounded-full font-bold text-lg flex items-center transition-all duration-300 justify-center cursor-pointer"
                                >
                                    Explore Subjects
                                </motion.div>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* HOW IT WORKS / VALUE PROP */}
            <section className="py-24 bg-accent/30 border-y border-border/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-serif font-bold mb-4"
                        >
                            How Padhobadho Works
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-muted-foreground text-lg max-w-2xl mx-auto"
                        >
                            A simple, scientific approach to improving your CUET score every single day.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Target,
                                title: "Pick Your Domain",
                                desc: "Choose from Commerce, Science, Humanities or General Test. Specific to CUET syllabus."
                            },
                            {
                                icon: Brain,
                                title: "Solve & Learn",
                                desc: "Get questions that adapt to your level. Detailed explanations help you fix mistakes instantly."
                            },
                            {
                                icon: Trophy,
                                title: "Track Growth",
                                desc: "Watch your accuracy score climb. See exactly where you stand against the competition."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all cursor-default"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 duration-300">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VISUAL FEATURE: Concepts that click */}
            <section className="py-24 md:py-32 overflow-hidden">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-2 lg:order-1 relative"
                    >
                        {/* Abstract Exam Visual */}
                        <div className="relative h-[400px] w-full bg-accent/20 rounded-[3rem] border border-border/50 p-8 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-grid-slate-200/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

                            <FloatingBadge className="top-12 left-8 bg-background p-4 rounded-xl shadow-lg border border-border/50 rotate-3 z-10" delay={0}>
                                <div className="flex items-center gap-3">
                                    <div className="font-serif font-bold text-lg text-foreground">General Test</div>
                                    <div className="text-xs font-black bg-green-100 text-green-700 px-2 py-0.5 rounded">HIGH YIELD</div>
                                </div>
                            </FloatingBadge>

                            <FloatingBadge className="bottom-20 right-8 bg-background p-4 rounded-xl shadow-lg border border-border/50 -rotate-2 z-20" delay={1.5}>
                                <div className="flex items-center gap-3">
                                    <div className="font-serif font-bold text-lg text-foreground">English</div>
                                    <div className="text-xs font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded">VOCAB</div>
                                </div>
                            </FloatingBadge>

                            <motion.div
                                initial={{ scale: 0.95 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="bg-background rounded-2xl p-6 shadow-2xl border border-border w-64 md:w-80 relative z-30"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Mock Question</h4>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="h-2 w-full bg-muted rounded-full" />
                                    <div className="h-2 w-5/6 bg-muted rounded-full" />
                                    <div className="h-2 w-4/6 bg-muted rounded-full" />
                                </div>
                                <div className="grid gap-2">
                                    <div className="h-10 rounded-lg border border-border flex items-center px-4 text-xs font-bold hover:bg-muted/50 transition-colors cursor-pointer">
                                        Option A
                                    </div>
                                    <div className="h-10 rounded-lg border border-primary bg-primary/5 text-primary flex items-center px-4 text-xs font-bold ring-1 ring-primary transition-colors cursor-pointer">
                                        Option B <CheckCircle2 className="ml-auto w-4 h-4" />
                                    </div>
                                    <div className="h-10 rounded-lg border border-border flex items-center px-4 text-xs font-bold hover:bg-muted/50 transition-colors cursor-pointer">
                                        Option C
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-1 lg:order-2"
                    >
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-4">
                            <BookOpen size={14} /> Smart Practice
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Questions that feel <br /><span className="text-primary italic">real.</span></h2>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                            We don't use generic question banks. Our content is curated for specific exams like CUET, ensuring you're practicing exactly what you'll see on test day.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* VISUAL FEATURE: Personalized Learning */}
            <section className="py-32 bg-accent/10 border-y border-border/30">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-5xl font-serif font-bold mb-6">Practice That Adapts <br />to You.</h2>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                            Padhobadho tracks the concepts you've mastered, designs practice sets based on your progress, and adapts to your pace. No two students see the same path.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { name: "Algebra", status: "mastered", color: "blue" },
                                { name: "Accountancy", status: "learning", color: "purple" },
                                { name: "Logic", status: "mastered", color: "green" },
                                { name: "Physics", status: "learning", color: "orange" },
                                { name: "Chemistry", status: "pending", color: "red" },
                                { name: "Economics", status: "pending", color: "emerald" },
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
                                viewport={{ once: true }}
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
                                viewport={{ once: true }}
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
                                viewport={{ once: true }}
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

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl font-serif font-bold mb-6">Consistency <span className="text-yellow-500">Wins.</span></h2>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                            Finish every day smarter with engaging lessons, competitive leaderboards, and daily streak protection. We make consistency addictive.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-24 bg-accent/20 border-y border-border/30 overflow-hidden">
                <div className="container mx-auto px-6 mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Don't just take our word for it</h2>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                        Join thousands of students who are crushing their exams with Padhobadho.
                    </p>
                </div>

                <StaggerTestimonials />
            </section>

            {/* FAQ SECTION */}
            <FAQ
                categories={faqCategories}
                faqData={faqData}
            />

            {/* CTA */}
            <section className="py-24 md:py-32 relative overflow-hidden bg-foreground text-background text-center">
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <GraduationCap className="w-16 h-16 mx-auto mb-6 text-primary/80" />
                    <h2 className="text-4xl md:text-6xl font-serif font-black mb-8 leading-tight">
                        Your dream college <br /> is waiting.
                    </h2>
                    <p className="text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
                        Don't let another day of vague prep go by. Start precise, daily practice today.
                    </p>
                    <Link
                        href="/auth/sign-up"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-background text-foreground rounded-full font-black text-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
                    >
                        Sign Up for Free <ArrowRight />
                    </Link>
                </div>
            </section>
        </div>
    )
}
