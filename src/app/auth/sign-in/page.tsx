"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Chrome, Mail, Lock, MoveRight, Loader2, ArrowLeft } from "lucide-react"
import { login } from "@/actions/auth"
import { toast } from "sonner"
import { signIn } from "next-auth/react"

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleCredentialsLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        try {
            const result = await login(formData)
            if (result?.error) {
                toast.error(result.error)
                setIsLoading(false)
            }
        } catch (err) {
            toast.error("An unexpected error occurred")
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/dashboard" })
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

                {/* Left Side: Welcome + Illustration */}
                <div className="md:w-1/2 bg-[#8371F5] text-white flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 max-w-sm">
                        <Link href="/" className="text-3xl font-serif font-black tracking-tighter text-white inline-block mb-8">pb.</Link>
                        <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 leading-tight">Welcome Back!</h2>
                        <p className="text-lg text-white/80 font-medium leading-relaxed mb-10">
                            Sign in to continue your journey to excellence. Your dashboard is waiting.
                        </p>
                        {/* Abstract Shape/Illustration replacement since external images might break */}
                        <div className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-3xl rotate-12 flex items-center justify-center border border-white/30 mx-auto shadow-2xl">
                            <div className="w-20 h-20 bg-white rounded-2xl rotate-45 opacity-90"></div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-background">
                    <div className="w-full max-w-md mx-auto space-y-8">
                        <div>
                            <h3 className="text-3xl font-bold tracking-tight text-foreground">Sign In</h3>
                            <p className="text-muted-foreground mt-2 font-medium">Enter your credentials to access your account</p>
                        </div>

                        <div className="flex flex-col gap-6">
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full h-14 rounded-xl border-2 border-border/50 flex items-center justify-center gap-3 text-sm font-bold hover:bg-accent hover:border-border transition-all active:scale-[0.98] text-foreground"
                            >
                                <Chrome className="w-5 h-5" />
                                Sign in with Google
                            </button>

                            <div className="relative flex items-center">
                                <span className="w-full border-t border-border/50"></span>
                                <span className="bg-background px-4 text-xs font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Or continue with</span>
                                <span className="w-full border-t border-border/50"></span>
                            </div>

                            <form onSubmit={handleCredentialsLogin} className="space-y-5">
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
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login <MoveRight className="w-5 h-5" /></>}
                                </button>
                            </form>
                        </div>

                        <p className="mt-8 text-sm text-center font-medium text-muted-foreground">
                            Don’t have an account? <Link href="/auth/sign-up" className="text-[#8371F5] hover:underline font-bold">Sign up</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
