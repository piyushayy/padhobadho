"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const feedbackSchema = z.object({
    message: z
        .string()
        .min(5, "Message must be at least 5 characters long")
        .max(1000, "Message must be at most 1000 characters long"),
    type: z.enum(["GENERAL", "BUG", "FEATURE"]).default("GENERAL"),
})

export async function submitFeedback(formData: FormData) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "You must be logged in to submit feedback" }
    }

    const rawData = {
        message: formData.get("message"),
        type: formData.get("type") ?? "GENERAL",
    }

    const result = feedbackSchema.safeParse(rawData)

    // ✅ FIX: use `issues` instead of `errors`
    if (!result.success) {
        return {
            error: result.error.issues[0]?.message ?? "Invalid input",
        }
    }

    try {
        await prisma.feedback.create({
            data: {
                userId: session.user.id,
                message: result.data.message,
                type: result.data.type,
            },
        })

        return { success: "Thank you for your feedback!" }
    } catch (error) {
        console.error("Failed to submit feedback:", error)
        return { error: "Failed to submit feedback. Please try again." }
    }
}
