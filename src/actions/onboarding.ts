"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitOnboarding(data: {
    name: string
    age: number
    school: string
    phoneNumber: string
    stream: string
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: data.name,
            age: data.age,
            school: data.school,
            phoneNumber: data.phoneNumber,
            stream: data.stream,
            onboardingCompleted: true,
        }
    })

    revalidatePath("/dashboard")
    return { success: true }
}
