"use client"

import { useState, useRef, useEffect } from "react"
import { Target, Check, ChevronDown, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { updateTargetExam } from "@/actions/profile"

interface Exam {
    id: string
    name: string
    code: string
}

const DEFAULT_EXAMS: Exam[] = [
    { id: "class-12", name: "Class 12 Boards", code: "CLASS-12" },
    { id: "jee", name: "JEE (Main & Adv)", code: "JEE" },
    { id: "neet", name: "NEET-UG", code: "NEET" },
    { id: "cuet-ug", name: "CUET-UG", code: "CUET-UG" },
    { id: "ssc", name: "SSC (CGL/CHSL/MTS)", code: "SSC" },
    { id: "dsssb", name: "DSSSB Exams", code: "DSSSB" },
]

export default function ExamSwitcher({
    currentExam,
    allExams = []
}: {
    currentExam: Exam | null
    allExams?: Exam[]
}) {
    const examsList = allExams.length > 0 ? allExams : DEFAULT_EXAMS
    const [selected, setSelected] = useState<Exam>(
        currentExam || examsList[0] || DEFAULT_EXAMS[0]
    )
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = async (exam: Exam) => {
        setSelected(exam)
        setIsOpen(false)
        try {
            await updateTargetExam(exam.id)
            toast.success(`Target switched to ${exam.name}`, {
                description: "Your practice drills and mock tests are now tailored for this exam."
            })
        } catch {
            // Unauthenticated guest or local fallback
            toast.success(`Viewing ${exam.name}`)
        }
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-accent transition-all duration-200 cursor-pointer text-left shadow-xs group"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary group-hover:scale-105 transition-transform">
                    <Target size={14} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">
                        Target Exam
                    </p>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black uppercase tracking-tight text-foreground">
                            {selected.code || selected.name}
                        </span>
                        <ChevronDown
                            size={12}
                            className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-card border border-border shadow-xl z-50 backdrop-blur-xl"
                        role="listbox"
                    >
                        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50 flex items-center justify-between">
                            <span>Select Target</span>
                            <Sparkles size={11} className="text-primary" />
                        </div>
                        <div className="space-y-1 mt-1">
                            {examsList.map((exam) => {
                                const isCurrent = exam.id === selected.id || exam.code === selected.code
                                return (
                                    <button
                                        key={exam.id}
                                        type="button"
                                        onClick={() => handleSelect(exam)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 text-left ${
                                            isCurrent
                                                ? "bg-primary/10 text-primary"
                                                : "text-foreground hover:bg-muted"
                                        }`}
                                        role="option"
                                        aria-selected={isCurrent}
                                    >
                                        <span>{exam.name}</span>
                                        {isCurrent && (
                                            <Check size={14} className="text-primary" strokeWidth={3} />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
