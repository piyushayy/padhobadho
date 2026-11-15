import Link from "next/link"
import { Sparkles, ArrowRight, CheckCircle2, Heart } from "lucide-react"

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
            <div className="max-w-lg w-full bg-card border border-border/80 rounded-3xl p-8 md:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    <Heart className="w-8 h-8 fill-primary" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" /> 100% Free Initiative
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-serif font-black tracking-tight">
                        No Subscription Needed
                    </h1>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        PadhoBadho is dedicated to every student in India. All practice questions, NTA CBT mock tests, and study materials are <span className="text-foreground font-bold">100% free forever</span>.
                    </p>
                </div>

                <div className="bg-muted/40 rounded-2xl p-4 text-left space-y-2.5 border border-border/50 text-xs font-semibold">
                    <div className="flex items-center gap-2.5 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span>Zero paywalls, zero hidden charges</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span>Full access to Class 12, JEE, NEET, CUET, SSC & DSSSB</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span>Padhega India, Badhega India 🇮🇳</span>
                    </div>
                </div>

                <Link
                    href="/practice"
                    className="w-full py-4 bg-primary text-background font-black text-sm uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
                >
                    <span>Start Free Practice Now</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
