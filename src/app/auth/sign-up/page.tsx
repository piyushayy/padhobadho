"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MoveRight, Loader2, ArrowLeft } from "lucide-react"
import { signUp } from "@/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await signUp(new FormData(e.currentTarget))
            if (result?.error) {
                if (typeof result.error === "string") toast.error(result.error)
                else toast.error("Please check your input.")
            } else {
                router.push("/auth/sign-in")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative">
            <div className="w-full max-w-4xl mb-6 flex items-center justify-between px-2">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors p-2"
                >
                    <ArrowLeft size={18} /> <span className="hidden sm:inline">Back</span>
                </Link>
                <Link href="/" className="text-xl font-serif font-black tracking-tight flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center text-[10px] font-black">PB</span>
                    <span className="text-base sm:text-xl">padhobadho</span>
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden border bg-card shadow-xl"
            >
                {/* FORM */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold mb-2">Create account</h1>
                    <p className="text-muted-foreground mb-8">
                        Start preparing the right way.
                    </p>

                    <form onSubmit={handleSignUp} className="space-y-4">
                        <input
                            name="name"
                            required
                            placeholder="Full name"
                            className="w-full h-12 rounded-lg border px-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="Email"
                            className="w-full h-12 rounded-lg border px-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="Password"
                            className="w-full h-12 rounded-lg border px-4 focus:ring-2 focus:ring-primary outline-none"
                        />

                        {/* Honeypot field - invisible to real users */}
                        <div style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }}>
                            <input
                                type="text"
                                name="confirm_email"
                                tabIndex={-1}
                                autoComplete="off"
                            />
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <>Get started <MoveRight size={16} /></>}
                        </button>
                    </form>

                    <p className="text-sm text-center text-muted-foreground mt-6">
                        Already have an account?{" "}
                        <Link href="/auth/sign-in" className="text-primary font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* BRAND */}
                <div className="hidden md:flex items-center justify-center bg-zinc-900 text-white p-10">
                    <div className="max-w-sm text-center">
                        <div className="text-2xl font-serif font-black mb-4">pb.</div>
                        <h2 className="text-3xl font-serif font-bold mb-4">
                            Build the habit.
                        </h2>
                        <p className="text-white/80">
                            Padhega India. Badhega India.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
