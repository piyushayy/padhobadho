"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { rateLimit } from "@/lib/rate-limit"

const CreateDiscussionSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(200),
    content: z.string().min(10, "Content must be at least 10 characters").max(5000),
    subjectId: z.string().optional(),
})

const CreateCommentSchema = z.object({
    content: z.string().min(2, "Comment must be at least 2 characters").max(2000),
    discussionId: z.string().min(1),
})

export async function createDiscussion(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "You must be logged in." }

    const limit = rateLimit(`discussion_${session.user.id}`, { windowMs: 60 * 1000, max: 3 })
    if (!limit.success) return { error: "Posting too fast. Please wait a minute." }

    const rawData = {
        title: (formData.get("title") as string)?.trim(),
        content: (formData.get("content") as string)?.trim(),
        subjectId: (formData.get("subjectId") as string) || undefined,
    }

    const val = CreateDiscussionSchema.safeParse(rawData)
    if (!val.success) return { error: val.error.issues[0].message }

    try {
        await prisma.discussion.create({
            data: {
                title: val.data.title,
                content: val.data.content,
                subjectId: val.data.subjectId || null,
                userId: session.user.id,
            }
        })
        revalidatePath("/community")
        return { success: "Discussion created!" }
    } catch (error) {
        console.error("Create Discussion Error:", error)
        return { error: "Failed to create discussion." }
    }
}

export async function createComment(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "You must be logged in." }

    const limit = rateLimit(`comment_${session.user.id}`, { windowMs: 60 * 1000, max: 10 })
    if (!limit.success) return { error: "Commenting too quickly. Please pause." }

    const rawData = {
        content: (formData.get("content") as string)?.trim(),
        discussionId: (formData.get("discussionId") as string)?.trim(),
    }

    const val = CreateCommentSchema.safeParse(rawData)
    if (!val.success) return { error: val.error.issues[0].message }

    try {
        await prisma.comment.create({
            data: {
                content: val.data.content,
                discussionId: val.data.discussionId,
                userId: session.user.id,
            }
        })
        revalidatePath(`/community/${val.data.discussionId}`)
        return { success: "Comment added!" }
    } catch (error) {
        console.error("Create Comment Error:", error)
        return { error: "Failed to add comment." }
    }
}

export async function deleteDiscussion(discussionId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const disc = await prisma.discussion.findUnique({
        where: { id: discussionId },
        select: { userId: true }
    })

    if (!disc) return { error: "Not found" }
    if (disc.userId !== session.user.id && session.user.role !== "ADMIN") {
        return { error: "Forbidden" }
    }

    await prisma.discussion.delete({ where: { id: discussionId } })
    revalidatePath("/community")
    return { success: "Discussion removed" }
}
