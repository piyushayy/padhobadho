"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Loader2, User, School, Calendar, AtSign, Check, X, AlertCircle } from "lucide-react"
import { submitOnboarding, checkUsername } from "@/actions/onboarding"
import { toast } from "sonner"

export default function OnboardingFlow() {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'available' | 'taken'>('idle')
    const [serverError, setServerError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        age: "" as string | number,
        school: "",
        stream: ""
    })

    const streams = [
        { id: "SCIENCE", name: "Science", icon: "🔬", desc: "PCM, PCB, etc." },
        { id: "COMMERCE", name: "Commerce", icon: "📊", desc: "Accounts, Economics, etc." },
        { id: "HUMANITIES", name: "Humanities", icon: "🏛️", desc: "History, Pol Sci, etc." },
        { id: "GENERIC", name: "General/Other", icon: "🎓", desc: "Common Aptitude, etc." }
    ]

    const handleUsernameChange = async (val: string) => {
        const cleanVal = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
        setFormData(p => ({ ...p, username: cleanVal }))
        setServerError(null)

        if (cleanVal.length < 3) {
            setUsernameStatus('idle')
            return
        }

        setIsCheckingUsername(true)
        try {
            const taken = await checkUsername(cleanVal)
            setUsernameStatus(taken ? 'taken' : 'available')
        } catch (err) {
            setUsernameStatus('idle')
        } finally {
            setIsCheckingUsername(false)
        }
    }

    async function handleComplete() {
        if (!formData.name || !formData.username || !formData.age || !formData.school || !formData.stream) {
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
                {/* Progress Indicators */}
                <div className="flex justify-center gap-3 mb-10">
                    {[1, 2].map((s) => (
                        <div
                            key={s}
                            className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? "w-12 bg-primary" : "w-4 bg-muted"}`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-3">
                                <h1 className="text-4xl md:text-5xl font-serif font-black text-foreground">Welcome, Aspirant!</h1>
                                <p className="text-muted-foreground text-lg">Let's start by setting up your profile.</p>
                            </div>

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
                                        className="w-full h-14 rounded-xl border-2 px-4 bg-background outline-none focus:border-primary transition-all font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-black tracking-widest text-primary flex items-center gap-2">
                                        <AtSign size={14} /> Unique Username
                                    </label>
                                    <div className="relative">
                                        <input
                                            placeholder="username"
                                            value={formData.username}
                                            onChange={(e) => handleUsernameChange(e.target.value)}
                                            className={`w-full h-14 rounded-xl border-2 px-4 bg-background outline-none transition-all font-bold ${usernameStatus === 'available' ? 'border-emerald-500 ring-4 ring-emerald-500/5' :
                                                    usernameStatus === 'taken' ? 'border-rose-500 ring-4 ring-rose-500/5' :
                                                        'focus:border-primary'
                                                }`}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            {isCheckingUsername ? <Loader2 size={16} className="animate-spin text-muted-foreground" /> :
                                                usernameStatus === 'available' ? <Check size={16} className="text-emerald-500" /> :
                                                    usernameStatus === 'taken' ? <X size={16} className="text-rose-500" /> : null}
                                        </div>
                                    </div>
                                    {usernameStatus === 'taken' && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-1">This username is already taken</p>}
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
                                        className="w-full h-14 rounded-xl border-2 px-4 bg-background outline-none focus:border-primary transition-all font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
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
                                        className="w-full h-14 rounded-xl border-2 px-4 bg-background outline-none focus:border-primary transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    disabled={!formData.name || !formData.username || !formData.age || !formData.school || usernameStatus !== 'available'}
                                    onClick={() => setStep(2)}
                                    className="h-16 px-12 rounded-full font-black text-xl gap-3 bg-primary text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                                >
                                    Next Step <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-3">
                                <h1 className="text-4xl md:text-5xl font-serif font-black text-foreground">Select Stream</h1>
                                <p className="text-muted-foreground text-lg">Choose the academic background you're preparing in.</p>
                            </div>

                            {serverError && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-sm font-bold">
                                    <AlertCircle size={18} />
                                    {serverError}
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {streams.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, stream: s.id }))
                                            setServerError(null)
                                        }}
                                        className={`p-6 rounded-3xl border-2 text-left transition-all relative ${formData.stream === s.id ? "border-primary bg-primary/5 ring-4 ring-primary/5" : "border-border hover:border-primary/20 hover:bg-muted/50"}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl">{s.icon}</span>
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground">{s.name}</h3>
                                                <p className="text-sm text-muted-foreground">{s.desc}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between pt-8">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-8 py-3 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    disabled={!formData.stream || isSubmitting}
                                    onClick={handleComplete}
                                    className="h-20 px-16 rounded-full font-black text-2xl gap-3 shadow-2xl shadow-primary/20 bg-primary text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>Finalize Setup <Sparkles className="w-6 h-6" /></>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
