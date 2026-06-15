"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import Papa from "papaparse"
import { Difficulty } from "@prisma/client"
import { revalidatePath } from "next/cache"

// Helper to clean strings
const clean = (str: any) => String(str).trim()

// Helper to map difficulty
const parseDifficulty = (diff: string): Difficulty => {
    const d = clean(diff || "").toUpperCase()
    if (d === "MEDIUM") return "MEDIUM"
    if (d === "HARD") return "HARD"
    return "EASY"
}

// Helper to parse correct option
const parseCorrectOption = (opt: string): number => {
    const cleaned = clean(opt).toUpperCase()
    if (["A", "1", "0"].includes(cleaned)) return 0
    if (["B", "2", "1"].includes(cleaned)) return 1
    if (["C", "3", "2"].includes(cleaned)) return 2
    if (["D", "4", "3"].includes(cleaned)) return 3
    return 0
}

export async function bulkUploadQuestions(formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    const file = formData.get("csv_file") as File
    const defaultSubjectId = formData.get("subjectId") as string
    const defaultTopicId = formData.get("topicId") as string

    if (!file) return { error: "No file uploaded" }

    const text = await file.text()

    return new Promise((resolve) => {
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data as any[]
                let successCount = 0
                let errors: string[] = []

                // Pre-fetch all subjects and topics
                const allSubjects = await prisma.subject.findMany({ include: { topics: true } })

                let defaultSubject: any = null
                let defaultTopic: any = null

                if (defaultSubjectId) {
                    defaultSubject = allSubjects.find(s => s.id === defaultSubjectId)
                    if (defaultSubject && defaultTopicId) {
                        defaultTopic = defaultSubject.topics.find((t: any) => t.id === defaultTopicId)
                    }
                }

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i]
                    const rowNum = i + 2

                    try {
                        // 1. Determine Subject
                        let subject = defaultSubject
                        if (!subject && row.subject) {
                            subject = allSubjects.find(s => s.name.toLowerCase() === clean(row.subject).toLowerCase())
                        }

                        if (!subject) {
                            errors.push(`Row ${rowNum}: Subject required (CSV or Selection)`)
                            continue
                        }

                        // 2. Determine Topic
                        let topic = defaultTopic
                        if (row.topic && clean(row.topic)) {
                            const found = subject.topics.find((t: any) => t.name.toLowerCase() === clean(row.topic).toLowerCase())
                            if (found) topic = found
                            else if (!topic) {
                                errors.push(`Row ${rowNum}: Topic '${row.topic}' not found in ${subject.name}`)
                                continue
                            }
                        }

                        if (!topic) {
                            // Fallback: if we found a subject, maybe the row topic is missing but we have a default?
                            // Logic: If row topic is provided, it tries to override. If not, fallback to default.
                            errors.push(`Row ${rowNum}: Topic required`)
                            continue
                        }

                        if (!row.question) {
                            errors.push(`Row ${rowNum}: Question content missing`)
                            continue
                        }

                        // Check for duplicates
                        // We normalize by trimming whitespace. Strict equality check.
                        const existingQuestion = await prisma.question.findFirst({
                            where: {
                                subjectId: subject.id,
                                topicId: topic.id,
                                content: clean(row.question)
                            },
                            select: { id: true }
                        })

                        if (existingQuestion) {
                            errors.push(`Row ${rowNum}: Duplicate question skipped`)
                            continue
                        }

                        await prisma.question.create({
                            data: {
                                subjectId: subject.id,
                                topicId: topic.id,
                                content: clean(row.question),
                                difficulty: parseDifficulty(row.difficulty),
                                options: [
                                    clean(row.option1),
                                    clean(row.option2),
                                    clean(row.option3),
                                    clean(row.option4)
                                ].filter(Boolean),
                                correctOption: parseCorrectOption(row.correctOption),
                                explanation: row.explanation ? clean(row.explanation) : undefined,
                            }
                        })
                        successCount++

                    } catch (err: any) {
                        errors.push(`Row ${rowNum}: ${err.message}`)
                    }
                }

                revalidatePath("/admin/questions")
                resolve({
                    success: true,
                    count: successCount,
                    errors: errors.length > 0 ? errors : undefined
                })
            }
        })
    })
}
