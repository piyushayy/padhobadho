"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitOnboarding(data: {
    name: string
    age: number
    school: string
    stream?: string
}) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Authentication failed. Please sign in again.")
    }

    try {
        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        // 2. Find a default exam if none is set
        let targetExamId = existingUser?.targetExamId
        if (!targetExamId) {
            const firstExam = await prisma.exam.findFirst({ select: { id: true } })
            targetExamId = firstExam?.id || null
        }

        const commonData = {
            name: data.name,
            age: data.age,
            school: data.school,
            stream: data.stream || null,
            onboardingCompleted: true,
            targetExamId: targetExamId
        }

        if (existingUser) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: commonData
            })
        } else {
            // Social logins might not have created the user in DB yet if the sync lagged
            await prisma.user.create({
                data: {
                    id: session.user.id,
                    email: session.user.email,
                    ...commonData
                }
            })
        }

        console.log(`[ONBOARDING] Success for user: ${session.user.id}`)

        revalidatePath("/")
        revalidatePath("/dashboard")

        return { success: true }
    } catch (error: any) {
        console.error("Submit Onboarding Critical Error:", error)
        throw new Error(error.message || "Failed to save your profile. Please try again.")
    }
}
