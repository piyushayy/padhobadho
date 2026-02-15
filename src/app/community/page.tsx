import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Metadata } from "next"
import { Plus, MessageSquare, Clock, User as UserIcon } from "lucide-react"
import { CreateDiscussionModal } from "@/components/create-discussion-modal"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export const metadata: Metadata = {
    title: "Community | PadhoBadho",
    description: "Discuss doubts, share knowledge, and grow together."
}

export default async function CommunityPage() {
    const session = await auth()

    const discussions = await prisma.discussion.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { name: true, image: true } },
            subject: { select: { name: true } },
            _count: { select: { comments: true } }
        },
        take: 20
    })

    const subjects = await prisma.subject.findMany({
        select: { id: true, name: true }
    })

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-primary/5 border-b border-border py-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60 pointer-events-none" />
                <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight mb-4 relative z-10">Community</h1>
                <p className="text-muted-foreground font-medium max-w-lg mx-auto relative z-10">
                    Ask doubts, help others, and build your network.
                </p>
                <div className="mt-8 relative z-20">
                    <CreateDiscussionModal subjects={subjects} />
                </div>
            </div>

            <main className="container mx-auto px-4 mt-8 max-w-4xl">
                <div className="space-y-4">
                    {discussions.length === 0 ? (
                        <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold">No discussions yet</h3>
                            <p className="text-muted-foreground">Be the first to start a conversation!</p>
                        </div>
                    ) : (
                        discussions.map((discussion) => (
                            <Link
                                key={discussion.id}
                                href={`/community/${discussion.id}`}
                                className="block bg-card hover:bg-muted/50 border border-border rounded-xl p-6 transition-all shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {discussion.subject && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                                                    {discussion.subject.name}
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <UserIcon size={12} /> {discussion.user.name} • {dayjs(discussion.createdAt).fromNow()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                                            {discussion.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-2">
                                            {discussion.content}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center min-w-[60px] text-muted-foreground">
                                        <MessageSquare size={20} />
                                        <span className="text-xs font-bold mt-1">{discussion._count.comments}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
