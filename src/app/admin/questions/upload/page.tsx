"use client"

import { useState, useTransition, useEffect } from "react"
import { MarkdownEditor } from "@/components/md-editor"
import { createQuestion, getSubjects } from "@/actions/questions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
// Simple SELECT component alternatives since shadcn select isn't fully installed
// Using native select for robustness

export default function UploadQuestionPage() {
    const [isPending, startTransition] = useTransition()
    const [subjects, setSubjects] = useState<any[]>([])
    const [selectedSubject, setSelectedSubject] = useState("")

    const [content, setContent] = useState("**Question text here**")
    const [explanation, setExplanation] = useState("")

    // Load initial data
    useEffect(() => {
        getSubjects().then(setSubjects)
    }, [])

    const activeTopics = subjects.find(s => s.id === selectedSubject)?.topics || []

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        // Append fields controlled by React State
        formData.set("content", content)
        formData.set("explanation", explanation)

        startTransition(async () => {
            const res = await createQuestion(formData)
            if (res.error) {
                toast.error(typeof res.error === "string" ? res.error : "Validation Error")
            } else {
                toast.success(res.success)
                // Reset form (simplified)
                setContent("")
                setExplanation("")
                // For full reset, reload or clear all fields. 
                // e.currentTarget.reset() // this works for native inputs but not controlled states well
            }
        })
    }

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Upload Question</h1>
                <p className="text-muted-foreground">Add new questions to the database using Markdown.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg bg-card">

                {/* Row 1: Taxonomy */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <select
                            name="subjectId"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            required
                        >
                            <option value="">Select Subject</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Topic</Label>
                        <select
                            name="topicId"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            required
                            disabled={!selectedSubject}
                        >
                            <option value="">Select Topic</option>
                            {activeTopics.map((t: any) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Difficulty</Label>
                        <select
                            name="difficulty"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            defaultValue="EASY"
                        >
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                        </select>
                    </div>
                </div>

                {/* Question Editor */}
                <div className="space-y-2">
                    <Label>Question Content (Markdown Supported)</Label>
                    <MarkdownEditor value={content} onChange={(v) => setContent(v || "")} height={200} />
                </div>

                {/* Options */}
                <div className="space-y-4">
                    <Label>Options & Correct Answer</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input
                                    type="radio"
                                    name="correctOption"
                                    value={i}
                                    required
                                    className="w-4 h-4 accent-primary"
                                />
                                <Input name={`option_${i}`} placeholder={`Option ${String.fromCharCode(65 + i)}`} required />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Explanation */}
                <div className="space-y-2">
                    <Label>Explanation (Optional)</Label>
                    <MarkdownEditor value={explanation} onChange={(v) => setExplanation(v || "")} height={150} />
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Uploading..." : "Save Question"}
                </Button>

            </form>
        </div>
    )
}
