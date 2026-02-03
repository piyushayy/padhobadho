"use client"

import { useState } from "react"
import { deleteQuestion } from "@/actions/admin"
import { toast } from "sonner"
import { Search, Edit3, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import QuestionDialog from "./question-dialog"

interface Question {
    id: string
    content: string
    difficulty: string
    subject: { name: string }
    topic: { name: string }
    options: any
    correctOption: number
    explanation?: string | null
    subjectId: string
    topicId: string
}

export default function QuestionListClient({ initialQuestions, subjects }: { initialQuestions: Question[], subjects: any[] }) {
    // 1. Core State
    const [questions, setQuestions] = useState(initialQuestions)
    const [search, setSearch] = useState("")
    const router = useRouter()

    // 2. Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

    // 3. Bulk Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [isDeleting, setIsDeleting] = useState(false)

    // 4. Filtering Logic
    const filtered = questions.filter(q =>
        q.content.toLowerCase().includes(search.toLowerCase()) ||
        q.subject.name.toLowerCase().includes(search.toLowerCase()) ||
        q.topic.name.toLowerCase().includes(search.toLowerCase())
    )

    // 5. Actions Handlers
    const toggleSelectAll = () => {
        if (selectedIds.size === filtered.length && filtered.length > 0) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(filtered.map(q => q.id)))
        }
    }

    const toggleSelect = (id: string) => {
        const next = new Set(selectedIds)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelectedIds(next)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) return
        try {
            await deleteQuestion(id)
            setQuestions(questions.filter(q => q.id !== id))
            // Also remove from selection if present
            if (selectedIds.has(id)) {
                const next = new Set(selectedIds)
                next.delete(id)
                setSelectedIds(next)
            }
            toast.success("Question deleted successfully")
            router.refresh()
        } catch (err) {
            toast.error("Failed to delete question")
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} questions?`)) return
        setIsDeleting(true)
        try {
            const { deleteQuestions } = await import("@/actions/questions")
            await deleteQuestions(Array.from(selectedIds))

            // Optimistic update
            setQuestions(questions.filter(q => !selectedIds.has(q.id)))
            setSelectedIds(new Set())
            toast.success("Questions deleted")
            router.refresh()
        } catch (e) {
            toast.error("Failed to delete selection")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleDeleteAll = async () => {
        if (!confirm("WARNING: This will delete ALL questions in the database. Are you absolutely sure?")) return
        const doubleCheck = prompt("Type 'DELETE' to confirm:")
        if (doubleCheck !== "DELETE") return

        setIsDeleting(true)
        try {
            const { deleteAllQuestions } = await import("@/actions/questions")
            await deleteAllQuestions()
            setQuestions([])
            setSelectedIds(new Set())
            toast.success("All questions deleted permanently")
            router.refresh()
        } catch (e) {
            toast.error("Failed to delete all")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleEdit = (question: Question) => {
        setEditingQuestion(question)
        setIsDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingQuestion(null)
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-12">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between gap-6 items-end">
                <div className="flex-1 w-full space-y-4">
                    {/* Search & Actions */}
                    <div className="flex flex-wrap gap-4 items-center bg-card border p-6 rounded-[2rem] shadow-sm w-full">
                        <div className="flex-1 min-w-[300px] relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search question content, subjects or topics..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-card border-2 border-border rounded-2xl outline-none focus:border-primary transition-all text-foreground font-bold"
                            />
                        </div>
                        <Link href="/admin/questions/upload" className="flex items-center gap-2 px-6 py-3 bg-muted border-2 border-transparent hover:border-border rounded-2xl font-bold transition-all text-foreground">
                            Bulk Upload
                        </Link>
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-2xl font-bold hover:scale-105 transition-all shadow-lg"
                        >
                            + New Question
                        </button>
                    </div>

                    {/* Bulk Actions Toolbar */}
                    {(selectedIds.size > 0 || questions.length > 0) && (
                        <div className="flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/10 border-2 border-rose-100 dark:border-rose-900/30 p-4 rounded-2xl">
                            <div className="flex items-center gap-4 text-sm font-bold text-rose-700 dark:text-rose-400">
                                {selectedIds.size > 0 ? (
                                    <span>{selectedIds.size} selected</span>
                                ) : (
                                    <span className="text-muted-foreground">Select questions to delete</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {selectedIds.size > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        disabled={isDeleting}
                                        className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-all flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete Selected
                                    </button>
                                )}
                                <button
                                    onClick={handleDeleteAll}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-transparent text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800 transition-all"
                                >
                                    Delete ALL Questions
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border rounded-[2.5rem] overflow-hidden shadow-sm">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-muted/50 border-b uppercase text-[10px] font-black tracking-widest text-muted-foreground">
                            <th className="px-8 py-6 w-12">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </th>
                            <th className="px-8 py-6">Question Preview</th>
                            <th className="px-8 py-6">Subject / Topic</th>
                            <th className="px-8 py-6">Level</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y border-border font-medium">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground italic">
                                    No questions found matching your search.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((q) => (
                                <tr key={q.id} className={`group hover:bg-muted/50 transition-all text-foreground ${selectedIds.has(q.id) ? "bg-muted/30" : ""}`}>
                                    <td className="px-8 py-6 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(q.id)}
                                            onChange={() => toggleSelect(q.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                    </td>
                                    <td className="px-8 py-6 max-w-md">
                                        <p className="line-clamp-2 text-foreground font-bold">{q.content}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">ID: {q.id.substring(0, 8)}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-primary font-bold">{q.subject.name}</span>
                                            <span className="text-xs text-muted-foreground">{q.topic.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${q.difficulty === "EASY" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" :
                                            q.difficulty === "MEDIUM" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" :
                                                "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                            }`}>
                                            {q.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(q)}
                                                className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl border border-transparent transition-all"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(q.id)}
                                                className="p-3 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/20 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <QuestionDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                initialData={editingQuestion}
                subjects={subjects}
                onSuccess={router.refresh}
            />
        </div>
    )
}
