"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const CreateDiscussionSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    subjectId: z.string().optional(),
})

const CreateCommentSchema = z.object({
    content: z.string().min(2, "Comment must be at least 2 characters"),
    discussionId: z.string(),
})

export async function createDiscussion(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "You must be logged in." }

    const rawData = {
        title: formData.get("title"),
        content: formData.get("content"),
        subjectId: formData.get("subjectId") || undefined,
    }

    const val = CreateDiscussionSchema.safeParse(rawData)
    if (!val.success) return { error: val.error.issues[0].message }

    try {
        await prisma.discussion.create({
            data: {
                title: val.data.title,
                content: val.data.content,
                subjectId: val.data.subjectId,
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

    const rawData = {
        content: formData.get("content"),
        discussionId: formData.get("discussionId"),
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
