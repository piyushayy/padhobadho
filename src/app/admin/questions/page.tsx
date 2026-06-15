import { prisma } from "@/lib/prisma"
import { Search, Filter, Edit3, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"

import QuestionListClient from "./question-list-client"
export const dynamic = 'force-dynamic'

export default async function QuestionListPage() {
    const [questions, subjects] = await Promise.all([
        prisma.question.findMany({
            include: {
                subject: true,
                topic: true,
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        }),
        prisma.subject.findMany({
            include: { topics: true }
        })
    ])

    return (
        <div className="space-y-12">
            <PageHeader
                title="Question Library"
                subtitle="Manage the repository of all exam questions."
            />

            <QuestionListClient initialQuestions={questions} subjects={subjects} />
        </div>
    )
}


