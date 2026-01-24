"use client"

import { useState } from "react"
import { deleteUser } from "@/actions/admin"
import { toast } from "sonner"
import { Target, Trash2, Search, X } from "lucide-react"

interface Student {
    id: string
    name: string | null
    email: string | null
    stream: string | null
    targetUniversity: string | null
    isPremium: boolean
    _count: {
        questionHistory: number
    }
}

export default function StudentListClient({ initialStudents }: { initialStudents: Student[] }) {
    const [students, setStudents] = useState(initialStudents)
    const [search, setSearch] = useState("")

    const filtered = students.filter(s =>
    (s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.targetUniversity?.toLowerCase().includes(search.toLowerCase()))
    )

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this student? All their progress will be lost forever.")) return
        try {
            await deleteUser(id)
            setStudents(students.filter(s => s.id !== id))
            toast.success("Student deleted")
        } catch (err) {
            toast.error("Failed to delete student")
        }
    }

    return (
        <div className="space-y-10">
            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search students by name, email or university..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-14 bg-card border-2 border-border focus:border-primary rounded-2xl pl-12 pr-4 font-bold outline-none transition-all text-foreground"
                />
            </div>

            {/* Students Table */}
            <div className="brilliant-card bg-card p-0 overflow-hidden border shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Student</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Stream & Goal</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Activity</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-foreground">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic">No students found matching your search.</td>
                                </tr>
                            ) : (
                                filtered.map((student) => (
                                    <tr key={student.id} className="hover:bg-muted/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center font-bold text-muted-foreground border border-border">
                                                    {student.name?.[0] || student.email?.[0]?.toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-foreground">{student.name || "Anonymous User"}</p>
                                                    <p className="text-[10px] font-medium text-muted-foreground">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${student.stream === "SCIENCE" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                                                        student.stream === "COMMERCE" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                                            "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                                                        }`}>
                                                        {student.stream || "NOT SET"}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                                    <Target size={12} className="shrink-0" /> {student.targetUniversity || "No Target Uni"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <p className="text-lg font-black leading-none text-foreground">{student._count.questionHistory}</p>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Solves</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                {student.isPremium ? (
                                                    <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20">Premium</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-widest border border-border">Free</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
