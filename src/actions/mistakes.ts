"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getMistakeBankQuestions() {
    const session = await auth()
    if (!session?.user?.id) return []

    const mistakeEntries = await prisma.userQuestionHistory.findMany({
        where: {
            userId: session.user.id,
            isCorrect: false,
        },
        include: {
            question: {
                include: {
                    subject: true,
                    topic: true,
                }
            }
        },
        orderBy: { lastAttempted: "desc" },
        take: 50,
    })

    return mistakeEntries.map((entry: any) => ({
        id: entry.question.id,
        content: entry.question.content,
        options: entry.question.options as string[],
        explanation: entry.question.explanation,
        correctOption: entry.question.correctOption,
        difficulty: entry.question.difficulty,
        subject: entry.question.subject?.name || "General",
        topic: entry.question.topic?.name || "General",
        attempts: entry.occurrences,
        lastAttempted: entry.lastAttempted,
    }))
}

export async function resolveMistake(questionId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    await prisma.userQuestionHistory.update({
        where: {
            userId_questionId: {
                userId: session.user.id,
                questionId,
            }
        },
        data: {
            isCorrect: true,
            lastAttempted: new Date()
        }
    })

    revalidatePath("/practice/mistakes")
    revalidatePath("/dashboard")
    return { success: true }
}
