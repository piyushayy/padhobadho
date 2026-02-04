"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Loader2, User, School, Phone, Calendar, GraduationCap } from "lucide-react"
import { submitOnboarding } from "@/actions/onboarding"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function OnboardingFlow() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        age: "" as string | number,
        school: "",
        phoneNumber: "",
        stream: ""
    })

    const streams = [
        { id: "SCIENCE", name: "Science", icon: "🔬", desc: "PCM, PCB, etc." },
        { id: "COMMERCE", name: "Commerce", icon: "📊", desc: "Accounts, Economics, etc." },
        { id: "HUMANITIES", name: "Humanities", icon: "🏛️", desc: "History, Pol Sci, etc." },
        { id: "GENERIC", name: "General/Other", icon: "🎓", desc: "Common Aptitude, etc." }
    ]

    async function handleComplete() {
        if (!formData.name || !formData.age || !formData.school || !formData.phoneNumber || !formData.stream) {
            toast.error("Please complete all fields.")
            return
        }

        setIsSubmitting(true)
        try {
            await submitOnboarding({
                ...formData,
                age: Number(formData.age)
            })
            toast.success("Profile customized!")
            router.push("/dashboard")
        } catch (err) {
            toast.error("Something went wrong.")
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
                                <p className="text-muted-foreground text-lg">Let's start by setting up your basic profile.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-black tracking-widest text-primary flex items-center gap-2">
                                        <User size={14} /> Full Name
                                    </label>
                                    <input
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                        className="w-full h-14 rounded-xl border-2 px-4 bg-background outline-none focus:border-primary transition-all font-bold"
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
                                        onChange={(e) => setFormData(p => ({ ...p, age: e.target.value }))}
                                        className="w-full h-14 rounded-xl border-2 px-4 bg-background outline-none focus:border-primary transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs uppercase font-black tracking-widest text-primary flex items-center gap-2">
                                        <School size={14} /> School / Institution Name
                                    </label>
                                    <input
                                        placeholder="Where do you study?"
                                        value={formData.school}
                                        onChange={(e) => setFormData(p => ({ ...p, school: e.target.value }))}
                                        className="w-full h-14 rounded-xl border-2 px-4 bg-background outline-none focus:border-primary transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs uppercase font-black tracking-widest text-primary flex items-center gap-2">
                                        <Phone size={14} /> Mobile Number
                                    </label>
                                    <input
                                        placeholder="+91 00000 00000"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData(p => ({ ...p, phoneNumber: e.target.value }))}
                                        className="w-full h-14 rounded-xl border-2 px-4 bg-background outline-none focus:border-primary transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    disabled={!formData.name || !formData.age || !formData.school || !formData.phoneNumber}
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {streams.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setFormData(prev => ({ ...prev, stream: s.id }))}
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
