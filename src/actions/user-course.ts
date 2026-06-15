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
            data: { courseId }
        })
        revalidatePath("/practice")
        return { success: true }
    } catch (error) {
        return { error: "Failed to update course" }
    }
}
