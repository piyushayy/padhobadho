
"use client"

import { useState, useEffect } from "react"
import { createQuestionSingle, updateQuestion } from "@/actions/admin"
import { toast } from "sonner"
import { X, CheckCircle, Plus, Trash2, Save, FileText, Check } from "lucide-react"

interface Subject {
    id: string
    name: string
    topics: { id: string; name: string }[]
}

interface QuestionDialogProps {
    isOpen: boolean
    onClose: () => void
    initialData?: any
    subjects: Subject[]
    onSuccess: () => void
}

export default function QuestionDialog({ isOpen, onClose, initialData, subjects, onSuccess }: QuestionDialogProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        content: "",
        options: ["", "", "", ""],
        correctOption: 0,
        explanation: "",
        subjectId: "",
        topicId: "",
        difficulty: "MEDIUM" as "EASY" | "MEDIUM" | "HARD"
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                content: initialData.content,
                options: (initialData.options as string[]) || ["", "", "", ""],
                correctOption: initialData.correctOption,
                explanation: initialData.explanation || "",
                subjectId: initialData.subjectId,
                topicId: initialData.topicId,
                difficulty: initialData.difficulty
            })
        } else {
            // Reset for new question
            setFormData({
                content: "",
                options: ["", "", "", ""],
                correctOption: 0,
                explanation: "",
                subjectId: subjects[0]?.id || "",
                topicId: "",
                difficulty: "MEDIUM"
            })
        }
    }, [initialData, subjects, isOpen])

    // Update topic selection when subject changes
    const selectedSubject = subjects.find(s => s.id === formData.subjectId)

    // Auto-select first topic if not set
    useEffect(() => {
        if (selectedSubject && !selectedSubject.topics.find(t => t.id === formData.topicId)) {
            setFormData(prev => ({ ...prev, topicId: selectedSubject.topics[0]?.id || "" }))
        }
    }, [formData.subjectId, selectedSubject])


    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.content || formData.options.some(o => !o) || !formData.subjectId || !formData.topicId) {
            toast.error("Please fill all required fields")
            return
        }

        setLoading(true)
        try {
            if (initialData) {
                await updateQuestion(initialData.id, formData)
                toast.success("Question updated successfully")
            } else {
                await createQuestionSingle(formData)
                toast.success("Question created successfully")
            }
            onSuccess()
            onClose()
        } catch (err) {
            toast.error("Failed to save question")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-2 shadow-2xl animate-in zoom-in-95">
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-card/80 backdrop-blur border-b">
                    <h2 className="text-2xl font-serif font-black">{initialData ? "Edit Question" : "New Question"}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Metadata Row */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subject</label>
                            <select
                                className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 font-bold outline-none focus:border-primary transition-all"
                                value={formData.subjectId}
                                onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                            >
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Topic</label>
                            <select
                                className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 font-bold outline-none focus:border-primary transition-all"
                                value={formData.topicId}
                                onChange={e => setFormData({ ...formData, topicId: e.target.value })}
                            >
                                {selectedSubject?.topics.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                                {!selectedSubject?.topics.length && <option value="">No topics available</option>}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Difficulty</label>
                            <select
                                className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 font-bold outline-none focus:border-primary transition-all"
                                value={formData.difficulty}
                                onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Question Content (Markdown Supported)</label>
                        <textarea
                            required
                            className="w-full h-32 bg-muted/30 border border-border rounded-2xl p-4 font-medium outline-none focus:border-primary transition-all resize-none"
                            placeholder="Type your question here..."
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Options</label>
                        <div className="grid gap-3">
                            {formData.options.map((option, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, correctOption: idx })}
                                        className={`shrink-0 w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${formData.correctOption === idx
                                                ? "bg-primary border-primary text-background"
                                                : "border-border hover:border-primary/50 text-muted-foreground"
                                            }`}
                                    >
                                        <span className="font-black text-lg">{String.fromCharCode(65 + idx)}</span>
                                    </button>
                                    <input
                                        required
                                        className={`flex-1 bg-muted/30 border rounded-xl px-4 font-medium outline-none transition-all ${formData.correctOption === idx ? "border-primary ring-1 ring-primary/20" : "border-border focus:border-primary"
                                            }`}
                                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                        value={option}
                                        onChange={e => {
                                            const newOptions = [...formData.options]
                                            newOptions[idx] = e.target.value
                                            setFormData({ ...formData, options: newOptions })
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Explanation (Optional)</label>
                        <textarea
                            className="w-full h-24 bg-muted/30 border border-border rounded-2xl p-4 font-medium outline-none focus:border-primary transition-all resize-none"
                            placeholder="Explain why the correct answer is correct..."
                            value={formData.explanation}
                            onChange={e => setFormData({ ...formData, explanation: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 font-bold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {loading ? "Saving..." : <><Save size={18} /> Save Question</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
