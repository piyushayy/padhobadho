"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    User, Mail, Shield, Palette,
    Bell, ChevronLeft, Save, LogOut,
    Trash2, RefreshCw, GraduationCap,
    Target, Zap, Flame, Loader2, Sparkles
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
        isPremium: boolean
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

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-24">
            {/* Header */}
            <div className="space-y-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                    <ChevronLeft size={16} strokeWidth={3} /> Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight leading-tight">Preferences</h1>
                        <p className="text-muted-foreground font-medium text-lg mt-2">
                            Customize your identity, academic goals, and app experience.
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-16 px-10 bg-primary text-background rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-primary/20 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="brilliant-card bg-primary text-background p-8 space-y-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Your Mastery</p>
                            <h3 className="text-4xl font-serif font-black mt-1">Level {user.level}</h3>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span>XP: {user.xp}</span>
                                    <span>Next Level in {1000 - (user.xp % 1000)} XP</span>
                                </div>
                                <div className="h-2 bg-background/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-background transition-all duration-1000" style={{ width: `${(user.xp % 1000) / 10}%` }} />
                                </div>
                            </div>
                        </div>
                        <Zap className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 -rotate-12" />
                    </div>

                    <div className="brilliant-card bg-card p-8 border-2 border-primary/10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Current Streak</p>
                            <h4 className="text-3xl font-black mt-1">{user.currentStreak} Days</h4>
                        </div>
                        <div className={`p-4 rounded-2xl ${user.currentStreak > 0 ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-muted text-muted-foreground"}`}>
                            <Flame size={24} fill={user.currentStreak > 0 ? "currentColor" : "none"} />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Account Section */}
                    <div className="brilliant-card bg-card p-8 space-y-8 border border-border/40">
                        <div className="flex items-center gap-3 border-b border-border/40 pb-6">
                            <User className="text-primary w-5 h-5" />
                            <h3 className="text-xl font-bold">Personal Profile</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Display Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full h-14 bg-muted/30 border-2 border-transparent focus:border-primary rounded-xl px-4 font-bold outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registered Email</label>
                                <div className="w-full h-14 bg-muted/10 border-2 border-transparent rounded-xl px-4 flex items-center gap-3 opacity-60">
                                    <Mail size={16} />
                                    <span className="font-bold text-sm">{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Goals */}
                    <div className="brilliant-card bg-card p-8 space-y-8 border border-border/40">
                        <div className="flex items-center gap-3 border-b border-border/40 pb-6">
                            <GraduationCap className="text-primary w-5 h-5" />
                            <h3 className="text-xl font-bold">Academic Targeting</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Education Stream</label>
                                <select
                                    value={formData.stream}
                                    onChange={(e) => setFormData(prev => ({ ...prev, stream: e.target.value }))}
                                    className="w-full h-14 bg-muted/30 border-2 border-transparent focus:border-primary rounded-xl px-4 font-bold outline-none transition-all appearance-none"
                                >
                                    <option value="SCIENCE">Science (PCM/PCB)</option>
                                    <option value="COMMERCE">Commerce</option>
                                    <option value="HUMANITIES">Humanities / Arts</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Daily Practice Goal</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={formData.dailyGoal}
                                        onChange={(e) => setFormData(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) }))}
                                        className="w-24 h-14 bg-muted/30 border-2 border-transparent focus:border-primary rounded-xl px-4 font-bold outline-none transition-all text-center"
                                    />
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Questions / Day</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Target size={12} /> Target University
                                </label>
                                <input
                                    type="text"
                                    value={formData.targetUniversity}
                                    onChange={(e) => setFormData(prev => ({ ...prev, targetUniversity: e.target.value }))}
                                    placeholder="e.g. Delhi University"
                                    className="w-full h-14 bg-muted/30 border-2 border-transparent focus:border-primary rounded-xl px-4 font-bold outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Sparkles size={12} /> Desired Course
                                </label>
                                <input
                                    type="text"
                                    value={formData.targetCourse}
                                    onChange={(e) => setFormData(prev => ({ ...prev, targetCourse: e.target.value }))}
                                    placeholder="e.g. B.Com (Hons)"
                                    className="w-full h-14 bg-muted/30 border-2 border-transparent focus:border-primary rounded-xl px-4 font-bold outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* App Settings */}
                    <div className="brilliant-card bg-card p-8 space-y-8 border border-border/40">
                        <div className="flex items-center gap-3 border-b border-border/40 pb-6">
                            <Palette className="text-primary w-5 h-5" />
                            <h3 className="text-xl font-bold">App Preferences</h3>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-lg">Interface Theme</p>
                                <p className="text-sm text-muted-foreground font-medium">Switch between light and dark mode</p>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Elite Status Card */}
                    <div className={`brilliant-card p-10 relative overflow-hidden group border-2 ${user.isPremium ? "bg-emerald-950 border-emerald-500/30" : "bg-amber-950 border-amber-500/30"}`}>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex gap-6 items-center flex-col md:flex-row text-center md:text-left">
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-2 ${user.isPremium ? "bg-emerald-500 text-white border-emerald-400/50 shadow-2xl shadow-emerald-500/40" : "bg-amber-500 text-white border-amber-400/50"}`}>
                                    <Shield size={32} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${user.isPremium ? "text-emerald-400" : "text-amber-400"}`}>Account Authority</p>
                                    <h3 className="text-3xl font-serif font-black text-white">{user.isPremium ? 'North Campus Elite' : 'Standard Access'}</h3>
                                    <p className="text-sm font-medium text-white/60">
                                        {user.isPremium ? "All premium features unlocked forever." : "Upgrade to unlock full potential."}
                                    </p>
                                </div>
                            </div>
                            {!user.isPremium && (
                                <Link href="/checkout" className="px-10 py-5 bg-amber-500 text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-amber-500/20">
                                    Become Elite
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="space-y-6 pt-8 border-t border-border/40">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-rose-500/5 rounded-[2.5rem] border-2 border-dashed border-rose-500/20">
                            <div>
                                <h4 className="text-xl font-black text-rose-500">Reset Training Progress</h4>
                                <p className="text-sm font-medium text-muted-foreground">Clear all history, levels, and statistics. This cannot be undone.</p>
                            </div>
                            <button
                                onClick={handleReset}
                                disabled={isResetting}
                                className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-rose-600 transition-all disabled:opacity-50"
                            >
                                {isResetting ? <Loader2 className="animate-spin w-4 h-4" /> : <RefreshCw size={18} />}
                                Factory Reset
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest max-w-[300px]">
                                Padhobadho ID: {user.email?.split('@')[0]} <br />
                                Registered {new Date().toLocaleDateString()}
                            </p>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 px-8 py-4 text-rose-500 font-black text-sm hover:bg-rose-500/10 rounded-2xl transition-all"
                            >
                                <LogOut size={18} strokeWidth={3} /> Absolute Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
