"use client"

import { Target, Check } from "lucide-react"

interface Exam {
    id: string
    name: string
    code: string
}

export default function ExamSwitcher({ currentExam, allExams }: { currentExam: Exam | null, allExams: Exam[] }) {
    return (
        <div className="relative">
            <div
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 border border-primary/20 transition-all cursor-default"
            >
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                    <Target size={14} strokeWidth={3} />
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">Target Exam</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-tighter text-foreground">CUET-UG</span>
                        <Check size={14} className="text-primary" strokeWidth={4} />
                    </div>
                </div>
            </div>
        </div>
    )
}
