"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Chrome, MoveRight, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react"
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
        <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 selection:bg-primary/20">
            {/* Back to Home */}
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[13px] font-bold text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[380px] space-y-10 py-12"
            >
                <div className="text-center space-y-4">
                    <Link href="/" className="text-3xl font-serif font-black tracking-tighter text-primary inline-block">pb.</Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-serif font-black tracking-tight">Welcome back</h1>
                        <p className="text-muted-foreground font-medium text-sm">Continue your journey to perfection.</p>
                    </div>
                </div>

                {/* Social Login */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full h-12 rounded-xl border border-border flex items-center justify-center gap-3 text-[15px] font-bold hover:bg-accent transition-all active:scale-[0.98] text-foreground"
                >
                    <Chrome className="w-5 h-5" />
                    Sign in with Google
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border"></span></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground"><span className="bg-background px-4">Or use credentials</span></div>
                </div>

                {/* Credentials Form */}
                <form onSubmit={handleCredentialsLogin} className="space-y-3">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email address"
                            required
                            className="w-full h-12 bg-background border border-border rounded-xl pl-11 pr-4 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-[15px] text-foreground placeholder:text-muted-foreground/60"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full h-12 bg-background border border-border rounded-xl pl-11 pr-4 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-[15px] text-foreground placeholder:text-muted-foreground/60"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-foreground text-background rounded-xl text-[15px] font-black flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-lg shadow-black/5 dark:shadow-white/5"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <MoveRight className="w-5 h-5" /></>}
                    </button>
                </form>

                <p className="text-center text-[13px] text-muted-foreground font-bold">
                    Don't have an account? <Link href="/auth/sign-up" className="text-primary hover:underline underline-offset-4 decoration-2">Create one for free</Link>
                </p>
            </motion.div>
        </div>
    )
}
