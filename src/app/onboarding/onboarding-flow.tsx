"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Loader2, User, School, Calendar, AlertCircle } from "lucide-react"
import { submitOnboarding } from "@/actions/onboarding"
import { toast } from "sonner"

export default function OnboardingFlow() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        age: "" as string | number,
        school: "",
    })

    async function handleComplete() {
        if (!formData.name || !formData.age || !formData.school) {
            toast.error("Please complete all fields.")
            return
        }

        setIsSubmitting(true)
        setServerError(null)
        try {
            const res = await submitOnboarding({
                ...formData,
                age: Number(formData.age)
            })

            if (res.success) {
                toast.success("Profile customized!")
                // Use window.location for a hard redirect to ensure session state is refreshed
                window.location.href = "/dashboard"
            }
        } catch (err: any) {
            const msg = err.message || "An unexpected error occurred. Please try again."
            setServerError(msg)
            toast.error(msg)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -top-1/2 -left-1/4 h-full w-full" />

            <div className="w-full max-w-2xl relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="onboarding-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="text-center space-y-3">
                            <h1 className="text-4xl md:text-5xl font-serif font-black text-foreground tracking-tight">Setup Your Profile</h1>
                            <p className="text-muted-foreground text-lg">Just a few details to get you started.</p>
                        </div>

                        {serverError && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-sm font-bold animate-in shake duration-300">
                                <AlertCircle size={18} />
                                {serverError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-black tracking-widest text-primary flex items-center gap-2">
                                    <User size={14} /> Full Name
                                </label>
                                <input
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData(p => ({ ...p, name: e.target.value }))
                                        setServerError(null)
                                    }}
                                    className="w-full h-14 rounded-xl border-2 px-4 bg-background outline-none focus:border-primary transition-all font-bold placeholder:font-normal"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase font-black tracking-widest text-primary flex items-center gap-2">
                                    <Calendar size={14} /> Your Age
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 18"
                                    value={formData.age}
                                    onChange={(e) => {
                                        setFormData(p => ({ ...p, age: e.target.value }))
                                        setServerError(null)
                                    }}
                                    className="w-full h-14 rounded-xl border-2 px-4 bg-background outline-none focus:border-primary transition-all font-bold placeholder:font-normal"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs uppercase font-black tracking-widest text-primary flex items-center gap-2">
                                    <School size={14} /> School Name
                                </label>
                                <input
                                    placeholder="Where do you study?"
                                    value={formData.school}
                                    onChange={(e) => {
                                        setFormData(p => ({ ...p, school: e.target.value }))
                                        setServerError(null)
                                    }}
                                    className="w-full h-14 rounded-xl border-2 px-4 bg-background outline-none focus:border-primary transition-all font-bold placeholder:font-normal"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-6 pt-4">
                            <button
                                disabled={!formData.name || !formData.age || !formData.school || isSubmitting}
                                onClick={handleComplete}
                                className="h-20 w-full rounded-full font-black text-2xl gap-3 shadow-2xl shadow-primary/20 bg-primary text-background flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    <>Finalize Setup <Sparkles className="w-8 h-8" /></>
                                )}
                            </button>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">By continuing, you agree to our terms of service</p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
