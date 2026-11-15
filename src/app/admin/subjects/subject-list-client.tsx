"use client"

import { useState } from "react"
import { Layers, Plus, Trash2, ChevronDown, ChevronRight, BookOpen, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { createSubject, deleteSubject, createTopic, deleteTopic } from "@/actions/admin"

interface SubjectListClientProps {
    initialSubjects: any[]
    courses: any[]
}

export default function SubjectListClient({ initialSubjects, courses }: SubjectListClientProps) {
    const [subjects, setSubjects] = useState(initialSubjects)
    const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({})

    // Create Subject state
    const [isCreatingSubject, setIsCreatingSubject] = useState(false)
    const [newSubjectName, setNewSubjectName] = useState("")
    const [newSubjectDescription, setNewSubjectDescription] = useState("")
    const [isSubmittingSubject, setIsSubmittingSubject] = useState(false)

    // Add Topic state
    const [activeSubjectForTopic, setActiveSubjectForTopic] = useState<string | null>(null)
    const [newTopicName, setNewTopicName] = useState("")
    const [isSubmittingTopic, setIsSubmittingTopic] = useState(false)

    const toggleExpand = (id: string) => {
        setExpandedSubjects((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    const handleCreateSubject = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSubjectName.trim()) return
        setIsSubmittingSubject(true)
        try {
            await createSubject({
                name: newSubjectName.trim(),
                description: newSubjectDescription.trim() || undefined,
            })
            toast.success("Subject created!")
            setNewSubjectName("")
            setNewSubjectDescription("")
            setIsCreatingSubject(false)
            window.location.reload()
        } catch (err: any) {
            toast.error(err?.message || "Failed to create subject")
        } finally {
            setIsSubmittingSubject(false)
        }
    }

    const handleDeleteSubject = async (id: string, name: string) => {
        if (!confirm(`Delete subject "${name}"? This removes all topics inside it.`)) return
        try {
            await deleteSubject(id)
            setSubjects((prev) => prev.filter((s) => s.id !== id))
            toast.success("Subject deleted")
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete subject")
        }
    }

    const handleCreateTopic = async (subjectId: string) => {
        if (!newTopicName.trim()) return
        setIsSubmittingTopic(true)
        try {
            await createTopic({
                name: newTopicName.trim(),
                subjectId,
            })
            toast.success("Topic added!")
            setNewTopicName("")
            setActiveSubjectForTopic(null)
            window.location.reload()
        } catch (err: any) {
            toast.error(err?.message || "Failed to create topic")
        } finally {
            setIsSubmittingTopic(false)
        }
    }

    const handleDeleteTopic = async (topicId: string, topicName: string) => {
        if (!confirm(`Delete topic "${topicName}"?`)) return
        try {
            await deleteTopic(topicId)
            toast.success("Topic deleted")
            window.location.reload()
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete topic")
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-black tracking-tight text-foreground">Subjects & Topics</h1>
                    <p className="text-muted-foreground font-medium">Manage academic taxonomy and syllabus structure.</p>
                </div>

                <Button
                    onClick={() => setIsCreatingSubject(!isCreatingSubject)}
                    className="h-11 gap-2 rounded-xl bg-primary text-primary-foreground shrink-0"
                >
                    <Plus className="w-4 h-4" /> Add New Subject
                </Button>
            </div>

            {/* Create Subject Card */}
            {isCreatingSubject && (
                <form onSubmit={handleCreateSubject} className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground">Create Subject</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Subject Name (e.g. Physics, Economics, General Test)"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                            required
                            className="h-11 rounded-xl"
                        />
                        <Input
                            placeholder="Description (Optional)"
                            value={newSubjectDescription}
                            onChange={(e) => setNewSubjectDescription(e.target.value)}
                            className="h-11 rounded-xl"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsCreatingSubject(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmittingSubject} className="rounded-xl">
                            {isSubmittingSubject ? "Saving..." : "Save Subject"}
                        </Button>
                    </div>
                </form>
            )}

            {/* Subjects List */}
            <div className="space-y-4">
                {subjects.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground text-sm">
                        No subjects yet. Click "Add New Subject" to begin.
                    </div>
                ) : (
                    subjects.map((subject) => {
                        const isExpanded = !!expandedSubjects[subject.id]
                        const questionCount = subject._count?.questions || 0
                        const topics = subject.topics || []

                        return (
                            <div key={subject.id} className="bg-card border border-border rounded-2xl overflow-hidden transition-all">
                                <div className="p-5 flex items-center justify-between gap-4">
                                    <button
                                        onClick={() => toggleExpand(subject.id)}
                                        className="flex items-center gap-3 text-left flex-1 hover:opacity-80 transition-opacity"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground text-lg">{subject.name}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {topics.length} Topics · {questionCount} Questions
                                            </p>
                                        </div>
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setActiveSubjectForTopic(activeSubjectForTopic === subject.id ? null : subject.id)}
                                            className="rounded-xl text-xs gap-1.5 h-9"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add Topic
                                        </Button>

                                        <button
                                            onClick={() => handleDeleteSubject(subject.id, subject.name)}
                                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                                            title="Delete Subject"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Add Topic inline input */}
                                {activeSubjectForTopic === subject.id && (
                                    <div className="px-5 pb-4 pt-2 border-t border-border/40 flex items-center gap-3 bg-muted/20">
                                        <Input
                                            placeholder="Topic Name (e.g., Electrostatics, Microeconomics)"
                                            value={newTopicName}
                                            onChange={(e) => setNewTopicName(e.target.value)}
                                            className="h-10 rounded-xl flex-1 text-sm"
                                        />
                                        <Button
                                            size="sm"
                                            disabled={isSubmittingTopic}
                                            onClick={() => handleCreateTopic(subject.id)}
                                            className="rounded-xl h-10 px-4"
                                        >
                                            {isSubmittingTopic ? "Adding..." : "Add"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setActiveSubjectForTopic(null)
                                                setNewTopicName("")
                                            }}
                                            className="h-10"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}

                                {/* Topics accordion content */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 pt-2 border-t border-border/40 bg-muted/10">
                                        {topics.length === 0 ? (
                                            <p className="text-xs text-muted-foreground py-2">No topics in this subject yet.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
                                                {topics.map((t: any) => (
                                                    <div
                                                        key={t.id}
                                                        className="flex items-center justify-between p-3 rounded-xl bg-background border border-border text-sm"
                                                    >
                                                        <div className="flex items-center gap-2 truncate">
                                                            <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                            <span className="font-medium truncate text-foreground">{t.name}</span>
                                                        </div>

                                                        <button
                                                            onClick={() => handleDeleteTopic(t.id, t.name)}
                                                            className="text-muted-foreground hover:text-rose-500 p-1 rounded transition-colors shrink-0"
                                                            title="Delete Topic"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
