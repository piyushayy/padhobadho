"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitOnboarding(data: {
    name: string
    targetExamId: string
    stream: string
    targetUniversity: string
    targetCourse: string
    subjectIds: string[]
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: data.name,
            targetExamId: data.targetExamId,
            stream: data.stream,
            targetUniversity: data.targetUniversity,
            targetCourse: data.targetCourse,
            onboardingCompleted: true,
            targetedSubjects: {
                set: data.subjectIds.map(id => ({ id }))
            }
        }
    })

    revalidatePath("/dashboard")
    return { success: true }
}
