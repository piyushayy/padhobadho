"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Chrome, Mail, Lock, MoveRight, Loader2, ArrowLeft, Sparkles, User } from "lucide-react"
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
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center p-4 md:p-8 font-sans">
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[13px] font-bold text-muted-foreground hover:text-foreground transition-colors group z-50">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row w-full max-w-5xl bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/50 min-h-[600px]"
            >

                {/* Left Side: Welcome + Benefits */}
                <div className="md:w-1/2 bg-[#8371F5] text-white flex flex-col items-center justify-center p-12 text-center relative overflow-hidden order-1 md:order-1">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 max-w-sm">
                        <Link href="/" className="text-3xl font-serif font-black tracking-tighter text-white inline-block mb-8">pb.</Link>
                        <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 leading-tight">Join the Elite.</h2>
                        <p className="text-lg text-white/80 font-medium leading-relaxed mb-10">
                            Create your account to unlock adaptive practice, mock tests, and personalized analytics.
                        </p>

                        {/* Benefits */}
                        <div className="space-y-4 text-left bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                            {[
                                "Unlimited Practice Questions",
                                "Detailed Performance Analytics",
                                "National Mock Tests"
                            ].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="p-1 bg-white rounded-full"><Sparkles className="w-3 h-3 text-[#8371F5]" /></div>
                                    <span className="font-bold text-sm">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Sign Up Form */}
                <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-background order-2 md:order-2">
                    <div className="w-full max-w-md mx-auto space-y-8">
                        <div>
                            <h3 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h3>
                            <p className="text-muted-foreground mt-2 font-medium">It takes less than a minute</p>
                        </div>

                        <form onSubmit={handleSignUp} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-foreground/80 pl-1" htmlFor="name">Full Name</label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        className="w-full h-14 bg-muted/30 border-2 border-border/50 rounded-xl px-4 focus:border-[#8371F5] focus:ring-4 focus:ring-[#8371F5]/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-foreground/80 pl-1" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        className="w-full h-14 bg-muted/30 border-2 border-border/50 rounded-xl px-4 focus:border-[#8371F5] focus:ring-4 focus:ring-[#8371F5]/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-foreground/80 pl-1" htmlFor="password">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="w-full h-14 bg-muted/30 border-2 border-border/50 rounded-xl px-4 focus:border-[#8371F5] focus:ring-4 focus:ring-[#8371F5]/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/50"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-[#8371F5] text-white rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-xl shadow-[#8371F5]/20"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get Started <MoveRight className="w-5 h-5" /></>}
                            </button>
                        </form>

                        <p className="mt-8 text-sm text-center font-medium text-muted-foreground">
                            Already have an account? <Link href="/auth/sign-in" className="text-[#8371F5] hover:underline font-bold">Sign in</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
