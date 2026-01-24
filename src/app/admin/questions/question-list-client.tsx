"use client"

import { useState } from "react"
import { deleteQuestion } from "@/actions/admin"
import { toast } from "sonner"
import { Search, Filter, Edit3, Trash2, CheckCircle2, AlertTriangle } from "lucide-react"

interface Question {
    id: string
    content: string
    difficulty: string
    subject: { name: string }
    topic: { name: string }
}

export default function QuestionListClient({ initialQuestions }: { initialQuestions: Question[] }) {
    const [questions, setQuestions] = useState(initialQuestions)
    const [search, setSearch] = useState("")

    const filtered = questions.filter(q =>
        q.content.toLowerCase().includes(search.toLowerCase()) ||
        q.subject.name.toLowerCase().includes(search.toLowerCase()) ||
        q.topic.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) return

        try {
            await deleteQuestion(id)
            setQuestions(questions.filter(q => q.id !== id))
            toast.success("Question deleted successfully")
        } catch (err) {
            toast.error("Failed to delete question")
        }
    }

    return (
        <div className="space-y-12">
            {/* Filters Bar */}
            <div className="flex flex-wrap gap-4 items-center bg-card border p-6 rounded-[2rem] shadow-sm">
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
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-card border-2 border-border rounded-2xl font-bold hover:bg-muted transition-all text-foreground">
                        <Filter className="w-4 h-4" /> Filter by Subject
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-card border-2 border-border rounded-2xl font-bold hover:bg-muted transition-all text-foreground">
                        Difficulty
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border rounded-[2.5rem] overflow-hidden shadow-sm">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-muted/50 border-b uppercase text-[10px] font-black tracking-widest text-muted-foreground">
                            <th className="px-8 py-6">Question Preview</th>
                            <th className="px-8 py-6">Subject / Topic</th>
                            <th className="px-8 py-6">Level</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y border-border font-medium">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground italic">
                                    No questions found matching your search.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((q) => (
                                <tr key={q.id} className="group hover:bg-muted/50 transition-all text-foreground">
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
                                            <button className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl border border-transparent transition-all">
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
        </div>
    )
}
