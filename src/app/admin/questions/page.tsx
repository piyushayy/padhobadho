import { prisma } from "@/lib/prisma"
import { Search, Filter, Edit3, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"

import QuestionListClient from "./question-list-client"
export const dynamic = 'force-dynamic'

export default async function QuestionListPage() {
    const questions = await prisma.question.findMany({
        include: {
            subject: true,
            topic: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100, // Increased to 100 for better utility
    })

    return (
        <div className="space-y-12">
            <PageHeader
                title="Question Library"
                subtitle="Manage the repository of all exam questions."
                action={
                    <Link href="/admin/questions/upload" className="px-8 py-4 bg-foreground text-background dark:bg-white dark:text-black rounded-full font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
                        <PlusCircle className="w-5 h-5" /> Add Questions
                    </Link>
                }
            />

            <QuestionListClient initialQuestions={questions} />
        </div>
    )
}

function PlusCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" />
        </svg>
    )
}
