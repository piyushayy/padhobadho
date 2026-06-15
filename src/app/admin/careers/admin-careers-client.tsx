"use client"

import { useState } from "react"
import { createJob, deleteJob } from "@/actions/careers"
import { toast } from "sonner"
import { Plus, Trash2, MapPin, Briefcase } from "lucide-react"

export default function AdminCareersPage({ jobs }: { jobs: any[] }) {
    const [isCreating, setIsCreating] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData(e.currentTarget)

        try {
            const res = await createJob(formData)
            if (res.error) toast.error(res.error)
            else {
                toast.success("Job posted!")
                setIsCreating(false)
            }
        } catch {
            toast.error("Failed to post job")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this job?")) return

        try {
            const res = await deleteJob(id)
            if (res.error) toast.error(res.error)
            else toast.success("Job deleted")
        } catch {
            toast.error("Failed to delete")
        }
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-black">Careers Management</h1>
                    <p className="text-muted-foreground">Post and manage job openings.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold flex items-center gap-2"
                >
                    <Plus size={18} /> Post Job
                </button>
            </div>

            {isCreating && (
                <div className="bg-card p-6 rounded-2xl border shadow-lg max-w-2xl animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-4">Post a New Role</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase">Job Title</label>
                                <input name="title" required className="w-full p-3 rounded-lg border bg-background" placeholder="e.g. Senior React Developer" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase">Department</label>
                                <input name="department" required className="w-full p-3 rounded-lg border bg-background" placeholder="e.g. Engineering" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase">Location</label>
                                <input name="location" required className="w-full p-3 rounded-lg border bg-background" placeholder="e.g. Remote / New Delhi" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase">Type</label>
                                <select name="type" className="w-full p-3 rounded-lg border bg-background">
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase">Description</label>
                            <textarea name="description" required rows={4} className="w-full p-3 rounded-lg border bg-background" placeholder="Job details..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase">Apply Link (Optional)</label>
                                <input name="applicationLink" className="w-full p-3 rounded-lg border bg-background" placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase">Contact Email (Optional)</label>
                                <input name="email" type="email" className="w-full p-3 rounded-lg border bg-background" placeholder="jobs@example.com" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-bold">Cancel</button>
                            <button disabled={isLoading} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold">
                                {isLoading ? "Posting..." : "Post Job"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {jobs?.map((job) => (
                    <div key={job.id} className="p-6 rounded-2xl border bg-card flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold">{job.title}</h3>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1"><Briefcase size={14} /> {job.department}</span>
                                <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold uppercase bg-muted px-2 py-1 rounded">{job.type}</span>
                            <button onClick={() => handleDelete(job.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {(!jobs || jobs.length === 0) && (
                    <div className="text-center py-12 text-muted-foreground">No active job listings.</div>
                )}
            </div>
        </div>
    )
}
