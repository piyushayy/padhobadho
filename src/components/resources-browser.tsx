"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, X, FileText, ExternalLink, Library, Sparkles } from "lucide-react"

interface ResourceItem {
    title: string
    type: string
    description: string
    url: string
}

interface SubjectItem {
    id: string
    name: string
    resources: Array<{ id: string; title: string; type: string; url: string }>
    _count: { questions: number }
}

interface ExamItem {
    id: string
    code: string
    name: string
}

interface ResourcesBrowserProps {
    allExams: ExamItem[]
    activeExam: ExamItem
    featuredResources: ResourceItem[]
    subjects: SubjectItem[]
}

export function ResourcesBrowser({
    allExams,
    activeExam,
    featuredResources,
    subjects,
}: ResourcesBrowserProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const q = searchQuery.trim().toLowerCase()

    const filteredFeatured = useMemo(() => {
        if (!q) return featuredResources
        return featuredResources.filter(
            (r) =>
                r.title.toLowerCase().includes(q) ||
                r.description.toLowerCase().includes(q) ||
                r.type.toLowerCase().includes(q)
        )
    }, [featuredResources, q])

    const filteredSubjects = useMemo(() => {
        if (!q) return subjects
        return subjects
            .map((s) => ({
                ...s,
                matchingResources: s.resources.filter(
                    (r) =>
                        r.title.toLowerCase().includes(q) ||
                        r.type.toLowerCase().includes(q) ||
                        s.name.toLowerCase().includes(q)
                ),
            }))
            .filter((s) => s.name.toLowerCase().includes(q) || s.matchingResources.length > 0)
    }, [subjects, q])

    const totalResults = filteredFeatured.length + filteredSubjects.reduce((acc, s) => acc + (q ? (s as any).matchingResources.length : s.resources.length), 0)

    return (
        <div className="space-y-8">
            {/* Search Bar & Stats */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-lg">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${activeExam.name} papers, formulas, chapters...`}
                        className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-card border border-border/70 hover:border-primary/40 focus:border-primary text-sm font-medium text-foreground placeholder:text-muted-foreground/60 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/20 shadow-xs"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span>{totalResults} items available</span>
                </div>
            </div>

            {/* Exam Track Pills */}
            <div className="flex flex-wrap gap-2.5">
                {allExams.map((exam) => {
                    const isSelected = exam.id === activeExam.id
                    return (
                        <Link
                            key={exam.id}
                            href={`/resources?exam=${exam.code}`}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                isSelected
                                    ? "bg-primary text-background shadow-md shadow-primary/20 scale-[1.02]"
                                    : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                        >
                            {exam.name}
                        </Link>
                    )
                })}
            </div>

            {/* Featured Official Exam PYQs Section */}
            {filteredFeatured.length > 0 && (
                <div className="p-6 md:p-8 rounded-3xl bg-card border border-border/70 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-xl font-serif font-black text-foreground">
                                {activeExam.name} Featured Free Vault
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium">
                                Direct official past papers, blueprints, and quick-revision formula sheets.
                            </p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                            Free Access
                        </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 pt-2">
                        {filteredFeatured.map((res, idx) => (
                            <a
                                key={idx}
                                href={res.url}
                                target={res.url.startsWith("http") ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="p-4 rounded-2xl bg-muted/40 hover:bg-muted border border-border/50 hover:border-primary/40 transition-all group flex flex-col justify-between space-y-3"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary">
                                            {res.type}
                                        </span>
                                        <ExternalLink size={12} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                                        {res.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {res.description}
                                    </p>
                                </div>
                                <span className="text-[11px] font-bold text-primary group-hover:underline inline-flex items-center gap-1">
                                    Open Document &rarr;
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Subject Specific Vault */}
            <div className="grid grid-cols-1 gap-6">
                {filteredSubjects.length === 0 && filteredFeatured.length === 0 ? (
                    <div className="py-16 text-center bg-card rounded-3xl border border-dashed border-border/70 p-8 space-y-3">
                        <p className="text-base font-bold text-foreground">No resources match &ldquo;{searchQuery}&rdquo;</p>
                        <p className="text-xs text-muted-foreground">Try searching for formula sheets, PYQs, physics, or mathematics.</p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-wider hover:bg-primary/20 transition-colors"
                        >
                            Reset Search Filter
                        </button>
                    </div>
                ) : (
                    filteredSubjects.map((subject: any) => {
                        const displayResources = q ? subject.matchingResources : subject.resources
                        return (
                            <div key={subject.id} className="stat-card p-6 md:p-8 border border-border/50 space-y-6">
                                <div className="flex items-center justify-between border-b border-border/30 pb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                            <Library size={22} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground">{subject.name}</h2>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                {displayResources.length} uploads • {subject._count.questions} practice questions
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/practice/${subject.id}`}
                                        className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                                    >
                                        Practice Questions &rarr;
                                    </Link>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                    {displayResources.length === 0 ? (
                                        <div className="col-span-full py-6 text-center text-muted-foreground bg-accent/20 rounded-2xl border border-dashed border-border/50">
                                            <p className="font-bold text-sm">Target practice questions ready for {subject.name}.</p>
                                            <Link href={`/practice/${subject.id}`} className="text-xs text-primary font-bold hover:underline mt-1 inline-block">
                                                Launch {subject.name} Practice Session &rarr;
                                            </Link>
                                        </div>
                                    ) : (
                                        displayResources.map((res: any) => (
                                            <a
                                                key={res.id}
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 bg-card hover:bg-accent/50 rounded-2xl border border-border/60 hover:border-primary/40 transition-all group shadow-xs"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                                                        {res.type === "PDF" ? <FileText size={16} /> : <ExternalLink size={16} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{res.title}</p>
                                                        <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                                            {res.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ExternalLink size={14} className="text-muted-foreground/60 group-hover:text-primary transition-colors shrink-0" />
                                            </a>
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
