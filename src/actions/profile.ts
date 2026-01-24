"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateTargetExam(examId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.user.update({
        where: { id: session.user.id },
        data: { targetExamId: examId }
    })

    revalidatePath("/dashboard")
    revalidatePath("/practice")
    revalidatePath("/mock-test")

    return { success: true }
}

export async function getAvailableExams() {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    return prisma.exam.findMany({
        orderBy: { code: "asc" }
    })
}
export async function updateProfile(data: {
    name: string
    stream: string
    targetUniversity: string
    targetCourse: string
    dailyGoal: number
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: data.name,
            stream: data.stream,
            targetUniversity: data.targetUniversity,
            targetCourse: data.targetCourse,
            dailyGoal: data.dailyGoal
        }
    })

    revalidatePath("/dashboard")
    revalidatePath("/profile/settings")
    return { success: true }
}

export async function resetProgress() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const userId = session.user.id

    await prisma.$transaction([
        prisma.userQuestionHistory.deleteMany({ where: { userId } }),
        prisma.mockSession.deleteMany({ where: { userId } }),
        prisma.practiceSession.deleteMany({ where: { userId } }),
        prisma.userPerformanceSummary.deleteMany({ where: { userId } }),
        prisma.userAchievement.deleteMany({ where: { userId } }),
        prisma.user.update({
            where: { id: userId },
            data: {
                xp: 0,
                level: 1,
                currentStreak: 0,
                longestStreak: 0
            }
        })
    ])

    revalidatePath("/dashboard")
    return { success: true }
}
