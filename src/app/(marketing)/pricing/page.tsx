"use client"

import Link from "next/link"
import { CheckCircle2, Zap, Layout, ShieldCheck } from "lucide-react"

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="py-24 relative overflow-hidden">
                <div className="hero-gradient fixed inset-0 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                            Transparent Pricing
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-black mb-6">Invest in your <span className="text-primary italic">future.</span></h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            No hidden costs. No confusing tiers. Just honest access to the best practice platform for your exams.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* FREE PLAN */}
                        <div className="rounded-3xl border border-border p-8 bg-background relative hover:shadow-xl transition-all duration-300 flex flex-col">
                            <h3 className="text-2xl font-serif font-bold mb-2">Basic</h3>
                            <div className="text-muted-foreground mb-6 text-sm font-medium">To get you started</div>
                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-4xl font-black">₹0</span>
                                <span className="text-muted-foreground">/ forever</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                    <span>Daily practice questions (Limited)</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                    <span>Basic performance stats</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                    <span>Access to 1 mock test</span>
                                </li>
                            </ul>

                            <Link href="/auth/sign-up" className="w-full py-4 rounded-xl border border-border font-bold text-center hover:bg-accent transition-colors">
                                Get Started Free
                            </Link>
                        </div>

                        {/* PRO PLAN */}
                        <div className="rounded-3xl border-2 border-primary bg-background relative hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col scale-105 z-10">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                Most Popular
                            </div>
                            <div className="p-8 pb-0">
                                <h3 className="text-2xl font-serif font-bold mb-2">Pro</h3>
                                <div className="text-muted-foreground mb-6 text-sm font-medium">For serious aspirants</div>
                                <div className="mb-6 flex items-baseline gap-1">
                                    <span className="text-4xl font-black">₹499</span>
                                    <span className="text-muted-foreground">/ month</span>
                                </div>
                            </div>

                            <div className="px-8 pb-8 flex-1">
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3 text-sm font-medium">
                                        <Zap className="w-5 h-5 text-primary shrink-0" fill="currentColor" />
                                        <span>Unlimited adaptive practice</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                        <span>Full mock test series (CUET/JEE/NEET)</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                        <span>Advanced analytics & rank prediction</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                        <span>Priority doubt resolution</span>
                                    </li>
                                </ul>

                                <Link href="/auth/sign-up?plan=pro" className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black text-center shadow-lg hover:opacity-90 transition-opacity block">
                                    Start Pro Trial
                                </Link>
                                <p className="text-center text-xs text-muted-foreground mt-4 font-medium">7-day money-back guarantee</p>
                            </div>
                        </div>

                        {/* INSTITUTION PLAN */}
                        <div className="rounded-3xl border border-border p-8 bg-background relative hover:shadow-xl transition-all duration-300 flex flex-col">
                            <h3 className="text-2xl font-serif font-bold mb-2">Campus</h3>
                            <div className="text-muted-foreground mb-6 text-sm font-medium">For schools & coaching centers</div>
                            <div className="mb-6">
                                <span className="text-4xl font-black">Custom</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3 text-sm">
                                    <Layout className="w-5 h-5 text-primary shrink-0" />
                                    <span>Bulk student management</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                    <span>Teacher dashboard & reports</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                                    <span>White-label options available</span>
                                </li>
                            </ul>

                            <Link href="/contact" className="w-full py-4 rounded-xl border border-border font-bold text-center hover:bg-accent transition-colors">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 border-t border-border/30 bg-accent/5">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-serif font-bold mb-12 text-center">Frequently asked questions</h2>

                    <div className="space-y-6">
                        {[
                            {
                                q: "Can I cancel my subscription?",
                                a: "Yes, you can cancel anytime from your profile settings. You'll stick keep access until the end of your billing period."
                            },
                            {
                                q: "Is the Basic plan really free?",
                                a: "Yes. We believe every student deserves a chance to practice. The basic plan is free forever, supported by our mission to democratize education."
                            },
                            {
                                q: "What exams do you cover?",
                                a: "Currently we are laser-focused on CUET, JEE Mains, and NEET UG. We add new specific subject packs every month."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-background border border-border/50 rounded-2xl p-6">
                                <h4 className="font-bold text-lg mb-2">{item.q}</h4>
                                <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
