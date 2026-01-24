"use client"

import Link from "next/link";
import { MoveRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function CareersPage() {
    return (
        <div className="flex flex-col min-h-screen selection:bg-primary/20 bg-background text-foreground font-sans">
            <div className="hero-gradient" />

            <div className="container mx-auto px-6 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-12 font-bold text-sm transition-colors">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl"
                >
                    <h1 className="text-6xl md:text-8xl font-serif font-black mb-8 tracking-tight">Join the <br /><span className="text-primary italic">Revolution.</span></h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-16 leading-relaxed max-w-2xl">
                        We aren't just building an EdTech platform. We are building the operating system for the next generation of genius.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-20 border-t border-border/40 py-20">
                    <div>
                        <h2 className="text-3xl font-serif font-bold mb-6">Why Padhobadho?</h2>
                        <p className="text-muted-foreground leading-relaxed font-medium mb-6">
                            The education sector is crowded with noise. We are the signal. We value craftsmanship, deep work, and user-centric design above all else.
                        </p>
                        <ul className="space-y-4 font-bold text-foreground/80">
                            <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary" /> Remote-first culture</li>
                            <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary" /> Competitive equity & salary</li>
                            <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary" /> Work on cutting-edge AI</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-bold mb-6">Open Roles</h2>
                        <div className="space-y-6">
                            {[
                                { title: "Senior React Engineer", type: "Remote", dept: "Engineering" },
                                { title: "Product Designer", type: "Remote", dept: "Design" },
                                { title: "AI/ML Researcher", type: "Hybrid", dept: "Data Science" },
                            ].map((role, i) => (
                                <div key={i} className="group flex items-center justify-between p-6 rounded-2xl border border-border/50 hover:bg-accent/50 transition-all cursor-pointer">
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{role.title}</h3>
                                        <div className="flex gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">
                                            <span>{role.dept}</span>
                                            <span>•</span>
                                            <span>{role.type}</span>
                                        </div>
                                    </div>
                                    <MoveRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 text-muted-foreground font-medium text-sm">
                            Don't see your role? <a href="mailto:careers@padhobadho.com" className="text-primary underline">Pitch us</a> your brilliance.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
