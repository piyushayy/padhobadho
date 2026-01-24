"use client"

import { useState } from "react"
import { uploadResource, deleteResource } from "@/actions/admin"
import { toast } from "sonner"
import { FileText, Link as LinkIcon, Plus, Trash2, ExternalLink, Library } from "lucide-react"

interface Resource {
    id: string
    title: string
    type: string
    url: string
    subject: { name: string }
    topicId?: string | null
}

interface AdminResourcesClientProps {
    initialResources: Resource[]
    subjects: { id: string, name: string, topics: { id: string, name: string }[] }[]
}

export default function AdminResourcesClient({ initialResources, subjects }: AdminResourcesClientProps) {
    const [resources, setResources] = useState(initialResources)
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        title: "",
        type: "PDF",
        url: "",
        subjectId: subjects[0]?.id || "",
        topicId: ""
    })

    const selectedSubject = subjects.find(s => s.id === form.subjectId)
    const currentTopics = selectedSubject?.topics || []

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.type !== "application/pdf") {
            return toast.error("Only PDF files are supported currently.")
        }

        setLoading(true)
        const reader = new FileReader()
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string
            setForm({ ...form, url: dataUrl, title: form.title || file.name })
            setLoading(false)
            toast.success("PDF ready for upload!")
        }
        reader.readAsDataURL(file)
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.url) return toast.error("Please provide a URL or upload a file")

        setLoading(true)
        try {
            const newRes = await uploadResource({
                ...form,
                topicId: form.topicId || undefined
            })
            setResources([newRes as any, ...resources])
            setIsAdding(false)
            setForm({ ...form, title: "", url: "", topicId: "" })
            toast.success("Resource added successfully!")
        } catch (err) {
            toast.error("Failed to add resource")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return
        try {
            await deleteResource(id)
            setResources(resources.filter(r => r.id !== id))
            toast.success("Resource deleted")
        } catch (err) {
            toast.error("Failed to delete")
        }
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-black tracking-tight mb-2 text-foreground luxury-text">Resource Library</h1>
                    <p className="text-muted-foreground font-medium">Manage PDFs, links, and study materials for students.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="h-14 px-8 bg-primary text-white rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                    <Plus size={20} strokeWidth={3} />
                    {isAdding ? "Cancel" : "Add New Resource"}
                </button>
            </div>

            {isAdding && (
                <div className="brilliant-card bg-card p-10 border border-border shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                    <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Resource Title</label>
                            <input
                                required
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className="w-full h-14 bg-card border-2 border-border focus:border-primary rounded-2xl px-4 font-bold outline-none transition-all text-foreground"
                                placeholder="e.g. 2024 Kinetic Theory PDF"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asset Type</label>
                            <select
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full h-14 bg-card border-2 border-border focus:border-primary rounded-2xl px-4 font-bold outline-none transition-all text-foreground"
                            >
                                <option value="PDF">PDF Document</option>
                                <option value="LINK">External Link</option>
                                <option value="NOTES">Notes / Text</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subject</label>
                            <select
                                value={form.subjectId}
                                onChange={e => setForm({ ...form, subjectId: e.target.value, topicId: "" })}
                                className="w-full h-14 bg-card border-2 border-border focus:border-primary rounded-2xl px-4 font-bold outline-none transition-all text-foreground"
                            >
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Topic (Optional)</label>
                            <select
                                value={form.topicId}
                                onChange={e => setForm({ ...form, topicId: e.target.value })}
                                className="w-full h-14 bg-card border-2 border-border focus:border-primary rounded-2xl px-4 font-bold outline-none transition-all text-foreground"
                            >
                                <option value="">Select a topic</option>
                                {currentTopics.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        {form.type === "PDF" ? (
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Upload PDF File</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className={`w-full h-32 border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center gap-2 transition-all ${form.url ? "bg-primary/5 border-primary/40" : "bg-muted border-border group-hover:border-primary/40"}`}>
                                        <FileText className={form.url ? "text-primary" : "text-muted-foreground"} />
                                        <p className={`text-sm font-bold ${form.url ? "text-primary" : "text-muted-foreground"}`}>
                                            {form.url ? "PDF Loaded Successfully!" : "Drag & Drop or Click to Select PDF"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Resource URL / Link</label>
                                <input
                                    required
                                    value={form.url}
                                    onChange={e => setForm({ ...form, url: e.target.value })}
                                    className="w-full h-14 bg-card border-2 border-border focus:border-primary rounded-xl px-4 font-bold outline-none transition-all text-foreground"
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                        )}

                        <div className="md:col-span-2 pt-4">
                            <button
                                disabled={loading}
                                className="w-full h-16 bg-foreground text-background dark:text-foreground dark:bg-white rounded-2xl font-black text-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-xl shadow-foreground/10"
                            >
                                {loading ? "Processing..." : "Upload Resource"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="brilliant-card bg-card p-0 overflow-hidden border border-border/40 shadow-2xl">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left bg-muted/50 text-foreground">
                            <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-60">Subject</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-60">Resource Details</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-60 text-right w-32">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-foreground">
                        {resources.map((res) => (
                            <tr key={res.id} className="border-b last:border-none group hover:bg-muted/30 transition-colors">
                                <td className="p-8">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase">
                                        {res.subject.name}
                                    </span>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-muted rounded-xl text-foreground">
                                            {res.type === "PDF" ? <FileText size={20} /> : <LinkIcon size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-foreground">{res.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-primary font-bold">
                                                <ExternalLink size={12} />
                                                <a href={res.url} target="_blank" className="hover:underline truncate max-w-sm">{res.url.startsWith("data:") ? "Local File (Base64)" : res.url}</a>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8 text-right">
                                    <button
                                        onClick={() => handleDelete(res.id)}
                                        className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {resources.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <Library className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
                        <p className="font-bold text-muted-foreground italic">No study resources found. Start by adding one above.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
