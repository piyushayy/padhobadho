"use client"

import { useState } from "react"
import { createSubject, createTopic, deleteSubject, deleteTopic } from "@/actions/admin"
import { toast } from "sonner"
import { Layers, Plus, ChevronRight, MoreVertical, Trash2, X } from "lucide-react"

interface Topic {
    id: string
    name: string
}

interface Subject {
    id: string
    name: string
    description: string | null
    topics: Topic[]
    _count: { questions: number }
}

export default function SubjectListClient({ initialSubjects }: { initialSubjects: Subject[] }) {
    const [subjects, setSubjects] = useState(initialSubjects)
    const [isAddingSubject, setIsAddingSubject] = useState(false)
    const [newSubject, setNewSubject] = useState({ name: "", description: "" })

    const [activeSubjectForTopic, setActiveSubjectForTopic] = useState<string | null>(null)
    const [newTopicName, setNewTopicName] = useState("")

    const handleAddSubject = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await createSubject(newSubject)
            setSubjects([...subjects, { ...res, topics: [], _count: { questions: 0 } } as any])
            setIsAddingSubject(false)
            setNewSubject({ name: "", description: "" })
            toast.success("Subject added!")
        } catch (err) {
            toast.error("Failed to add subject")
        }
    }

    const handleDeleteSubject = async (id: string) => {
        if (!confirm("Delete subject? This will delete all associated topics and questions.")) return
        try {
            await deleteSubject(id)
            setSubjects(subjects.filter(s => s.id !== id))
            toast.success("Subject deleted")
        } catch (err) {
            toast.error("Failed to delete subject")
        }
    }

    const handleAddTopic = async (subjectId: string) => {
        if (!newTopicName.trim()) return
        try {
            const res = await createTopic({ name: newTopicName, subjectId })
            setSubjects(subjects.map(s =>
                s.id === subjectId ? { ...s, topics: [...s.topics, res] } : s
            ))
            setNewTopicName("")
            setActiveSubjectForTopic(null)
            toast.success("Topic added!")
        } catch (err) {
            toast.error("Failed to add topic")
        }
    }

    const handleDeleteTopic = async (subjectId: string, topicId: string) => {
        if (!confirm("Delete topic?")) return
        try {
            await deleteTopic(topicId)
            setSubjects(subjects.map(s =>
                s.id === subjectId ? { ...s, topics: s.topics.filter(t => t.id !== topicId) } : s
            ))
            toast.success("Topic deleted")
        } catch (err) {
            toast.error("Failed to delete topic")
        }
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-black mb-2 text-foreground luxury-text">Subjects & Topics</h1>
                    <p className="text-muted-foreground font-medium italic">Manage the hierarchy of academic subjects and their topics.</p>
                </div>
                <button
                    onClick={() => setIsAddingSubject(true)}
                    className="px-8 py-4 bg-foreground text-background dark:bg-white dark:text-black rounded-full font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all outline-none"
                >
                    <Plus className="w-5 h-5" /> Add Subject
                </button>
            </div>

            {isAddingSubject && (
                <div className="brilliant-card bg-card border-2 p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
                    <form onSubmit={handleAddSubject} className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-serif font-black">Add New Subject</h3>
                            <button type="button" onClick={() => setIsAddingSubject(false)}><X className="text-muted-foreground" /></button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subject Name</label>
                                <input
                                    required
                                    className="w-full h-14 bg-card border-2 border-border rounded-2xl px-4 font-bold outline-none focus:border-primary transition-all text-foreground"
                                    value={newSubject.name}
                                    onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                                    placeholder="e.g. Inorganic Chemistry"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
                                <input
                                    className="w-full h-14 bg-card border-2 border-border rounded-2xl px-4 font-bold outline-none focus:border-primary transition-all text-foreground"
                                    value={newSubject.description}
                                    onChange={e => setNewSubject({ ...newSubject, description: e.target.value })}
                                    placeholder="Brief overview..."
                                />
                            </div>
                        </div>
                        <button className="w-full h-16 bg-primary text-white rounded-2xl font-black text-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                            Save Subject
                        </button>
                    </form>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {subjects.length === 0 ? (
                    <div className="md:col-span-2 p-20 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-muted-foreground">
                        <Layers className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold">No subjects defined yet.</p>
                    </div>
                ) : (
                    subjects.map((subject) => (
                        <div key={subject.id} className="bg-card border p-10 rounded-[2.5rem] shadow-sm group transition-all hover:border-primary">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex-1">
                                    <h2 className="text-3xl font-serif font-black mb-1 text-foreground">{subject.name}</h2>
                                    <p className="text-sm text-muted-foreground font-medium leading-tight">{subject.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-2xl font-serif font-black tracking-tighter text-foreground">{subject._count.questions}</p>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Questions</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSubject(subject.id)}
                                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Core Topics</p>
                                <div className="grid gap-2">
                                    {subject.topics.map((topic) => (
                                        <div key={topic.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl hover:bg-muted transition-all cursor-pointer group/item">
                                            <span className="font-bold text-sm tracking-tight text-foreground">{topic.name}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteTopic(subject.id, topic.id)
                                                }}
                                                className="opacity-0 group-hover/item:opacity-100 p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    {activeSubjectForTopic === subject.id ? (
                                        <div className="flex gap-2 p-2 bg-muted/50 rounded-2xl animate-in slide-in-from-left-2">
                                            <input
                                                autoFocus
                                                className="flex-1 bg-transparent px-3 font-bold text-sm outline-none text-foreground"
                                                placeholder="Enter topic name..."
                                                value={newTopicName}
                                                onChange={e => setNewTopicName(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleAddTopic(subject.id)}
                                            />
                                            <button
                                                onClick={() => handleAddTopic(subject.id)}
                                                className="p-2 bg-primary text-background rounded-xl font-black text-xs"
                                            >
                                                Add
                                            </button>
                                            <button
                                                onClick={() => setActiveSubjectForTopic(null)}
                                                className="p-2 hover:bg-muted rounded-xl text-muted-foreground"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setActiveSubjectForTopic(subject.id)}
                                            className="flex items-center gap-2 p-4 border-2 border-dashed rounded-2xl text-xs font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all"
                                        >
                                            <Plus className="w-4 h-4" /> Add Topic
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
