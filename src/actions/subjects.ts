"use server"

import { prisma } from "@/lib/prisma"

export async function getSubjects() {
    try {
        const subjects = await prisma.subject.findMany({
            orderBy: { name: "asc" }
        })
        return { subjects }
    } catch (error) {
        return { error: "Failed to fetch subjects" }
    }
}
