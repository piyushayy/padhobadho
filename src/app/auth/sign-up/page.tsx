"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Chrome, MoveRight, User, Mail, Lock, ArrowLeft, Loader2, Sparkles } from "lucide-react"
import { signUp } from "@/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        try {
            const result = await signUp(formData)
            if (result?.error) {
                if (typeof result.error === "string") {
                    toast.error(result.error)
                } else {
                    toast.error("Please fix the errors in the form")
                }
                setIsLoading(false)
            } else {
                toast.success("Account created! Redirecting to sign in...")
                setTimeout(() => {
                    router.push("/auth/sign-in")
                }, 2000)
            }
        } catch (err) {
            toast.error("An unexpected error occurred")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 selection:bg-primary/20 py-12">
            {/* Back to Home */}
            <Link href="/" className="absolute top-12 left-12 flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[440px] space-y-12"
            >
                <div className="text-center space-y-6">
                    <Link href="/" className="text-4xl font-serif font-black tracking-tighter text-primary inline-block">pb.</Link>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-serif font-black tracking-tight leading-tight">Start your journey</h1>
                        <p className="text-muted-foreground font-medium text-lg leading-relaxed px-4 text-center">Join thousands of students mastering subjects through smart practice.</p>
                    </div>
                </div>

                {/* Benefits List */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-6 space-y-4">
                    {[
                        { text: "Unlimited Adaptive Practice", icon: <Sparkles className="w-4 h-4 text-primary" /> },
                        { text: "Real Exam Mock Tests", icon: <Sparkles className="w-4 h-4 text-primary" /> },
                    ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-bold">
                            {benefit.icon}
                            {benefit.text}
                        </div>
                    ))}
                </div>

                {/* Credentials Form */}
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <input
                                name="name"
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full h-16 bg-card border-2 border-border rounded-[1.25rem] pl-14 pr-6 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-lg text-foreground"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email address"
                                required
                                className="w-full h-16 bg-card border-2 border-border rounded-[1.25rem] pl-14 pr-6 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-lg text-foreground"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Secure Password"
                                required
                                className="w-full h-16 bg-card border-2 border-border rounded-[1.25rem] pl-14 pr-6 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-lg text-foreground"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-16 bg-black dark:bg-white text-white dark:text-black rounded-[1.25rem] text-xl font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 shadow-2xl shadow-black/10 dark:shadow-white/10 mt-4"
                    >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Create Account <MoveRight className="w-6 h-6" /></>}
                    </button>
                </form>

                <p className="text-center text-muted-foreground font-bold pt-4">
                    Already have an account? <Link href="/auth/sign-in" className="text-primary hover:underline underline-offset-4 decoration-2">Sign in here</Link>
                </p>

                <div className="pt-8 text-center">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] leading-relaxed">
                        By creating an account, you agree to our <br />
                        <Link href="/terms" className="underline underline-offset-2">Terms of Service</Link> and <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
