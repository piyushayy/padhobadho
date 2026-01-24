"use client"

import { Download, TrendingUp, Users, DollarSign, Activity, FileDown, Zap, Sparkles, Trophy, Library } from "lucide-react"
import { exportStudentsCSV, initAchievements, initExams, exportSubjectPopularityCSV, exportAccuracyAnalyticsCSV } from "@/actions/admin"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { useState } from "react"

interface GrowthData {
    date: string
    count: number
}

interface AdminDashboardClientProps {
    stats: {
        growth: GrowthData[]
        revenue: number
        engagement: number
        userCount: number
        questionCount: number
    }
}

export default function AdminDashboardClient({ stats }: AdminDashboardClientProps) {
    const [isInitializing, setIsInitializing] = useState(false)

    async function handleExport() {
        try {
            const csv = await exportStudentsCSV()
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.setAttribute('hidden', '')
            a.setAttribute('href', url)
            a.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            toast.success("Student data exported successfully")
        } catch (err) {
            toast.error("Failed to export data")
        }
    }

    async function handleInitAchievements() {
        setIsInitializing(true)
        try {
            await initAchievements()
            toast.success("Standard achievements initialized!")
        } catch (err) {
            toast.error("Failed to initialize achievements")
        } finally {
            setIsInitializing(false)
        }
    }

    async function handleReportExport(type: 'subject' | 'accuracy') {
        try {
            const csv = type === 'subject' ? await exportSubjectPopularityCSV() : await exportAccuracyAnalyticsCSV()
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.setAttribute('hidden', '')
            a.setAttribute('href', url)
            a.setAttribute('download', `${type}_report_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            toast.success("Report downloaded successfully")
        } catch (err) {
            toast.error("Failed to generate report")
        }
    }

    const maxGrowth = Math.max(...stats.growth.map(d => d.count), 1)

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-black tracking-tight mb-2 text-foreground luxury-text">Admin Dashboard</h1>
                    <p className="text-muted-foreground font-medium text-lg">Monitor platform performance and student growth.</p>
                </div>
                <button
                    onClick={handleExport}
                    className="h-14 px-8 bg-foreground text-background dark:bg-white dark:text-black rounded-2xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                    <Download size={20} strokeWidth={3} />
                    Export Students
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="brilliant-card bg-card p-10 space-y-4 shadow-sm border-emerald-500/10 hover:border-emerald-500/30">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Revenue (Est.)</p>
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <h2 className="text-5xl font-serif font-black text-foreground">₹{stats.revenue.toLocaleString()}</h2>
                    <p className="text-xs font-bold text-muted-foreground opacity-80">Based on Elite upgrades (₹499)</p>
                </div>

                <div className="brilliant-card bg-card p-10 space-y-4 shadow-sm border-primary/10 hover:border-primary/30">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Engagement</p>
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Activity size={20} />
                        </div>
                    </div>
                    <h2 className="text-5xl font-serif font-black text-foreground">{stats.engagement.toLocaleString()}</h2>
                    <p className="text-xs font-bold text-muted-foreground opacity-80">Questions solved (7d)</p>
                </div>

                <div className="brilliant-card bg-card p-10 space-y-4 shadow-sm border-zinc-500/10 hover:border-zinc-500/30">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Students</p>
                        <div className="p-2 bg-zinc-500/10 text-zinc-500 rounded-lg">
                            <Users size={20} />
                        </div>
                    </div>
                    <h2 className="text-5xl font-serif font-black text-foreground">{stats.userCount}</h2>
                    <p className="text-xs font-bold text-muted-foreground opacity-80">Registered aspirants</p>
                </div>
            </div>

            {/* Growth Graph & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="brilliant-card bg-card p-10 border space-y-8 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-serif font-black text-foreground">Growth Trend</h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            <TrendingUp size={14} /> Last 7 Days
                        </div>
                    </div>

                    <div className="h-64 flex items-end gap-3 pt-4">
                        {stats.growth.map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className="relative w-full flex flex-col items-center group">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(day.count / maxGrowth) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                                        className="w-full bg-slate-100 dark:bg-white/10 rounded-xl group-hover:bg-primary transition-colors relative"
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {day.count}
                                        </div>
                                    </motion.div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-4">
                                        {day.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <h3 className="text-2xl font-serif font-black text-foreground">Quick Reports</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => handleReportExport('subject')}
                            className="brilliant-card bg-card p-6 border text-left flex items-center justify-between group hover:border-primary transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                                    <FileDown size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">Subject Popularity Report</p>
                                    <p className="text-xs text-muted-foreground font-medium">Download distribution of student interests</p>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => handleReportExport('accuracy')}
                            className="brilliant-card bg-card p-6 border text-left flex items-center justify-between group hover:border-primary transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">Accuracy Analytics</p>
                                    <p className="text-xs text-muted-foreground font-medium">Global accuracy trends across departments</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={handleInitAchievements}
                            disabled={isInitializing}
                            className="brilliant-card bg-card p-6 border text-left flex items-center justify-between group hover:border-primary transition-all disabled:opacity-50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">Initialize Achievements</p>
                                    <p className="text-xs text-muted-foreground font-medium">Populate the platform with standard achievement badges.</p>
                                </div>
                            </div>
                            {isInitializing && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles className="w-4 h-4 text-primary" /></motion.div>}
                        </button>

                        <button
                            onClick={async () => {
                                setIsInitializing(true)
                                try {
                                    await initExams()
                                    toast.success("Exam categories initialized!")
                                } catch (err) {
                                    toast.error("Failed to initialize exams")
                                } finally {
                                    setIsInitializing(false)
                                }
                            }}
                            disabled={isInitializing}
                            className="brilliant-card bg-card p-6 border text-left flex items-center justify-between group hover:border-primary transition-all disabled:opacity-50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                                    <Library size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">Initialize Exam Library</p>
                                    <p className="text-xs text-muted-foreground font-medium">Setup standard exam categories like CAT, GATE, and NDA.</p>
                                </div>
                            </div>
                            {isInitializing && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles className="w-4 h-4 text-primary" /></motion.div>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
