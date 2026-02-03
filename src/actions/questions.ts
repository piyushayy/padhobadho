"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { Difficulty } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

const QuestionSchema = z.object({
    subjectId: z.string().min(1, "Subject is required"),
    topicId: z.string().min(1, "Topic is required"),
    difficulty: z.nativeEnum(Difficulty),
    content: z.string().min(10, "Question content is too short"),
    explanation: z.string().optional(),
    options: z.array(z.string()).min(2, "At least 2 options required"),
    correctOption: z.coerce.number().min(0).max(3),
})

export async function createQuestion(formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    // Parse Options
    const options = [
        formData.get("option_0") as string,
        formData.get("option_1") as string,
        formData.get("option_2") as string,
        formData.get("option_3") as string,
    ].filter(Boolean)

    const rawData = {
        subjectId: formData.get("subjectId"),
        topicId: formData.get("topicId"),
        difficulty: formData.get("difficulty"),
        content: formData.get("content"),
        explanation: formData.get("explanation"),
        correctOption: formData.get("correctOption"),
        options,
    }

    const validated = QuestionSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: "Invalid data", details: validated.error.flatten() }
    }

    const { data } = validated

    try {
        // Check for duplicate
        const existing = await prisma.question.findFirst({
            where: {
                subjectId: data.subjectId,
                topicId: data.topicId,
                content: data.content
            }
        })

        if (existing) {
            return { error: "This question already exists in the selected topic." }
        }

        await prisma.question.create({
            data: {
                ...data,
                options: data.options, // stored as Json
            },
        })

        revalidatePath("/admin/questions")
        return { success: "Question uploaded successfully!" }
    } catch (error) {
        console.error("Upload error:", error)
        return { error: "Failed to save question." }
    }
}

export async function deleteQuestions(ids: string[]) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await prisma.question.deleteMany({
            where: { id: { in: ids } }
        })
        revalidatePath("/admin/questions")
        return { success: `Deleted ${ids.length} questions` }
    } catch (error) {
        return { error: "Failed to delete questions" }
    }
}

export async function deleteAllQuestions() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await prisma.question.deleteMany({})
        revalidatePath("/admin/questions")
        return { success: "All questions deleted successfully" }
    } catch (error) {
        return { error: "Failed to delete all questions" }
    }
}

export async function getSubjects() {
    return await prisma.subject.findMany({
        include: { topics: true },
        orderBy: { order: 'asc' }
    })
}
