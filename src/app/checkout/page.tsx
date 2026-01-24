"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Sparkles, CreditCard, ShieldCheck, Zap, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { upgradeToPremium } from "@/actions/premium"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleUpgrade = async () => {
        setIsLoading(true)
        try {
            await upgradeToPremium()
            toast.success("Welcome to North Campus Elite! Upgrade successful.")
            setTimeout(() => {
                router.push("/dashboard")
            }, 2000)
        } catch (error) {
            toast.error("Upgrade failed. Please try again.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary/20">
            <Link href="/dashboard" className="absolute top-8 left-8 flex items-center gap-2 text-[13px] font-bold text-muted-foreground hover:text-foreground transition-all group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Learning
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center"
            >
                {/* Value Prop */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                            <Sparkles className="w-4 h-4" /> Limited Time: Lifetime Access
                        </div>
                        <h1 className="text-6xl md:text-7xl font-serif font-black tracking-tight leading-[0.9]">
                            Join the <br /><span className="text-primary italic border-b-8 border-primary/20 pb-4">Elite.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
                            Upgrade to North Campus Elite and unlock the ultimate suite of CUET preparation tools.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { title: "AI Tutor Deep-Dives", desc: "Instant explanations for every single question.", icon: <Zap className="text-primary" /> },
                            { title: "North Campus Predictor", desc: "See your rank against 10,000+ real students.", icon: <ShieldCheck className="text-primary" /> },
                            { title: "Priority Support", desc: "Direct access to our subject matter experts.", icon: <Check className="text-primary" /> },
                        ].map((feature, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center flex-shrink-0">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black">{feature.title}</h4>
                                    <p className="text-sm text-muted-foreground font-medium">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Checkout Card */}
                <div className="brilliant-card bg-foreground text-background p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 space-y-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="text-3xl font-serif font-black">Elite Plan</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">One-time payment</p>
                            </div>
                            <div className="text-right">
                                <p className="text-5xl font-serif font-black text-primary">₹999</p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 line-through">₹4,999</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-background/10 border border-background/20 rounded-[2rem] space-y-4">
                                <div className="flex items-center justify-between text-sm font-bold">
                                    <span className="opacity-60">Subtotal</span>
                                    <span>₹999.00</span>
                                </div>
                                <div className="flex items-center justify-between text-sm font-bold">
                                    <span className="opacity-60">Platform Fee</span>
                                    <span className="text-primary">FREE</span>
                                </div>
                                <div className="h-px bg-background/10" />
                                <div className="flex items-center justify-between text-xl font-black">
                                    <span>Total</span>
                                    <span>₹999.00</span>
                                </div>
                            </div>

                            <button
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                className="w-full h-20 bg-primary text-background rounded-full text-xl font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                            >
                                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CreditCard className="w-6 h-6" /> Unlock Lifetime Access</>}
                            </button>

                            <p className="text-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                Secure Payment powered by padhobadho Pay
                            </p>
                        </div>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full" />
                </div>
            </motion.div>
        </div>
    )
}
