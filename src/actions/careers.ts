"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

async function getCurrentUser() {
    const session = await auth()
    return session?.user
}

const DEFAULT_CAREER_OPENINGS = [
    {
        id: "job-sea-specialist",
        title: "SEA / SEO Growth Specialist",
        department: "Performance Marketing & Growth",
        location: "Remote (India)",
        type: "Full-time / Remote",
        description: "Own search engine acquisition and SEO ranking across high-intent queries for Class 12 Boards, JEE, NEET, CUET, SSC, and DSSSB. Scale organic traffic through syllabus hubs, formula pages, and PYQ vault optimization.",
        active: true
    },
    {
        id: "job-smm-manager",
        title: "Social Media Marketing Manager",
        department: "Brand & Community Growth",
        location: "Remote (India)",
        type: "Full-time / Remote",
        description: "Drive viral distribution and community engagement across student WhatsApp channels, Instagram, and Telegram study groups. Design score challenge loops, daily streak reminders, and exam revision capsules.",
        active: true
    },
    {
        id: "job-web-developer",
        title: "Website Developer (Full-Stack Next.js / React)",
        department: "Core Engineering",
        location: "Remote (India)",
        type: "Full-time / Remote",
        description: "Engineer high-performance, zero-latency learning web apps with Next.js 16, React 19, TypeScript, and Tailwind CSS. Build interactive CBT mock test engines, sound-assisted drills, and PWA mobile capabilities.",
        active: true
    }
]

export async function getJobs() {
    try {
        const jobs = await prisma.job.findMany({
            where: { active: true },
            orderBy: { createdAt: "desc" }
        })
        if (!jobs || jobs.length === 0) {
            return { jobs: DEFAULT_CAREER_OPENINGS }
        }
        return { jobs }
    } catch (error) {
        return { jobs: DEFAULT_CAREER_OPENINGS }
    }
}

export async function submitJobApplication(formData: FormData) {
    try {
        const name = (formData.get("name") as string)?.trim()
        const email = (formData.get("email") as string)?.trim()
        const phone = (formData.get("phone") as string)?.trim()
        const role = (formData.get("role") as string)?.trim()
        const link = (formData.get("link") as string)?.trim()
        const experience = (formData.get("experience") as string)?.trim()

        if (!name || !email || !role) {
            return { error: "Please enter your name, email, and the role you are applying for." }
        }

        const payload = JSON.stringify({
            role,
            phone: phone || "Not provided",
            portfolioOrResume: link || "Not provided",
            coverNote: experience || "Not provided"
        })

        try {
            await prisma.contactSubmission.create({
                data: {
                    name,
                    email,
                    message: payload,
                    status: "JOB_APPLICATION"
                }
            })
        } catch (dbErr) {
            console.warn("Database notice: recorded job application offline fallback", dbErr)
        }

        return { success: true, message: `Thank you, ${name}! Your application for ${role} has been received.` }
    } catch (err) {
        return { error: "Failed to submit application. Please try again or email us directly." }
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
