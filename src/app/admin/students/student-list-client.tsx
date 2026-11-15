"use client"

import { useState } from "react"
import { Search, Download, Trash2, RotateCcw, User, Flame, Trophy, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { deleteUser, resetUserProgress, exportStudentsCSV } from "@/actions/admin"

interface StudentListClientProps {
    initialStudents: any[]
}

export default function StudentListClient({ initialStudents }: StudentListClientProps) {
    const [students, setStudents] = useState(initialStudents)
    const [searchTerm, setSearchTerm] = useState("")
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const filtered = students.filter((s) => {
        const query = searchTerm.toLowerCase()
        return (
            (s.name && s.name.toLowerCase().includes(query)) ||
            (s.email && s.email.toLowerCase().includes(query)) ||
            (s.targetUniversity && s.targetUniversity.toLowerCase().includes(query)) ||
            (s.targetCourse && s.targetCourse.toLowerCase().includes(query))
        )
    })

    const handleExportCSV = async () => {
        try {
            const csv = await exportStudentsCSV()
            const blob = new Blob([csv], { type: "text/csv" })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `students_export_${new Date().toISOString().split("T")[0]}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            toast.success("Student directory exported!")
        } catch {
            toast.error("Failed to export students")
        }
    }

    const handleReset = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to reset all test progress for ${name || "this student"}?`)) return
        setLoadingId(id)
        try {
            await resetUserProgress(id)
            toast.success("Progress reset successfully")
        } catch (err: any) {
            toast.error(err?.message || "Failed to reset progress")
        } finally {
            setLoadingId(null)
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete student account for ${name || "this user"}? This cannot be undone.`)) return
        setLoadingId(id)
        try {
            await deleteUser(id)
            setStudents((prev) => prev.filter((s) => s.id !== id))
            toast.success("Student removed")
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete student")
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search student by name, email, university..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 bg-card border-border rounded-xl"
                    />
                </div>

                <Button onClick={handleExportCSV} variant="outline" className="h-11 gap-2 rounded-xl border-border shrink-0">
                    <Download className="w-4 h-4" /> Export CSV
                </Button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border/60">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-sm">
                        No students match your search criteria.
                    </div>
                ) : (
                    filtered.map((student) => {
                        const practiceCount = student._count?.practiceSessions || 0
                        const mockCount = student._count?.mockSessions || 0

                        return (
                            <div key={student.id} className="p-6 hover:bg-muted/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-base">
                                        {student.name ? student.name.slice(0, 2).toUpperCase() : "ST"}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-foreground">{student.name || "Unnamed Student"}</h4>
                                            {student.targetUniversity && (
                                                <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                                                    {student.targetUniversity}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground font-mono">{student.email || "No email"}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5" title="Current streak">
                                        <Flame className="w-4 h-4 text-amber-500" />
                                        <span className="font-bold text-foreground">{student.currentStreak || 0}</span> days
                                    </div>

                                    <div className="flex items-center gap-1.5" title="Level / XP">
                                        <Trophy className="w-4 h-4 text-primary" />
                                        <span>Lvl <strong className="text-foreground">{student.level || 1}</strong> ({student.xp || 0} XP)</span>
                                    </div>

                                    <div className="px-3 py-1 rounded-lg bg-muted text-foreground font-medium">
                                        {practiceCount} Practice · {mockCount} Mocks
                                    </div>

                                    <div className="flex items-center gap-1 ml-auto">
                                        <button
                                            onClick={() => handleReset(student.id, student.name)}
                                            disabled={loadingId === student.id}
                                            className="p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                                            title="Reset test progress"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student.id, student.name)}
                                            disabled={loadingId === student.id}
                                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                                            title="Delete student account"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
