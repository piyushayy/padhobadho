"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Filter, Plus, Trash2, Edit3, Upload, FileText, CheckCircle2 } from "lucide-react"
import QuestionDialog from "./question-dialog"
import { deleteQuestion } from "@/actions/admin"
import { toast } from "sonner"

interface Subject {
    id: string
    name: string
    topics: { id: string; name: string }[]
}

interface Question {
    id: string
    content: string
    options: any
    correctOption: number
    explanation?: string | null
    difficulty: "EASY" | "MEDIUM" | "HARD"
    subjectId: string
    topicId: string
    subject: { id: string; name: string }
    topic: { id: string; name: string }
}

export default function QuestionListClient({
    initialQuestions,
    subjects,
}: {
    initialQuestions: Question[]
    subjects: Subject[]
}) {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSubject, setSelectedSubject] = useState<string>("ALL")
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const filteredQuestions = initialQuestions.filter((q) => {
        const matchesSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSubject = selectedSubject === "ALL" || q.subjectId === selectedSubject
        const matchesDifficulty = selectedDifficulty === "ALL" || q.difficulty === selectedDifficulty
        return matchesSearch && matchesSubject && matchesDifficulty
    })

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return
        setIsDeleting(id)
        try {
            await deleteQuestion(id)
            toast.success("Question deleted")
            router.refresh()
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete question")
        } finally {
            setIsDeleting(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border bg-background text-sm font-medium outline-none focus:ring-2 ring-primary/20 transition-all"
                        />
                    </div>
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="h-11 px-3 rounded-xl border bg-background text-xs font-bold uppercase tracking-wider outline-none"
                    >
                        <option value="ALL">All Subjects</option>
                        {subjects.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="h-11 px-3 rounded-xl border bg-background text-xs font-bold uppercase tracking-wider outline-none"
                    >
                        <option value="ALL">All Difficulties</option>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/questions/bulk-upload"
                        className="h-11 px-4 rounded-xl border bg-card font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-muted transition-all"
                    >
                        <Upload size={16} /> Bulk Upload
                    </Link>
                    <button
                        onClick={() => {
                            setEditingQuestion(null)
                            setDialogOpen(true)
                        }}
                        className="h-11 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 shadow-md shadow-primary/20 transition-all"
                    >
                        <Plus size={16} /> New Question
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredQuestions.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-card">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-40" />
                        <h3 className="font-bold text-lg mb-1">No questions found</h3>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or add a new question.</p>
                    </div>
                ) : (
                    filteredQuestions.map((q) => (
                        <div
                            key={q.id}
                            className="p-6 rounded-2xl border bg-card hover:border-primary/40 transition-all space-y-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                                            {q.subject?.name}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground">
                                            {q.topic?.name}
                                        </span>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                q.difficulty === "HARD"
                                                    ? "bg-rose-500/10 text-rose-500"
                                                    : q.difficulty === "MEDIUM"
                                                    ? "bg-amber-500/10 text-amber-500"
                                                    : "bg-emerald-500/10 text-emerald-500"
                                            }`}
                                        >
                                            {q.difficulty}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-bold pt-1 text-foreground leading-snug">{q.content}</h4>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => {
                                            setEditingQuestion(q)
                                            setDialogOpen(true)
                                        }}
                                        className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        disabled={isDeleting === q.id}
                                        onClick={() => handleDelete(q.id)}
                                        className="p-2 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors disabled:opacity-50"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-2 pt-2">
                                {Array.isArray(q.options) &&
                                    q.options.map((opt: string, i: number) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded-xl border text-sm font-medium flex items-center gap-2.5 ${
                                                i === q.correctOption
                                                    ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold"
                                                    : "border-border/60 bg-muted/20 text-muted-foreground"
                                            }`}
                                        >
                                            <span className="w-6 h-6 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0">
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            <span>{opt}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <QuestionDialog
                isOpen={dialogOpen}
                onClose={() => {
                    setDialogOpen(false)
                    setEditingQuestion(null)
                }}
                initialData={editingQuestion}
                subjects={subjects}
                onSuccess={() => {
                    setDialogOpen(false)
                    setEditingQuestion(null)
                    router.refresh()
                }}
            />
        </div>
    )
}
