"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Mail, Shield, Palette,
    Bell, ChevronLeft, Save, LogOut,
    Trash2, RefreshCw, GraduationCap,
    Target, Zap, Flame, Loader2, Sparkles,
    Lock, Smartphone, Layout
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { updateProfile, resetProgress } from "@/actions/profile"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

interface SettingsProps {
    user: {
        name: string | null
        email: string | null
        stream: string | null
        targetUniversity: string | null
        targetCourse: string | null
        dailyGoal: number
        level: number
        xp: number
        currentStreak: number
    }
}

export default function SettingsClient({ user }: SettingsProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("general")
    const [isSaving, setIsSaving] = useState(false)
    const [isResetting, setIsResetting] = useState(false)

    const [formData, setFormData] = useState({
        name: user.name || "",
        stream: user.stream || "",
        targetUniversity: user.targetUniversity || "",
        targetCourse: user.targetCourse || "",
        dailyGoal: user.dailyGoal
    })

    async function handleSave() {
        setIsSaving(true)
        try {
            await updateProfile(formData)
            toast.success("Settings updated successfully")
        } catch (err) {
            toast.error("Failed to update settings")
        } finally {
            setIsSaving(false)
        }
    }

    async function handleReset() {
        if (!confirm("Are you sure? This will delete all your practice history and XP.")) return

        setIsResetting(true)
        try {
            await resetProgress()
            toast.success("Progress reset successfully")
            router.refresh()
        } catch (err) {
            toast.error("Failed to reset progress")
        } finally {
            setIsResetting(false)
        }
    }

    const tabs = [
        { id: "general", label: "General", icon: User },
        { id: "academic", label: "Academic Focus", icon: GraduationCap },
        { id: "preferences", label: "Preferences", icon: Palette },
        { id: "security", label: "Security", icon: Shield },
    ]

    return (
        <div className="max-w-5xl mx-auto pb-24 px-6 md:px-0">
            {/* Header */}
            <div className="mb-12 space-y-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest w-fit">
                    <ChevronLeft size={16} strokeWidth={3} /> Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight leading-tight">Settings</h1>
                        <p className="text-muted-foreground font-medium text-lg mt-2">Manage your account and preferences.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-14 px-8 bg-primary text-background rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-2 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap ${activeTab === tab.id
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                }`}
                        >
                            <tab.icon size={18} strokeWidth={2.5} />
                            {tab.label}
                        </button>
                    ))}

                    <div className="hidden lg:block pt-8 mt-8 border-t border-border">
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-2xl border border-primary/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Your Status</p>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-background rounded-lg text-primary shadow-sm">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="font-black text-lg leading-none">Level {user.level}</p>
                                    <p className="text-xs font-bold text-muted-foreground">{user.xp} XP</p>
                                </div>
                            </div>
                            <div className="h-1.5 bg-background rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${(user.xp % 1000) / 10}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm min-h-[500px]"
                        >
                            {activeTab === "general" && (
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        <User className="text-primary" /> General Information
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-4xl font-serif font-black mx-auto md:mx-0 border-4 border-background shadow-xl">
                                                {user.name?.[0] || "S"}
                                            </div>
                                            <div className="flex gap-3 justify-center md:justify-start">
                                                <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors">Change Avatar</button>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                    className="w-full p-4 bg-muted/30 border border-transparent focus:border-primary rounded-xl font-bold outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                                                <div className="w-full p-4 bg-muted/10 border border-transparent rounded-xl flex items-center gap-3 text-muted-foreground cursor-not-allowed">
                                                    <Mail size={16} />
                                                    <span className="font-medium">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "academic" && (
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        <GraduationCap className="text-primary" /> Academic Goals
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Stream / Domain</label>
                                            <select
                                                value={formData.stream}
                                                onChange={(e) => setFormData(prev => ({ ...prev, stream: e.target.value }))}
                                                className="w-full p-4 bg-muted/30 border border-transparent focus:border-primary rounded-xl font-bold outline-none transition-all appearance-none"
                                            >
                                                <option value="SCIENCE">Science (PCM/PCB)</option>
                                                <option value="COMMERCE">Commerce</option>
                                                <option value="HUMANITIES">Humanities / Arts</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Daily Goal (Questions)</label>
                                            <input
                                                type="number"
                                                value={formData.dailyGoal}
                                                onChange={(e) => setFormData(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) }))}
                                                className="w-full p-4 bg-muted/30 border border-transparent focus:border-primary rounded-xl font-bold outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target University</label>
                                            <input
                                                type="text"
                                                value={formData.targetUniversity}
                                                onChange={(e) => setFormData(prev => ({ ...prev, targetUniversity: e.target.value }))}
                                                className="w-full p-4 bg-muted/30 border border-transparent focus:border-primary rounded-xl font-bold outline-none transition-all"
                                                placeholder="e.g. Delhi University"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Course</label>
                                            <input
                                                type="text"
                                                value={formData.targetCourse}
                                                onChange={(e) => setFormData(prev => ({ ...prev, targetCourse: e.target.value }))}
                                                className="w-full p-4 bg-muted/30 border border-transparent focus:border-primary rounded-xl font-bold outline-none transition-all"
                                                placeholder="e.g. B.Com Hons"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "preferences" && (
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        <Palette className="text-primary" /> App Experience
                                    </h2>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl">
                                            <div>
                                                <p className="font-bold">Theme Mode</p>
                                                <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                                            </div>
                                            <ThemeToggle />
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl opacity-60 cursor-not-allowed">
                                            <div>
                                                <p className="font-bold">Notifications</p>
                                                <p className="text-sm text-muted-foreground">Email digests and study reminders</p>
                                            </div>
                                            <div className="h-6 w-10 bg-muted rounded-full relative">
                                                <div className="h-6 w-6 bg-muted-foreground/50 rounded-full absolute left-0" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        <Shield className="text-primary" /> Security & Account
                                    </h2>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-muted/20 rounded-2xl space-y-4">
                                            <div className="flex items-start gap-4">
                                                <Lock className="mt-1 text-primary" />
                                                <div className="flex-1">
                                                    <h4 className="font-bold">Password</h4>
                                                    <p className="text-sm text-muted-foreground mb-4">Last changed 3 months ago</p>
                                                    <button className="text-sm font-bold text-primary hover:underline">Change Password</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 border-2 border-dashed border-rose-500/20 bg-rose-500/5 rounded-2xl space-y-6">
                                            <h4 className="font-bold text-rose-600 flex items-center gap-2">
                                                <Trash2 size={18} /> Danger Zone
                                            </h4>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-sm">Reset Progress</p>
                                                    <p className="text-xs text-muted-foreground">Clear all XP and stats</p>
                                                </div>
                                                <button onClick={handleReset} className="px-4 py-2 bg-rose-500/10 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-500/20">
                                                    Reset
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-rose-500/10 pt-4">
                                                <div>
                                                    <p className="font-bold text-sm">Sign Out</p>
                                                    <p className="text-xs text-muted-foreground">Log out of this device</p>
                                                </div>
                                                <button onClick={() => signOut()} className="px-4 py-2 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-500/10 border border-rose-500/20">
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
