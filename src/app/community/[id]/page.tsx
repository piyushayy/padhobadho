import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User as UserIcon, Send, Clock, Trash2 } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { DiscussionComments } from "@/components/discussion-comments"

dayjs.extend(relativeTime)

export default async function DiscussionDetailPage({ params }: { params: { id: string } }) {
    const session = await auth()
    const { id } = await params

    const discussion = await prisma.discussion.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, image: true, id: true } },
            subject: { select: { name: true } },
            comments: {
                include: { user: { select: { name: true, image: true } } },
                orderBy: { createdAt: "asc" }
            }
        }
    })

    if (!discussion) notFound()

    return (
        <div className="min-h-screen bg-background pb-20 pt-8">
            <main className="container mx-auto px-4 max-w-4xl">
                <Link href="/community" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-bold text-sm">
                    <ArrowLeft size={16} /> Back to Community
                </Link>

                {/* Main Post */}
                <article className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            {discussion.user.image ? (
                                <img src={discussion.user.image} alt={discussion.user.name || "User"} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                discussion.user.name?.[0]
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-serif font-black leading-tight mb-1">
                                {discussion.title}
                            </h1>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="font-bold text-foreground">{discussion.user.name}</span>
                                <span>•</span>
                                <span>{dayjs(discussion.createdAt).fromNow()}</span>
                                {discussion.subject && (
                                    <>
                                        <span>•</span>
                                        <span className="bg-secondary px-2 py-0.5 rounded text-xs font-bold text-secondary-foreground">
                                            {discussion.subject.name}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        {discussion.content}
                    </div>
                </article>

                {/* Comments Section */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm">{discussion.comments.length}</span> Comments
                    </h3>

                    <DiscussionComments
                        discussionId={discussion.id}
                        initialComments={discussion.comments as any}
                        currentUserId={session?.user?.id}
                    />
                </div>
            </main>
        </div>
    )
}
