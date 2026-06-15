"use client"

import { createCourse } from "@/actions/courses"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NewCoursePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = await createCourse(formData)

        if (res.success) {
            toast.success("Course created")
            router.push("/admin/courses")
        } else {
            toast.error(res.error)
        }
        setIsLoading(false)
    }

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <Link href="/admin/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold text-sm">
                <ArrowLeft size={16} /> Back to Courses
            </Link>

            <div>
                <h1 className="text-3xl font-serif font-black">Create New Course</h1>
                <p className="text-muted-foreground">Define a new stream or degree program.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest">Course Name</label>
                    <input
                        name="name"
                        required
                        placeholder="e.g. Science (PCM), B.A. Hons English"
                        className="w-full p-4 bg-background border rounded-xl font-medium outline-none focus:ring-2 ring-primary/20 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest">Description</label>
                    <textarea
                        name="description"
                        placeholder="Brief description of the course..."
                        className="w-full p-4 h-32 bg-background border rounded-xl font-medium outline-none focus:ring-2 ring-primary/20 transition-all resize-none"
                    />
                </div>

                <button disabled={isLoading} className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90">
                    <Save size={20} /> Create Course
                </button>
            </form>
        </div>
    )
}
