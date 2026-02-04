"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function checkUsername(username: string) {
    if (!username || username.length < 3) return false
    try {
        const existing = await prisma.user.findFirst({
            where: { username: { equals: username, mode: 'insensitive' } },
            select: { id: true }
        })
        return !!existing
    } catch (e) {
        console.error("Check Username Error:", e)
        return false
    }
}

export async function submitOnboarding(data: {
    name: string
    username: string
    age: number
    school: string
    stream: string
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Authentication failed. Please sign in again.")

    // 1. Initial Name/Username validation
    if (!data.username || data.username.length < 3) throw new Error("Username must be at least 3 characters.")

    try {
        // 2. Double check username uniqueness (server-side)
        const existing = await prisma.user.findFirst({
            where: {
                username: { equals: data.username, mode: 'insensitive' },
                id: { not: session.user.id }
            },
            select: { id: true }
        })

        if (existing) {
            throw new Error("This username is already taken. Please choose another one.")
        }

        // 3. Update User Profile
        // We'll also set a default targetExamId if it's currently null, 
        // to prevent dashboard crashes that expect an exam context.
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { targetExamId: true }
        })

        // Default to CUET if no exam is set
        const updateData: any = {
            name: data.name,
            username: data.username,
            age: data.age,
            school: data.school,
            stream: data.stream,
            onboardingCompleted: true,
        }

        if (!currentUser?.targetExamId) {
            const firstExam = await prisma.exam.findFirst({ select: { id: true } })
            if (firstExam) {
                updateData.targetExamId = firstExam.id
            }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: updateData
        })

        console.log(`Onboarding completed for user: ${session.user.id}`)

        revalidatePath("/")
        revalidatePath("/dashboard")

        return { success: true }
    } catch (error: any) {
        console.error("Submit Onboarding Critical Error:", error)
        if (error.code === 'P2002') {
            throw new Error("Username already exists in our system.")
        }
        throw new Error(error.message || "Failed to save your profile. Internal Server Error.")
    }
}
