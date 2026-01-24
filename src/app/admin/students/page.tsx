import { prisma } from "@/lib/prisma"
import { Users, GraduationCap, Target, BarChart3, MoreVertical } from "lucide-react"

import StudentListClient from "./student-list-client"

export default async function AdminStudentsPage() {
    const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        include: {
            _count: {
                select: {
                    practiceSessions: true,
                    mockSessions: true,
                    questionHistory: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    })

    const stats = {
        total: students.length,
        onboarded: students.filter(s => s.onboardingCompleted).length,
        premium: students.filter(s => s.isPremium).length,
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-black tracking-tight mb-2 text-foreground luxury-text">Student Directory</h1>
                    <p className="text-muted-foreground font-medium">Manage and monitor student engagement across the platform.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="brilliant-card bg-card p-6 flex items-center gap-6 border">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Students</p>
                        <h4 className="text-2xl font-black text-foreground">{stats.total}</h4>
                    </div>
                </div>
                <div className="brilliant-card bg-card p-6 flex items-center gap-6 border">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Onboarded</p>
                        <h4 className="text-2xl font-black text-foreground">{stats.onboarded}</h4>
                    </div>
                </div>
                <div className="brilliant-card bg-card p-6 flex items-center gap-6 border">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Elite Members</p>
                        <h4 className="text-2xl font-black text-foreground">{stats.premium}</h4>
                    </div>
                </div>
            </div>

            <StudentListClient initialStudents={students as any} />
        </div>
    )
}
