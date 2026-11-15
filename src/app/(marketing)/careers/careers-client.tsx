"use client"

import { useState, useRef } from "react"
import { submitJobApplication } from "@/actions/careers"
import { toast } from "sonner"
import {
    Briefcase,
    MapPin,
    Clock,
    ArrowRight,
    Send,
    CheckCircle2,
    Sparkles,
    User,
    Mail,
    Phone,
    Link as LinkIcon,
    FileText,
    Loader2
} from "lucide-react"

interface JobItem {
    id: string
    title: string
    department: string
    location: string
    type: string
    description: string
    email?: string | null
    applicationLink?: string | null
}

export function CareersClient({ jobs }: { jobs: JobItem[] }) {
    const [selectedRole, setSelectedRole] = useState(jobs[0]?.title || "SEA / SEO Growth Specialist")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    const formRef = useRef<HTMLDivElement>(null)

    function handleApplyClick(title: string) {
        setSelectedRole(title)
        setIsSubmitted(false)
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        formData.set("role", selectedRole)

        try {
            const res = await submitJobApplication(formData)
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success("Application Submitted Successfully!")
                setIsSubmitted(true)
                setSuccessMessage(res.message || "Your application has been received.")
                ;(e.target as HTMLFormElement).reset()
            }
        } catch {
            toast.error("Failed to submit. Please check your network and try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-20">
            {/* Header */}
            <div className="text-center space-y-5 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                    <Sparkles size={12} /> We Are Hiring Builders
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight leading-tight">
                    Build India&apos;s 100% Free Learning Platform.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                    PadhoBadho is removing financial barriers for millions of Class 12, JEE, NEET, CUET, SSC, and DSSSB aspirants. Join our high-impact team.
                </p>
                <div className="pt-2">
                    <a
                        href="mailto:piyushkaushik121@gmail.com"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                    >
                        Questions? Reach the founder directly at piyushkaushik121@gmail.com
                    </a>
                </div>
            </div>

            {/* Open Positions List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <div>
                        <h2 className="text-2xl font-serif font-black text-foreground">Open Roles ({jobs.length})</h2>
                        <p className="text-xs text-muted-foreground font-medium">Remote-first opportunities across growth, community, and engineering.</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-card p-8 rounded-3xl border border-border/70 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-xl space-y-6"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="space-y-3 max-w-2xl">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                                            {job.department}
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                                            {job.type}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-serif font-black text-foreground">{job.title}</h3>

                                    <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {job.location}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> Immediate Opening</span>
                                    </div>

                                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                                        {job.description}
                                    </p>
                                </div>

                                <div className="shrink-0 pt-2 md:pt-0">
                                    <button
                                        onClick={() => handleApplyClick(job.title)}
                                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-background rounded-xl font-black text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20 cursor-pointer"
                                    >
                                        Apply for this Role <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Application Form Section */}
            <div ref={formRef} className="scroll-mt-12">
                <div className="max-w-3xl mx-auto bg-card border border-border/80 rounded-3xl p-8 md:p-12 shadow-xl space-y-8">
                    <div className="space-y-2 border-b border-border/50 pb-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                            <Send size={11} /> Application Portal
                        </div>
                        <h2 className="text-3xl font-serif font-black text-foreground">Submit Your Application</h2>
                        <p className="text-sm text-muted-foreground">
                            Fill in your details below. Our team reviews all applications within 48 hours.
                        </p>
                    </div>

                    {isSubmitted ? (
                        <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/25 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                            <h3 className="text-2xl font-serif font-black text-foreground">Application Received!</h3>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">{successMessage}</p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="px-6 py-2.5 bg-primary text-background rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-90 transition-opacity"
                            >
                                Submit Another Application
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Role Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <Briefcase size={14} /> Position Applying For *
                                </label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-muted/40 border border-border/70 text-foreground font-bold text-sm focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all"
                                >
                                    {jobs.map((job) => (
                                        <option key={job.id} value={job.title} className="bg-card text-foreground">
                                            {job.title} ({job.department})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Candidate Details Grid */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <User size={14} /> Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="e.g. Rahul Sharma"
                                        className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/70 text-foreground text-sm font-medium focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Mail size={14} /> Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="rahul@example.com"
                                        className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/70 text-foreground text-sm font-medium focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Phone size={14} /> Phone / WhatsApp Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="+91 98765 43210"
                                        className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/70 text-foreground text-sm font-medium focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <LinkIcon size={14} /> Portfolio / LinkedIn / GitHub *
                                    </label>
                                    <input
                                        type="url"
                                        name="link"
                                        required
                                        placeholder="https://linkedin.com/in/... or github.com/..."
                                        className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/70 text-foreground text-sm font-medium focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Pitch / Past Work */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <FileText size={14} /> Relevant Experience &amp; Why You Want to Join *
                                </label>
                                <textarea
                                    name="experience"
                                    required
                                    rows={4}
                                    placeholder="Tell us briefly about past projects, measurable growth outcomes, or your approach to this role at PadhoBadho..."
                                    className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/70 text-foreground text-sm font-medium focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all resize-y"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-primary text-background font-black text-sm uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Submitting Application...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        <span>Submit Application for {selectedRole}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
