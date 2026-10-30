"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Download, Trash2, RotateCcw, ShieldCheck, Mail, BookOpen } from "lucide-react"
import { deleteUser, resetUserProgress, exportStudentsCSV } from "@/actions/admin"
import { toast } from "sonner"

interface Student {
    id: string
    name: string | null
    email: string | null
    stream: string | null
    targetUniversity: string | null
    isPremium: boolean
    onboardingCompleted: boolean
    xp: number
    level: number
    createdAt: Date | string
    _count: {
        practiceSessions: number
        mockSessions: number
        questionHistory: number
    }
}

export default function StudentListClient({
    initialStudents,
}: {
    initialStudents: Student[]
}) {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState<"ALL" | "PREMIUM" | "ONBOARDED">("ALL")
    const [actionId, setActionId] = useState<string | null>(null)

    const filtered = initialStudents.filter((s) => {
        const matchesSearch =
            (s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
            (s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
            (s.stream?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

        if (filter === "PREMIUM") return matchesSearch && s.isPremium
        if (filter === "ONBOARDED") return matchesSearch && s.onboardingCompleted
        return matchesSearch
    })

    const handleReset = async (id: string, name: string | null) => {
        if (!confirm(`Are you sure you want to reset all progress for ${name || "this student"}?`)) return
        setActionId(id)
        try {
            await resetUserProgress(id)
            toast.success("Student progress reset")
            router.refresh()
        } catch (error: any) {
            toast.error(error?.message || "Failed to reset student progress")
        } finally {
            setActionId(null)
        }
    }

    const handleDelete = async (id: string, name: string | null) => {
        if (!confirm(`Are you sure you want to PERMANENTLY delete ${name || "this student"}? This cannot be undone.`)) return
        setActionId(id)
        try {
            await deleteUser(id)
            toast.success("Student deleted")
            router.refresh()
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete student")
        } finally {
            setActionId(null)
        }
    }

    const handleExport = async () => {
        try {
            const csv = await exportStudentsCSV()
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `students_${new Date().toISOString().slice(0, 10)}.csv`
            link.click()
            URL.revokeObjectURL(url)
            toast.success("CSV Export downloaded")
        } catch (error: any) {
            toast.error("Failed to export students")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, email or stream..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border bg-background text-sm font-medium outline-none focus:ring-2 ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="flex rounded-xl border bg-background p-1 text-xs font-bold">
                        <button
                            onClick={() => setFilter("ALL")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                filter === "ALL" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("ONBOARDED")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                filter === "ONBOARDED" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                            }`}
                        >
                            Onboarded
                        </button>
                        <button
                            onClick={() => setFilter("PREMIUM")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                filter === "PREMIUM" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                            }`}
                        >
                            Elite
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleExport}
                    className="h-11 px-5 rounded-xl border bg-card font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-muted transition-all"
                >
                    <Download size={16} /> Export CSV
                </button>
            </div>

            <div className="border rounded-2xl bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/40 border-b text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                            <tr>
                                <th className="p-4">Student</th>
                                <th className="p-4">Stream / Target</th>
                                <th className="p-4">Level / XP</th>
                                <th className="p-4">Questions Solved</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((s) => (
                                    <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-foreground">{s.name || "Anonymous"}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Mail size={12} /> {s.email}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-xs">{s.stream || "General"}</div>
                                            <div className="text-[11px] text-muted-foreground">
                                                {s.targetUniversity || "Any Central Univ"}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-black text-xs">Lvl {s.level}</div>
                                            <div className="text-[10px] text-muted-foreground font-bold">{s.xp} XP</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-xs">
                                                {s._count.questionHistory} questions
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">
                                                {s._count.mockSessions} mocks · {s._count.practiceSessions} drills
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                {s.isPremium && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                        Elite
                                                    </span>
                                                )}
                                                {s.onboardingCompleted ? (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-muted text-muted-foreground">
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    disabled={actionId === s.id}
                                                    onClick={() => handleReset(s.id, s.name)}
                                                    className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                                                    title="Reset Progress"
                                                >
                                                    <RotateCcw size={16} />
                                                </button>
                                                <button
                                                    disabled={actionId === s.id}
                                                    onClick={() => handleDelete(s.id, s.name)}
                                                    className="p-2 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors disabled:opacity-50"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
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
