"use client"

import { useState } from "react"
import { createComment } from "@/actions/discussion"
import { toast } from "sonner"
import { User as UserIcon, Send, Loader2 } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useRouter } from "next/navigation"

dayjs.extend(relativeTime)

interface Comment {
    id: string
    content: string
    createdAt: Date
    user: {
        name: string | null
        image: string | null
    }
}

export function DiscussionComments({
    discussionId,
    initialComments,
    currentUserId
}: {
    discussionId: string,
    initialComments: Comment[],
    currentUserId?: string
}) {
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!currentUserId) {
            toast.error("Please login to comment")
            return
        }

        setIsPending(true)
        const formData = new FormData(e.currentTarget)
        const result = await createComment(formData)
        setIsPending(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Comment posted!")
                (e.target as HTMLFormElement).reset()
            router.refresh()
            // Optimistic update could be added here, but refresh is safer for ID syncing
        }
    }

    return (
        <div className="space-y-6">
            {/* Comment List */}
            <div className="space-y-4">
                {initialComments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                            {comment.user.image ? (
                                <img src={comment.user.image} alt={comment.user.name || "User"} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={14} className="text-muted-foreground" />
                            )}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">{comment.user.name}</span>
                                <span className="text-xs text-muted-foreground">{dayjs(comment.createdAt).fromNow()}</span>
                            </div>
                            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comment Form */}
            <div className="bg-card border border-border p-4 rounded-xl sticky bottom-4 shadow-xl">
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <input type="hidden" name="discussionId" value={discussionId} />
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <UserIcon size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 relative">
                        <input
                            name="content"
                            required
                            placeholder={currentUserId ? "Write a comment..." : "Login to comment"}
                            disabled={!currentUserId || isPending}
                            className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary pr-12 disabled:opacity-50"
                            autoComplete="off"
                        />
                        <button
                            disabled={!currentUserId || isPending}
                            className="absolute right-1 top-1 h-8 w-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50"
                        >
                            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
