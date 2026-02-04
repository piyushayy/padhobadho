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
    stream?: string
}) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Authentication failed. Please sign in again.")
    }

    if (!data.username || data.username.length < 3) {
        throw new Error("Username must be at least 3 characters.")
    }

    try {
        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        // 2. Check if username is taken by ANOTHER user
        const taken = await prisma.user.findFirst({
            where: {
                username: { equals: data.username, mode: 'insensitive' },
                id: { not: session.user.id }
            },
            select: { id: true }
        })

        if (taken) {
            throw new Error("This username is already taken. Please choose another one.")
        }

        // 3. Find a default exam if none is set
        let targetExamId = existingUser?.targetExamId
        if (!targetExamId) {
            const firstExam = await prisma.exam.findFirst({ select: { id: true } })
            targetExamId = firstExam?.id || null
        }

        const commonData = {
            name: data.name,
            username: data.username.toLowerCase(), // Store as lowercase for consistency
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

        console.log(`[ONBOARDING] Success for user: ${session.user.id} (@${data.username})`)

        revalidatePath("/")
        revalidatePath("/dashboard")

        return { success: true }
    } catch (error: any) {
        console.error("Submit Onboarding Critical Error:", error)
        if (error.code === 'P2002') {
            throw new Error("Username already exists in our system. Please try a different one.")
        }
        throw new Error(error.message || "Failed to save your profile. Please try again.")
    }
}
