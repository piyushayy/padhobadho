"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

async function getCurrentUser() {
    const session = await auth()
    return session?.user
}

export async function getJobs() {
    try {
        const jobs = await prisma.job.findMany({
            where: { active: true },
            orderBy: { createdAt: "desc" }
        })
        return { jobs }
    } catch (error) {
        return { error: "Failed to fetch jobs" }
    }
}

export async function createJob(formData: FormData) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "ADMIN") {
            return { error: "Unauthorized" }
        }

        const title = formData.get("title") as string
        const department = formData.get("department") as string
        const location = formData.get("location") as string
        const type = formData.get("type") as string
        const description = formData.get("description") as string
        const applicationLink = formData.get("applicationLink") as string
        const email = formData.get("email") as string

        if (!title || !description || !department) {
            return { error: "Missing required fields" }
        }

        await prisma.job.create({
            data: {
                title,
                department,
                location,
                type,
                description,
                applicationLink: applicationLink || null,
                email: email || null,
                active: true
            }
        })

        revalidatePath("/careers")
        revalidatePath("/admin/careers")
        return { success: true }
    } catch (error) {
        return { error: "Failed to create job" }
    }
}

export async function deleteJob(jobId: string) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "ADMIN") {
            return { error: "Unauthorized" }
        }

        await prisma.job.delete({
            where: { id: jobId }
        })

        revalidatePath("/careers")
        revalidatePath("/admin/careers")
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete job" }
    }
}
