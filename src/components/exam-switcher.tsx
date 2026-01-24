"use client"

import { useState } from "react"
import { ChevronDown, Target, Check, Sparkles, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { updateTargetExam } from "@/actions/profile"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Exam {
    id: string
    name: string
    code: string
}

export default function ExamSwitcher({ currentExam, allExams }: { currentExam: Exam | null, allExams: Exam[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter()

    async function handleSwitch(examId: string) {
        if (examId === currentExam?.id) {
            setIsOpen(false)
            return
        }

        setIsUpdating(true)
        try {
            await updateTargetExam(examId)
            toast.success(`Switched to ${allExams.find(e => e.id === examId)?.code} track`)
            setIsOpen(false)
            router.refresh()
        } catch (err) {
            toast.error("Failed to switch exam track")
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all group"
            >
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                    <Target size={14} strokeWidth={3} />
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">Target Exam</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-tighter">{currentExam?.code || "Select Exam"}</span>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-[1.5rem] shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-border bg-accent/30">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <Sparkles size={12} className="text-primary" /> Active Tracks
                                </h4>
                            </div>
                            <div className="p-1 max-h-[250px] overflow-y-auto custom-scrollbar">
                                {allExams.map((exam) => (
                                    <button
                                        key={exam.id}
                                        onClick={() => handleSwitch(exam.id)}
                                        disabled={isUpdating}
                                        className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-all group ${currentExam?.id === exam.id
                                            ? "bg-primary/5 text-primary"
                                            : "hover:bg-accent hover:text-foreground"
                                            }`}
                                    >
                                        <div className="space-y-0.5">
                                            <p className="font-black text-xs uppercase tracking-tighter">{exam.code}</p>
                                            <p className="text-[9px] opacity-60 font-medium truncate max-w-[140px]">{exam.name}</p>
                                        </div>
                                        {currentExam?.id === exam.id ? (
                                            <Check size={14} strokeWidth={4} />
                                        ) : isUpdating ? (
                                            <Loader2 size={14} className="animate-spin opacity-40" />
                                        ) : null}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
