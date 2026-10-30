"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Layers, BookOpen, Download, ChevronDown, ChevronRight } from "lucide-react"
import { createSubject, deleteSubject, createTopic, deleteTopic, exportSubjectPopularityCSV } from "@/actions/admin"
import { toast } from "sonner"

interface Topic {
    id: string
    name: string
}

interface Subject {
    id: string
    name: string
    description?: string | null
    topics: Topic[]
    _count: { questions: number }
}

interface Course {
    id: string
    name: string
}

export default function SubjectListClient({
    initialSubjects,
    courses,
}: {
    initialSubjects: Subject[]
    courses: Course[]
}) {
    const router = useRouter()
    const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({})
    const [newSubjectName, setNewSubjectName] = useState("")
    const [newSubjectDesc, setNewSubjectDesc] = useState("")
    const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([])
    const [newTopicSubjectId, setNewTopicSubjectId] = useState<string | null>(null)
    const [newTopicName, setNewTopicName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const toggleSubject = (id: string) => {
        setExpandedSubjects((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    const handleCreateSubject = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSubjectName.trim()) return
        setIsSubmitting(true)
        try {
            await createSubject({
                name: newSubjectName.trim(),
                description: newSubjectDesc.trim() || undefined,
                courseIds: selectedCourseIds.length > 0 ? selectedCourseIds : undefined,
            })
            toast.success("Subject created")
            setNewSubjectName("")
            setNewSubjectDesc("")
            setSelectedCourseIds([])
            router.refresh()
        } catch (error: any) {
            toast.error(error?.message || "Failed to create subject")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteSubject = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete subject "${name}" and all its questions?`)) return
        setIsSubmitting(true)
        try {
            await deleteSubject(id)
            toast.success("Subject deleted")
            router.refresh()
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete subject")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCreateTopic = async (subjectId: string) => {
        if (!newTopicName.trim()) return
        setIsSubmitting(true)
        try {
            await createTopic({
                subjectId,
                name: newTopicName.trim(),
            })
            toast.success("Topic added")
            setNewTopicName("")
            setNewTopicSubjectId(null)
            router.refresh()
        } catch (error: any) {
            toast.error(error?.message || "Failed to create topic")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteTopic = async (topicId: string, name: string) => {
        if (!confirm(`Are you sure you want to delete topic "${name}"?`)) return
        setIsSubmitting(true)
        try {
            await deleteTopic(topicId)
            toast.success("Topic deleted")
            router.refresh()
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete topic")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleExport = async () => {
        try {
            const csv = await exportSubjectPopularityCSV()
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `subjects_${new Date().toISOString().slice(0, 10)}.csv`
            link.click()
            URL.revokeObjectURL(url)
            toast.success("CSV Export downloaded")
        } catch (error: any) {
            toast.error("Failed to export subjects")
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-black tracking-tight mb-2 text-foreground">
                        Subjects & Syllabus
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Configure syllabus hierarchy, subjects, and specific topics.
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    className="h-11 px-5 rounded-xl border bg-card font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-muted transition-all self-start sm:self-auto"
                >
                    <Download size={16} /> Export Popularity CSV
                </button>
            </div>

            {/* Create Subject Box */}
            <form onSubmit={handleCreateSubject} className="p-6 rounded-2xl border bg-card space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Plus size={20} className="text-primary" /> Create New Subject
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Subject Name (e.g., Mathematics, General Test)"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        required
                        className="h-12 px-4 rounded-xl border bg-background text-sm font-medium outline-none focus:ring-2 ring-primary/20 transition-all"
                    />
                    <input
                        type="text"
                        placeholder="Description (Optional)"
                        value={newSubjectDesc}
                        onChange={(e) => setNewSubjectDesc(e.target.value)}
                        className="h-12 px-4 rounded-xl border bg-background text-sm font-medium outline-none focus:ring-2 ring-primary/20 transition-all"
                    />
                </div>
                {courses.length > 0 && (
                    <div>
                        <label className="text-xs font-bold uppercase text-muted-foreground block mb-2">
                            Attach to Courses (Optional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {courses.map((course) => {
                                const selected = selectedCourseIds.includes(course.id)
                                return (
                                    <button
                                        key={course.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCourseIds((prev) =>
                                                selected ? prev.filter((id) => id !== course.id) : [...prev, course.id]
                                            )
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                            selected
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-muted/40 text-muted-foreground hover:bg-muted"
                                        }`}
                                    >
                                        {course.name}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
                <button
                    disabled={isSubmitting || !newSubjectName.trim()}
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    Add Subject
                </button>
            </form>

            {/* Subject List */}
            <div className="space-y-4">
                {initialSubjects.map((subject) => {
                    const isExpanded = expandedSubjects[subject.id] ?? true
                    return (
                        <div key={subject.id} className="border rounded-2xl bg-card overflow-hidden">
                            <div className="p-5 flex items-center justify-between gap-4 bg-card hover:bg-muted/10 transition-colors">
                                <button
                                    onClick={() => toggleSubject(subject.id)}
                                    className="flex items-center gap-3 text-left flex-1"
                                >
                                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    <div>
                                        <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                                            {subject.name}
                                            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-muted text-muted-foreground">
                                                {subject._count.questions} questions
                                            </span>
                                        </h4>
                                        {subject.description && (
                                            <p className="text-xs text-muted-foreground mt-0.5">{subject.description}</p>
                                        )}
                                    </div>
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setNewTopicSubjectId(subject.id)}
                                        className="px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-muted"
                                    >
                                        <Plus size={14} /> Add Topic
                                    </button>
                                    <button
                                        disabled={isSubmitting}
                                        onClick={() => handleDeleteSubject(subject.id, subject.name)}
                                        className="p-2 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors disabled:opacity-50"
                                        title="Delete Subject"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Add Topic Inline Input */}
                            {newTopicSubjectId === subject.id && (
                                <div className="p-4 bg-muted/30 border-t flex items-center gap-3">
                                    <input
                                        type="text"
                                        placeholder="Topic Name (e.g., Trigonometry, Chemical Bonding)"
                                        value={newTopicName}
                                        onChange={(e) => setNewTopicName(e.target.value)}
                                        className="h-10 px-4 rounded-lg border bg-background text-sm flex-1 font-medium outline-none"
                                        autoFocus
                                    />
                                    <button
                                        disabled={isSubmitting || !newTopicName.trim()}
                                        onClick={() => handleCreateTopic(subject.id)}
                                        className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
                                    >
                                        Save Topic
                                    </button>
                                    <button
                                        onClick={() => {
                                            setNewTopicSubjectId(null)
                                            setNewTopicName("")
                                        }}
                                        className="h-10 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider hover:bg-muted"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {/* Topic List */}
                            {isExpanded && (
                                <div className="p-5 pt-0 border-t divide-y divide-border/40">
                                    {subject.topics.length === 0 ? (
                                        <div className="py-4 text-xs text-muted-foreground italic">
                                            No topics added yet. Click &quot;Add Topic&quot; above to organize this subject.
                                        </div>
                                    ) : (
                                        subject.topics.map((topic) => (
                                            <div
                                                key={topic.id}
                                                className="py-3 flex items-center justify-between gap-4 text-sm font-medium"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                                                    <span>{topic.name}</span>
                                                </div>
                                                <button
                                                    disabled={isSubmitting}
                                                    onClick={() => handleDeleteTopic(topic.id, topic.name)}
                                                    className="p-1.5 rounded-md text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                                                    title="Delete Topic"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
