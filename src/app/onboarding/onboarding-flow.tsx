"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, ArrowRight, GraduationCap, BookOpen, Target, Sparkles, Loader2 } from "lucide-react"
import { submitOnboarding } from "@/actions/onboarding"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Exam {
    id: string
    name: string
    code: string
    description: string | null
}

interface Subject {
    id: string
    name: string
    exams: { id: string, code: string }[]
}

export default function OnboardingFlow({ subjects, exams }: { subjects: Subject[], exams: Exam[] }) {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        targetExamId: "",
        stream: "",
        targetUniversity: "",
        targetCourse: "",
        subjectIds: [] as string[]
    })

    const filteredSubjects = subjects.filter(s =>
        !formData.targetExamId || s.exams.some(e => e.id === formData.targetExamId)
    )

    const streams = [
        { id: "SCIENCE", name: "Science", icon: "🔬", desc: "PCM, PCB, etc." },
        { id: "COMMERCE", name: "Commerce", icon: "📊", desc: "Accounts, Eco, etc." },
        { id: "HUMANITIES", name: "Humanities", icon: "🏛️", desc: "History, Pol Sci, etc." },
        { id: "GENERIC", name: "General/Other", icon: "🎓", desc: "Common Aptitude, etc." }
    ]

    async function handleComplete() {
        if (!formData.targetExamId || !formData.stream || !formData.targetUniversity || formData.subjectIds.length === 0) {
            toast.error("Please complete all fields.")
            return
        }

        setIsSubmitting(true)
        try {
            await submitOnboarding(formData)
            toast.success("Profile customized!")
            router.push("/dashboard")
        } catch (err) {
            toast.error("Something went wrong.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleSubject = (id: string) => {
        setFormData(prev => ({
            ...prev,
            subjectIds: prev.subjectIds.includes(id)
                ? prev.subjectIds.filter(sid => sid !== id)
                : [...prev.subjectIds, id]
        }))
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -top-1/2 -left-1/4 h-full w-full" />

            <div className="w-full max-w-3xl relative z-10">
                {/* Progress Dots */}
                <div className="flex justify-center gap-3 mb-12">
                    {[1, 2, 3, 4, 5].map((s) => (
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
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center space-y-4">
                                <h1 className="text-4xl md:text-5xl font-serif font-black text-foreground">Welcome, Aspirant!</h1>
                                <p className="text-muted-foreground text-lg">Let's start by getting to know you better.</p>
                            </div>

                            <div className="max-w-md mx-auto space-y-4">
                                <label className="text-xs uppercase font-black tracking-widest text-primary">What should we call you?</label>
                                <input
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full h-16 rounded-2xl text-2xl font-bold border-2 focus:ring-4 ring-primary/10 px-6 bg-background outline-none focus:border-primary transition-all text-center"
                                />
                            </div>

                            <div className="flex justify-end pt-8">
                                <button
                                    disabled={!formData.name}
                                    onClick={() => setStep(2)}
                                    className="h-16 px-12 rounded-full font-black text-xl gap-3 bg-primary text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                                >
                                    Next <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-4xl md:text-5xl font-serif font-black text-foreground text-glow">Define Your Goal</h1>
                                <p className="text-muted-foreground text-lg">Which competitive exam are you targeting?</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {exams.map((e) => (
                                    <button
                                        key={e.id}
                                        onClick={() => setFormData(prev => ({ ...prev, targetExamId: e.id }))}
                                        className={`p-6 rounded-[2rem] border-2 text-left transition-all relative group ${formData.targetExamId === e.id ? "border-primary bg-primary/5 ring-4 ring-primary/5" : "border-border hover:border-primary/20 hover:bg-muted/50"}`}
                                    >
                                        <h3 className="text-lg font-black mb-1">{e.code}</h3>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{e.name}</p>
                                        {formData.targetExamId === e.id && (
                                            <div className="absolute top-4 right-4 text-primary">
                                                <CheckCircle2 size={20} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between pt-8">
                                <button onClick={() => setStep(1)} className="rounded-full px-8 py-3 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Back</button>
                                <button
                                    disabled={!formData.targetExamId}
                                    onClick={() => setStep(3)}
                                    className="h-16 px-12 rounded-full font-black text-xl gap-3 bg-primary text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                                >
                                    Select Stream <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-4xl md:text-5xl font-serif font-black text-foreground">Academic Stream</h1>
                                <p className="text-muted-foreground text-lg">Select the background that best fits your preparation.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {streams.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setFormData(prev => ({ ...prev, stream: s.id }))}
                                        className={`p-6 rounded-[2rem] border-2 text-left transition-all ${formData.stream === s.id ? "border-primary bg-primary/5 ring-4 ring-primary/5" : "border-border hover:border-primary/20 hover:bg-muted/50"}`}
                                    >
                                        <span className="text-3xl mb-3 block">{s.icon}</span>
                                        <h3 className="text-lg font-bold mb-1">{s.name}</h3>
                                        <p className="text-[10px] text-muted-foreground font-medium">{s.desc}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between pt-8">
                                <button onClick={() => setStep(2)} className="rounded-full px-8 py-3 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Back</button>
                                <button
                                    disabled={!formData.stream}
                                    onClick={() => setStep(4)}
                                    className="h-16 px-12 rounded-full font-black text-xl gap-3 bg-primary text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    Pick Subjects <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-4xl md:text-5xl font-serif font-black text-foreground">Focused Learning</h1>
                                <p className="text-muted-foreground text-lg">Select the subjects you want to master for {exams.find(e => e.id === formData.targetExamId)?.code || 'your exam'}.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[40vh] overflow-y-auto p-4 custom-scrollbar">
                                {filteredSubjects.length === 0 ? (
                                    <div className="col-span-full py-12 text-center text-muted-foreground">
                                        No specific subjects available for this exam yet. <br />
                                        Try another exam or contact support.
                                    </div>
                                ) : (
                                    filteredSubjects.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => toggleSubject(s.id)}
                                            className={`p-6 rounded-3xl border-2 text-center transition-all flex flex-col items-center gap-3 ${formData.subjectIds.includes(s.id) ? "border-primary bg-primary/5 text-primary scale-105" : "border-border hover:bg-muted"}`}
                                        >
                                            <BookOpen className="w-6 h-6 mb-1" />
                                            <span className="text-[13px] font-black leading-tight uppercase tracking-tighter">{s.name}</span>
                                            {formData.subjectIds.includes(s.id) && <CheckCircle2 className="w-4 h-4" />}
                                        </button>
                                    ))
                                )}
                            </div>

                            <div className="flex justify-between pt-8">
                                <button onClick={() => setStep(3)} className="rounded-full px-8 py-3 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Back</button>
                                <button
                                    disabled={formData.subjectIds.length === 0}
                                    onClick={() => setStep(5)}
                                    className="h-16 px-12 rounded-full font-black text-xl gap-3 bg-primary text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    Target Dream <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-4xl md:text-5xl font-serif font-black text-foreground">The Destination</h1>
                                <p className="text-muted-foreground text-lg">Define your ultimate goal to personalize your journey.</p>
                            </div>

                            <div className="space-y-8 max-w-md mx-auto">
                                <div className="space-y-4">
                                    <label className="text-xs uppercase font-black tracking-widest text-primary flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" /> Dream Institution / Academy
                                    </label>
                                    <input
                                        placeholder="e.g., IIM Ahmedabad, NDA Pune"
                                        value={formData.targetUniversity}
                                        onChange={(e) => setFormData(prev => ({ ...prev, targetUniversity: e.target.value }))}
                                        className="w-full h-16 rounded-2xl text-lg font-bold border-2 focus:ring-4 ring-primary/10 px-6 bg-background outline-none focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs uppercase font-black tracking-widest text-primary flex items-center gap-2">
                                        <Target className="w-4 h-4" /> Specific Goal / Designation
                                    </label>
                                    <input
                                        placeholder="e.g., MBA, Lieutenant"
                                        value={formData.targetCourse}
                                        onChange={(e) => setFormData(prev => ({ ...prev, targetCourse: e.target.value }))}
                                        className="w-full h-16 rounded-2xl text-lg font-bold border-2 focus:ring-4 ring-primary/10 px-6 bg-background outline-none focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between pt-8">
                                <button onClick={() => setStep(4)} className="rounded-full px-8 py-3 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Back</button>
                                <button
                                    disabled={!formData.targetUniversity || isSubmitting}
                                    onClick={handleComplete}
                                    className="h-20 px-16 rounded-full font-black text-2xl gap-3 shadow-2xl shadow-primary/20 bg-primary text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Ignite Growth <Sparkles className="w-6 h-6" /></>}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
