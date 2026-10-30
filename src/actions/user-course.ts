"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function updateUserCourse(courseId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                courseId: courseId && courseId.trim().length > 0 ? courseId.trim() : null
            }
        })
        revalidatePath("/practice")
        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Failed to update user course:", error)
        return { error: "Failed to update course selection" }
    }
}
