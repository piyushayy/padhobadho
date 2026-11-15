import { prisma } from "@/lib/prisma"
import { Layers, Plus, ChevronRight, MoreVertical } from "lucide-react"

import SubjectListClient from "./subject-list-client"

export const dynamic = "force-dynamic"

export default async function SubjectsPage() {
    let subjects: any[] = []
    let courses: any[] = []

    try {
        subjects = await prisma.subject.findMany({
            include: {
                topics: {
                    orderBy: { name: "asc" }
                },
                _count: {
                    select: { questions: true }
                }
            },
            orderBy: { name: "asc" }
        })

        courses = await prisma.course.findMany({
            orderBy: { name: "asc" }
        })
    } catch (e) {
        console.error("Failed to load subjects in SubjectsPage:", e)
    }

    return (
        <SubjectListClient initialSubjects={subjects as any} courses={courses} />
    )
}
