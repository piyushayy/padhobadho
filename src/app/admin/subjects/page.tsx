import { prisma } from "@/lib/prisma"
import { Layers, Plus, ChevronRight, MoreVertical } from "lucide-react"

import SubjectListClient from "./subject-list-client"

export default async function SubjectsPage() {
    const subjects = await prisma.subject.findMany({
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

    return (
        <SubjectListClient initialSubjects={subjects as any} />
    )
}
