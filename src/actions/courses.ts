"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

async function assertAdmin() {
    const session = await auth()
    return session?.user?.role === "ADMIN"
}

export async function getCourses() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                _count: {
                    select: { subjects: true, users: true }
                }
            },
            orderBy: { name: "asc" }
        })
        return { courses }
    } catch {
        return { error: "Failed to fetch courses" }
    }
}

export async function createCourse(formData: FormData) {
    try {
        if (!(await assertAdmin())) return { error: "Unauthorized" }

        const name = formData.get("name") as string
        const description = formData.get("description") as string

        if (!name) return { error: "Name is required" }

        await prisma.course.create({
            data: {
                name,
                description
            }
        })

        revalidatePath("/admin/courses")
        return { success: true }
    } catch {
        return { error: "Failed to create course" }
    }
}

export async function updateCourse(id: string, formData: FormData) {
    try {
        if (!(await assertAdmin())) return { error: "Unauthorized" }

        const name = formData.get("name") as string
        const description = formData.get("description") as string

        await prisma.course.update({
            where: { id },
            data: {
                name,
                description
            }
        })

        revalidatePath("/admin/courses")
        revalidatePath(`/admin/courses/${id}`)
        return { success: true }
    } catch {
        return { error: "Failed to update course" }
    }
}

export async function deleteCourse(id: string) {
    try {
        if (!(await assertAdmin())) return { error: "Unauthorized" }

        await prisma.course.delete({
            where: { id }
        })
        revalidatePath("/admin/courses")
        return { success: true }
    } catch {
        return { error: "Failed to delete course" }
    }
}

export async function getCourse(id: string) {
    try {
        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                subjects: true
            }
        })
        return { course }
    } catch {
        return { error: "Failed to fetch course" }
    }
}

export async function addSubjectToCourse(courseId: string, subjectId: string) {
    try {
        if (!(await assertAdmin())) return { error: "Unauthorized" }

        await prisma.course.update({
            where: { id: courseId },
            data: {
                subjects: {
                    connect: { id: subjectId }
                }
            }
        })
        revalidatePath(`/admin/courses/${courseId}`)
        return { success: true }
    } catch {
        return { error: "Failed to add subject" }
    }
}

export async function removeSubjectFromCourse(courseId: string, subjectId: string) {
    try {
        if (!(await assertAdmin())) return { error: "Unauthorized" }

        await prisma.course.update({
            where: { id: courseId },
            data: {
                subjects: {
                    disconnect: { id: subjectId }
                }
            }
        })
        revalidatePath(`/admin/courses/${courseId}`)
        return { success: true }
    } catch {
        return { error: "Failed to remove subject" }
    }
}
