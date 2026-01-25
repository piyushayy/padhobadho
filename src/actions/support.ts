"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function submitTicket(data: {
    type: "BUG" | "FEATURE" | "GENERAL" | "CONTENT_ERROR" | "OTHER",
    message: string
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.feedback.create({
        data: {
            userId: session.user.id,
            message: data.message,
            type: data.type
        }
    })

    return { success: true }
}
