"use client"

import { useState } from "react"
import { updateUserCourse } from "@/actions/user-course"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { BookOpen, CheckCircle2 } from "lucide-react"

export default function CourseSelector({ courses }: { courses: any[] }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleSelect(courseId: string) {
        setIsLoading(true)
        const res = await updateUserCourse(courseId)
        if (res.success) {
            toast.success("Course selected successfully!")
            router.refresh()
        } else {
            toast.error(res.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tight">Select your Goal</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Which course or stream are you preparing for?</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {courses.map(course => (
                    <button
                        key={course.id}
                        disabled={isLoading}
                        onClick={() => handleSelect(course.id)}
                        className="group relative bg-card hover:border-primary border-2 border-border p-8 rounded-[2rem] text-left transition-all hover:shadow-2xl hover:shadow-primary/5 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                            <BookOpen strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{course.name}</h3>
                        <p className="text-muted-foreground font-medium mb-6 line-clamp-2">{course.description || "Comprehensive preparation for this course."}</p>

                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                            Select Goal <CheckCircle2 size={16} />
                        </div>
                    </button>
                ))}
            </div>
            {courses.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No courses defined by admin yet.</p>
                </div>
            )}
        </div>
    )
}
