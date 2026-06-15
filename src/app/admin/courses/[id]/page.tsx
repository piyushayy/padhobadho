"use client"

import { getCourse, updateCourse, addSubjectToCourse, removeSubjectFromCourse } from "@/actions/courses"
import { getSubjects } from "@/actions/subjects"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { Save, ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function EditCoursePage() {
    const params = useParams()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [course, setCourse] = useState<any>(null)
    const [allSubjects, setAllSubjects] = useState<any[]>([])

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        const [courseRes, subjectsRes] = await Promise.all([
            getCourse(params.id as string),
            getSubjects()
        ])

        if (courseRes.course) setCourse(courseRes.course)
        if (subjectsRes.subjects) setAllSubjects(subjectsRes.subjects)
        setIsLoading(false)
    }

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const res = await updateCourse(course.id, formData)

        if (res.success) {
            toast.success("Course updated")
            router.refresh()
        } else {
            toast.error(res.error)
        }
    }

    async function handleAddSubject(subjectId: string) {
        if (!subjectId) return
        const res = await addSubjectToCourse(course.id, subjectId)
        if (res.success) {
            toast.success("Subject added")
            loadData()
        } else {
            toast.error(res.error)
        }
    }

    async function handleRemoveSubject(subjectId: string) {
        const res = await removeSubjectFromCourse(course.id, subjectId)
        if (res.success) {
            toast.success("Subject removed")
            loadData()
        } else {
            toast.error(res.error)
        }
    }

    if (isLoading) return <div className="p-8">Loading...</div>
    if (!course) return <div className="p-8">Course not found</div>

    const availableSubjects = allSubjects.filter(s => !course.subjects.some((cs: any) => cs.id === s.id))

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <Link href="/admin/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold text-sm">
                <ArrowLeft size={16} /> Back to Courses
            </Link>

            <div>
                <h1 className="text-3xl font-serif font-black">Manage Course: {course.name}</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* DETAILS FORM */}
                <div className="space-y-6">
                    <h3 className="font-bold text-xl">Details</h3>
                    <form onSubmit={handleUpdate} className="space-y-6 bg-card p-6 rounded-2xl border">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest">Course Name</label>
                            <input
                                name="name"
                                defaultValue={course.name}
                                required
                                className="w-full p-3 bg-background border rounded-xl font-medium outline-none focus:ring-2 ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest">Description</label>
                            <textarea
                                name="description"
                                defaultValue={course.description}
                                className="w-full p-3 h-32 bg-background border rounded-xl font-medium outline-none focus:ring-2 ring-primary/20 resize-none"
                            />
                        </div>

                        <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90">
                            <Save size={18} /> Save Details
                        </button>
                    </form>
                </div>

                {/* SUBJECTS MAPPING */}
                <div className="space-y-6">
                    <h3 className="font-bold text-xl">Subjects ({course.subjects.length})</h3>
                    <div className="bg-card p-6 rounded-2xl border space-y-6">
                        <div className="flex gap-2">
                            <select
                                className="flex-1 p-3 bg-background border rounded-xl outline-none"
                                onChange={(e) => {
                                    if (e.target.value) handleAddSubject(e.target.value);
                                    e.target.value = "";
                                }}
                            >
                                <option value="">+ Add Subject to this Course</option>
                                {availableSubjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                            {course.subjects.length === 0 && <p className="text-muted-foreground text-sm">No subjects added yet.</p>}
                            {course.subjects.map((s: any) => (
                                <div key={s.id} className="flex items-center justify-between p-3 bg-background border rounded-xl">
                                    <span className="font-bold text-sm">{s.name}</span>
                                    <button onClick={() => handleRemoveSubject(s.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
