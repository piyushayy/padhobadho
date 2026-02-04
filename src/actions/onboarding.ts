"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function checkUsername(username: string) {
    const existing = await prisma.user.findUnique({
        where: { username }
    })
    return !!existing
}

export async function submitOnboarding(data: {
    name: string
    username: string
    age: number
    school: string
    stream: string
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // Double check username uniqueness
    const existing = await prisma.user.findUnique({
        where: { username: data.username }
    })

    if (existing && existing.id !== session.user.id) {
        throw new Error("Username already taken")
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                username: data.username,
                age: data.age,
                school: data.school,
                stream: data.stream,
                onboardingCompleted: true,
            }
        })

        revalidatePath("/dashboard")
        return { success: true }
    } catch (error: any) {
        console.error("Onboarding Sync Error:", error)
        throw new Error(error.message || "Could not save your profile. Please try again.")
    }
}
