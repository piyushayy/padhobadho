"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, FileUp, Edit3, Trash2, BookOpen, Layers, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { deleteQuestion } from "@/actions/admin"
import QuestionDialog from "./question-dialog"

interface QuestionListClientProps {
    initialQuestions: any[]
    subjects: any[]
}

export default function QuestionListClient({ initialQuestions, subjects }: QuestionListClientProps) {
    const [questions, setQuestions] = useState(initialQuestions)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("ALL")
    const [selectedDifficulty, setSelectedDifficulty] = useState("ALL")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<any>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const filteredQuestions = questions.filter((q) => {
        const matchesSearch =
            q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (q.subject?.name && q.subject.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (q.topic?.name && q.topic.name.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesSubject = selectedSubject === "ALL" || q.subjectId === selectedSubject
        const matchesDifficulty = selectedDifficulty === "ALL" || q.difficulty === selectedDifficulty

        return matchesSearch && matchesSubject && matchesDifficulty
    })

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return
        setIsDeleting(id)
        try {
            await deleteQuestion(id)
            setQuestions((prev) => prev.filter((q) => q.id !== id))
            toast.success("Question deleted successfully")
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete question")
        } finally {
            setIsDeleting(null)
        }
    }

    const openCreateDialog = () => {
        setEditingQuestion(null)
        setIsDialogOpen(true)
    }

    const openEditDialog = (q: any) => {
        setEditingQuestion(q)
        setIsDialogOpen(true)
    }

    const getDifficultyBadge = (difficulty: string) => {
        switch (difficulty) {
            case "EASY":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            case "HARD":
                return "bg-rose-500/10 text-rose-500 border-rose-500/20"
            default:
                return "bg-amber-500/10 text-amber-500 border-amber-500/20"
        }
    }

    return (
        <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search question content, subject, or topic..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 bg-card border-border rounded-xl"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="h-11 px-3 bg-card border border-border rounded-xl text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                        className="h-11 px-3 bg-card border border-border rounded-xl text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="ALL">All Difficulties</option>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                    </select>

                    <Link href="/admin/questions/bulk-upload">
                        <Button variant="outline" className="h-11 gap-2 rounded-xl border-border">
                            <FileUp className="w-4 h-4" /> Bulk CSV
                        </Button>
                    </Link>

                    <Button onClick={openCreateDialog} className="h-11 gap-2 rounded-xl bg-primary text-primary-foreground">
                        <Plus className="w-4 h-4" /> Add Question
                    </Button>
                </div>
            </div>

            {/* Questions Counter & Summary */}
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                <span>Showing {filteredQuestions.length} of {questions.length} Questions</span>
            </div>

            {/* Questions Table / List */}
            {filteredQuestions.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold">No questions found</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                        {searchTerm || selectedSubject !== "ALL" || selectedDifficulty !== "ALL"
                            ? "Try adjusting your search terms or filters."
                            : "Start building your question library by uploading your first question."}
                    </p>
                    <Button onClick={openCreateDialog} className="rounded-xl gap-2">
                        <Plus className="w-4 h-4" /> Create First Question
                    </Button>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border/60">
                    {filteredQuestions.map((question) => {
                        const optionsList = Array.isArray(question.options) ? question.options : []
                        return (
                            <div key={question.id} className="p-6 hover:bg-muted/30 transition-colors space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {question.subject?.name && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary">
                                                    <BookOpen className="w-3 h-3" /> {question.subject.name}
                                                </span>
                                            )}
                                            {question.topic?.name && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-muted-foreground">
                                                    <Layers className="w-3 h-3" /> {question.topic.name}
                                                </span>
                                            )}
                                            <span
                                                className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getDifficultyBadge(
                                                    question.difficulty
                                                )}`}
                                            >
                                                {question.difficulty}
                                            </span>
                                        </div>

                                        <p className="text-foreground font-medium text-base line-clamp-3">
                                            {question.content}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={() => openEditDialog(question)}
                                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                            title="Edit question"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(question.id)}
                                            disabled={isDeleting === question.id}
                                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                                            title="Delete question"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Options Preview */}
                                {optionsList.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
                                        {optionsList.map((opt: string, idx: number) => {
                                            const isCorrect = idx === question.correctOption
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                                                        isCorrect
                                                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold"
                                                            : "bg-background border-border text-muted-foreground"
                                                    }`}
                                                >
                                                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] border border-current shrink-0">
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                    <span className="truncate">{opt}</span>
                                                    {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" />}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Question Dialog Modal */}
            <QuestionDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                initialData={editingQuestion}
                subjects={subjects}
                onSuccess={() => {
                    setIsDialogOpen(false)
                    window.location.reload()
                }}
            />
        </div>
    )
}
