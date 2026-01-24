import { Suspense } from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText, Download, ExternalLink, Library, BookOpen } from "lucide-react"
import AppLayout from "@/components/app-layout"
import { Skeleton } from "@/components/skeletons"

async function ResourcesContent() {
    const session = await auth()
    if (!session?.user?.id) return null

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { targetExamId: true }
    })

    const subjects = await prisma.subject.findMany({
        where: {
            exams: {
                some: { id: user?.targetExamId || "" }
            }
        },
        include: {
            resources: true
        }
    })

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-serif font-black tracking-tight mb-2">Study Library</h1>
                    <p className="text-muted-foreground font-medium text-lg">Curated notes, PYQ papers, and reference guides.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {subjects.map((subject) => (
                    <div key={subject.id} className="brilliant-card bg-card p-8 border border-border/40 space-y-6">
                        <div className="flex items-center gap-4 border-b border-border/20 pb-6">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <Library size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-black">{subject.name}</h2>
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Resources available</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subject.resources.length === 0 ? (
                                <div className="col-span-full py-8 text-center text-muted-foreground bg-accent/10 rounded-2xl border-2 border-dashed border-border/20">
                                    <p className="font-bold">No specific resources indexed yet.</p>
                                    <p className="text-[10px] uppercase tracking-widest mt-1">Check back soon for PYQs</p>
                                </div>
                            ) : (
                                subject.resources.map((res) => (
                                    <a
                                        key={res.id}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-accent/30 rounded-2xl hover:bg-primary/5 hover:border-primary/50 border border-transparent transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-xl text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                                                {res.type === "PDF" ? <FileText size={16} /> : <ExternalLink size={16} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{res.title}</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest opacity-50">{res.type}</p>
                                            </div>
                                        </div>
                                        <Download size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                ))
                            )}
                        </div>
                    </div>
                ))}

                {subjects.length === 0 && (
                    <div className="py-24 text-center space-y-4 bg-accent/20 rounded-[3rem] border-2 border-dashed border-border/40">
                        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
                        <p className="font-bold text-muted-foreground">Select an exam track to view subject resources.</p>
                        <Link href="/onboarding" className="text-primary hover:underline text-sm font-black uppercase tracking-widest">Update Goals</Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default async function ResourcesPage() {
    const session = await auth()
    if (!session) redirect("/auth/sign-in")

    return (
        <AppLayout session={session}>
            <Suspense fallback={<div>Loading Library...</div>}>
                <ResourcesContent />
            </Suspense>
        </AppLayout>
    )
}
