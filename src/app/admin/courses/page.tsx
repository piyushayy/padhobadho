"use client"

import Link from "next/link"
import { getCourses, deleteCourse } from "@/actions/courses"
import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Library } from "lucide-react"
import { toast } from "sonner"

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadCourses()
    }, [])

    async function loadCourses() {
        const { courses: data } = await getCourses()
        if (data) setCourses(data)
        setIsLoading(false)
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure? This will not delete subjects, but will remove the grouping.")) return
        const res = await deleteCourse(id)
        if (res.success) {
            toast.success("Course deleted")
            loadCourses()
        } else {
            toast.error(res.error)
        }
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-black">Manage Courses</h1>
                    <p className="text-muted-foreground">Group subjects into streams (e.g. Science, Commerce) or Degree Programs.</p>
                </div>
                <Link href="/admin/courses/new" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold flex items-center gap-2">
                    <Plus size={20} /> Create Course
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-card p-6 rounded-2xl border border-border hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <Library size={24} />
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/admin/courses/${course.id}`} className="p-2 hover:bg-muted rounded-lg transition-colors">
                                    <Edit size={18} />
                                </Link>
                                <button onClick={() => handleDelete(course.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{course.name}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description || "No description provided."}</p>

                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground border-t pt-4">
                            <span>{course._count.subjects} Subjects</span>
                            <span>{course._count.users} Students</span>
                        </div>
                    </div>
                ))}
            </div>

            {!isLoading && courses.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed rounded-2xl">
                    <p className="text-muted-foreground">No courses found. Create one to get started.</p>
                </div>
            )}
        </div>
    )
}
